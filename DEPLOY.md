# Deploy: Vercel + Neon + Cloudflare R2

The app is a Next.js 16 frontend with three pieces of state:

| State | Where it lives in production | Why |
|---|---|---|
| Page HTML | Vercel build + ISR | static, revalidated by tag |
| Editable content, notices, inquiries, media rows | **Neon Postgres** | Vercel's filesystem is read-only |
| Uploaded images | **Cloudflare R2** | same reason — nothing may be written to disk |

Locally nothing changes: without R2 credentials the storage driver stays `disk`
(`public/uploads`), and without `VERCEL` set the JSON seed files stay writable.

---

## 0. Prerequisites

- Node 20+ (this repo was verified on Node 22.23)
- A Neon account, a Cloudflare account (with the site domain **on Cloudflare DNS**), a Vercel account
- The repo in git. **This folder is not a git repo yet** — Vercel needs one:

```bash
git init && git add . && git commit -m "deploy prep"
gh repo create cosmo_web --private --source=. --push   # or push to an existing remote
```

---

## 1. Neon (database)

1. **console.neon.tech → New Project**
   - Region: **Singapore (ap-southeast-1)** — closest to Bangladesh
   - Postgres 17 is fine; the app only uses `pg` + Drizzle
2. Open **Connection Details** and copy **both** strings:

| Variable | Which string | Looks like |
|---|---|---|
| `DATABASE_URL` | **Pooled** (toggle "Connection pooling") | `...@ep-cool-1234-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_URL_MIGRATE` | **Direct** (pooling off) | `...@ep-cool-1234.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |

> The pooled host has `-pooler` in it. The app uses the pooled one (serverless
> functions each open a small pool); migrations use the direct one because DDL
> through a PgBouncer transaction pooler is unreliable.

3. Create `cosmo_web/.env.production.local` (gitignored) from the template and
   paste your values in:

```bash
cp .env.production.example .env.production.local
```

4. Apply the schema and load the seed content:

```bash
npm run db:migrate:prod     # creates tables + site_docs
npm run db:seed:prod        # loads data/*.json (notices, pages, sections, ...)
```

`db:seed` refuses to run against a non-local host unless you set
`ALLOW_PROD_SEED=1`, because it `TRUNCATE`s the CMS tables. On a fresh Neon
project that guard is the right thing to trip over — confirm it is the empty
database you think it is, then:

```bash
ALLOW_PROD_SEED=1 npm run db:seed:prod
```

5. Verify:

```bash
npm run check:env:prod
```

Expect `db tables  OK  pages, sections, notices, media, inquiries, site_docs`
and `notices rows  OK  6`.

---

## 2. Cloudflare R2 (images)

1. **Cloudflare dashboard → R2 → Create bucket**
   - Name: `cosmo-media`
   - Location hint: **APAC**
2. **Manage R2 API Tokens → Create API token**
   - Permissions: **Object Read & Write**
   - Scope: **only this bucket** (`cosmo-media`)
   - Copy the **Access Key ID** and **Secret Access Key** (shown once)
   - Note the **Account ID** from the R2 overview page
3. **Attach a custom domain** — bucket → Settings → **Custom Domains → Connect Domain**
   - e.g. `cdn.cosmoschools.org`
   - The zone must be on Cloudflare; Cloudflare creates the CNAME for you
   - Leave "Public access" off — the custom domain *is* the public path

> Not using a custom domain? You can enable the `r2.dev` URL instead, but it is
> rate-limited and not meant for production traffic. If you do, put that URL in
> `R2_PUBLIC_BASE_URL` — `/api/health` will warn you about it.

4. No CORS configuration is needed: the browser never talks to R2 directly,
   uploads are proxied through `/api/admin/media` on the server.

5. Fill in the R2 block of `.env.production.local`:

```env
STORAGE_DRIVER=r2
R2_ACCOUNT_ID=<account id>
R2_ACCESS_KEY_ID=<access key id>
R2_SECRET_ACCESS_KEY=<secret access key>
R2_BUCKET=cosmo-media
R2_PUBLIC_BASE_URL=https://cdn.cosmoschools.org
```

---

## 3. Vercel

1. **vercel.com → Add New → Project → import the repo.** Framework is detected
   automatically (`nextjs`); no `vercel.json` and no build-command override needed
   (`npm run build`).
2. **Settings → Environment Variables** — add every non-comment key from
   `.env.production.local` for **Production** (and Preview, if you want previews
   to work). Generate the secrets fresh:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

| Key | Notes |
|---|---|
| `DATABASE_URL` | pooled Neon string |
| `DATABASE_URL_MIGRATE` | direct string (used only by CLI scripts) |
| `STORAGE_DRIVER` | `r2` |
| `R2_ACCOUNT_ID` | |
| `R2_ACCESS_KEY_ID` | |
| `R2_SECRET_ACCESS_KEY` | |
| `R2_BUCKET` | `cosmo-media` |
| `R2_PUBLIC_BASE_URL` | `https://cdn.yourdomain` — **must be set before the build**, `next.config.ts` reads it to allowlist the image host |
| `ADMIN_KEY` | 32+ random chars. **If unset in production, admin endpoints lock themselves** |
| `REVALIDATE_SECRET` | 32+ random chars |
| `PREVIEW_SECRET` | 32+ random chars |
| `WORDPRESS_*` | **leave out** unless a public WordPress exists — a localhost URL makes every request wait for a timeout |

