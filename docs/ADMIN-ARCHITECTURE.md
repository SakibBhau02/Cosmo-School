# Admin panel & content architecture

How the Cosmo School site is edited, published and scaled. Read this before
touching the CMS.

## 1. Principles

1. **One source of truth.** Editable copy lives in Postgres (`content_docs`).
   Code holds the *defaults* only, so a fresh database still renders a complete
   site.
2. **Draft → publish.** Editors save drafts; visitors only ever see the
   `published` JSON. Publishing snapshots a version.
3. **English is primary, Bengali is a backup.** Every text field is
   `{ en, bn }`. The site defaults to `en`; the header toggle switches to `bn`
   and falls back to `en` when a Bengali value is empty.
4. **The database is untrusted.** Documents are coerced against the compiled-in
   default shape before they are stored or merged (`src/content/merge.ts`), so a
   bad payload can never inject unknown keys or unbounded data.
5. **Fail soft.** If Postgres is unreachable, every reader falls back to the
   defaults instead of throwing.

## 2. Layers

| Layer | File | Responsibility |
|---|---|---|
| Defaults | `src/content/defaults/*.ts` | English-first copy, typed, no DB access |
| Registry | `src/content/registry.ts` | Which documents exist + the form schema the admin renders |
| Store | `src/content/store.ts` | Read published (cached), read draft, save, publish, reset, list status |
| Merge/validate | `src/content/merge.ts` | `coerceToShape`, `mergeDoc`, `pickLocalized` |
| Public API | `src/app/api/cms/site` | Serves legacy `SiteContent` **plus** `content: { global, home }` |
| Admin API | `src/app/api/admin/content*` | Session-authenticated draft/publish endpoints |
| Admin UI | `src/app/admin/**` | Login, dashboard, per-page editors, legacy tools |

### Read path

```
page / layout
  └── getPublishedDoc(key)         (unstable_cache, tag "content", 300 s)
        ├── content_docs.published  ← Postgres (wins)
        └── mergeDoc(defaults, …)   ← code defaults fill every gap
```

`getGlobalContent()` is read in `src/app/(site)/layout.tsx` and passed to
`<Footer>`; the home page receives `content.home` through `/api/cms/site`.

### Write path

```
/admin/pages/:key
  ├── PUT  /api/admin/content/:key            → saveDraft (coerce + upsert + audit_log)
  └── POST /api/admin/content/:key {publish}  → publishDraft (snapshot + audit_log)
                                               → revalidateTag("content")
                                               → revalidatePath(page.path)
```

## 3. Authentication

- **Accounts:** `users` table — `email`, `password_hash` (scrypt, `scrypt$salt$hash`),
  `name`, `role` (`superadmin` | `editor` | `viewer`), `last_login_at`.
- **Sessions:** `POST /api/auth/login` verifies the password and sets an
  HttpOnly `cosmo_admin` cookie (12 h). Only the SHA-256 of the token is stored
  in `sessions`.
- **Gateways:**
  - `src/proxy.ts` checks the cookie *exists* on `/admin/**` and `/api/admin/**`
    (optimistic redirect / 401). It never trusts the value.
  - Pages and API routes call `getAdminUser()` / `authorizeAdmin()`, which
    validates the session against the database on every request.
  - The legacy `x-admin-key` header still works (`authorizeAdmin` fallback) so
    the old tools keep running during the migration.
- **Roles:** `viewer` can read; `editor` and `superadmin` can save/publish.
  New accounts are created with `npm run seed:admin` (see below).
- **Throttle:** 8 failed logins per IP per 10 minutes (in-process).

## 4. Database objects

| Object | Purpose |
|---|---|
| `content_docs` | `key`, `draft`, `published`, `updated_by/at`, `published_by/at` |
| `content_versions` | Snapshot per publish (`key`, `version`, `doc`, `saved_by`) |
| `sessions` | Admin sessions (hash, user, expiry, user-agent) |
| `audit_log` | Existing table, now written on save/publish/reset/login |
| `users` | Extended with `name`, `last_login_at` |

Migration: `drizzle/0002_content_cms.sql` (idempotent).

## 5. Adding an editor for another page

1. **Default document** — create `src/content/defaults/about.ts` exporting the
   English-first shape.
2. **Register it** — add the default to `CONTENT_DEFAULTS` in
   `registry.ts` and a `PageSchema` entry to `CONTENT_PAGES` with its sections
   and fields (`text`, `textarea`, `localized`, `localizedList`, `list`,
   `boolean`, `number`, `select`, `image`, `url`, `json`).
3. **Read it** — call `getPublishedDoc<AboutContent>("about")` from the page
   (server component) or add it to `/api/cms/site` for a client page.

The sidebar and dashboard pick the page up automatically. No API or UI code is
needed per page.

## 6. Operations

```bash
npm run db:migrate        # apply drizzle/*.sql
npm run seed:admin        # create/reset the admin login, prints credentials
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:admin   # non-interactive
npm run typecheck
npm run build
```

Login at `/admin/login`. Sessions expire after 12 hours.

## 7. Current coverage (Phase 2)

Editable today:

- **Home** — hero copy/CTAs/video, the admission offer block (headline,
  deadline, bullets, helpline, fine print, on/off switch), section headings.
- **Site settings** — identity, contact, social links, every admission banner
  (header badge, hero badge, footer strip, apply label, helpline) and SEO
  defaults.
- **Notices** (`/admin/notices`) — English + Bengali title and body, tag, date,
  pin, draft/publish, delete. Drafts never reach visitors; published notices
  revalidate the board, the ticker and the detail page.
- **Media** (`/admin/media`) — upload, alt text (EN/BN), copy URL, delete,
  search.
- **Inquiry inbox** (`/admin/inquiries`) — filter by status, mark
  new/contacted/done, internal notes, delete, CSV export.
- **Accounts** (`/admin/users`) — create logins, change roles, reset passwords,
  delete. Guarded so the panel always keeps one superadmin.

Still served by the older layer (legacy tools at `/admin/legacy`): events, fees,
testimonials, day-long school, hero slides and the JSON escape hatches.

## 8. Roadmap

| Phase | Scope |
|---|---|
| ~~2~~ | ✅ Notices, media library, inquiry inbox, users & roles |
| 3 | Page editors for About, Academics, Admission, Clubs, Contact, Gallery, Leadership, Mission & Vision, Results, Teachers, Day-Long School + an image picker for image fields |
| 4 | Retire `config/site.ts` + `data/*.json` as content sources, drop the WordPress write-through, version rollback UI |

## 9. Known gaps

- The legacy panel still authenticates with `ADMIN_KEY` and stores it in
  `localStorage`; it is isolated at `/admin/legacy` and is not linked from the
  public site.
- `data/cms.json` and `config/site.ts` still hold Bengali-only notice bodies for
  the seed fallback; the database rows carry English and win on read.
- `revalidatePath("/")` covers `global` changes but sub-pages that read global
  content are revalidated by tag on their next request (stale-while-revalidate).