3. **Region:** Project → Settings → Functions → set **Singapore (`sin1`)**, the
   same region as Neon. Cross-region DB calls are the main latency source here.
4. **Deploy.**

---

## 4. Verify the deployment

```bash
curl "https://<your-app>.vercel.app/api/health"
curl "https://<your-app>.vercel.app/api/health?deep=1"
```

`?deep=1` also sends a signed `HEAD` to the R2 bucket, so it proves the
credentials work end-to-end. Expect:

```json
{ "ok": true,
  "db":      { "ok": true, "latencyMs": 25 },
  "storage": { "driver": "r2", "bucket": "cosmo-media", "ready": true },
  "bucket":  { "ok": true, "status": 200 } }
```

Returns `503` with `ok:false` when something is wrong — point an uptime monitor
at it.

Then, in the browser:

1. Open `/admin`, unlock with `ADMIN_KEY`
2. **Media → upload an image** → the returned URL must start with your CDN domain
3. **Content → save something** → reload the public page, the change persists
   (this writes to the `site_docs` table, not to disk)
4. Submit the admission form on `/contact` → the inquiry appears in the admin
   inbox

---

## What changed in the code to make this work

| File | Change |
|---|---|
| `src/lib/r2.ts` | **new** — dependency-free S3 SigV4 client (PUT/DELETE/HEAD) for R2 |
| `src/lib/storage.ts` | `disk` + `r2` drivers; driver inferred from credentials; `deleteStored()`; clear error if disk is used on a read-only fs |
| `src/lib/db/client.ts` | Neon-friendly pool (TLS auto-detect, small pool, timeouts), `dbPing()` |
| `src/lib/db/schema.ts`, `drizzle/0001_site_docs.sql` | **new** `site_docs` table storing `/admin` content edits |
| `src/lib/db/store.ts` | **new** — Postgres reads/writes that fall back to `null` instead of throwing, so a DB blip can't take the site down |
| `src/lib/cms.ts` | notices/inquiries/content now write to Postgres first and only mirror to `data/*.json` when the fs is writable; `ADMIN_KEY` fails closed in production |
| `src/app/api/admin/media/[id]/route.ts` | deletes from R2, not just disk |
| `src/app/uploads/[...path]/route.ts` | redirects legacy `/uploads/...` paths to the CDN when R2 is configured |
| `src/app/api/health/route.ts` | **new** — deployment smoke test |
| `next.config.ts` | `outputFileTracingIncludes` for `data/*.json` + `drizzle/*.sql` (otherwise missing from the serverless bundle); R2 host allowlisted for `next/image`; local-IP fetch only in dev |
| `scripts/*.mjs` | portable paths (no more `D:\open Code\...`), `.env.production.local` support, prod seed guard, `check:env`, `check:sigv4` |

Useful commands:

```bash
npm run check:env          # local env audit
npm run check:env:prod     # production env audit (DB connect + tables)
npm run check:sigv4        # verifies the R2 signer against AWS's test vector
npm run db:migrate:prod    # apply drizzle/*.sql
npm run db:seed:prod       # reload seed content (TRUNCATEs)
```

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `disk storage is not writable here` on upload | `STORAGE_DRIVER`/`R2_*` not set in Vercel, or a var is missing |
| `/api/health` → `storage.ready: false` | `R2_PUBLIC_BASE_URL` or `R2_BUCKET` missing |
| Uploads succeed but images 404 | Custom domain not connected/active, or `R2_PUBLIC_BASE_URL` has a trailing path |
| `next/image` 400 "hostname not configured" | `R2_PUBLIC_BASE_URL` was added **after** the last build → redeploy |
| Admin returns 401 with the right key | `ADMIN_KEY` unset on Vercel (`env.adminKeyConfigured:false` in `/api/health`) — production fails closed on purpose |
| Content saves but the page doesn't change | ISR cache: hit `/api/revalidate?secret=...` or wait for the revalidate window |
| `db connect` timeout in `/api/health` | using the direct instead of the pooled string, or the wrong region |
| Every page takes ~5s | `WORDPRESS_*` points at something unreachable in production — unset it |
| `relation "site_docs" does not exist` | `npm run db:migrate:prod` was never run against that database |
