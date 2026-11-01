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
  - The legacy `x-admin-key` header is still accepted by `authorizeAdmin()`
    (no UI uses it) so scripts and emergency recovery keep working.
- **Roles:** `viewer` can read; `editor` and `superadmin` can save/publish.
  New accounts are created with `npm run seed:admin` (see below).
- **Throttle:** 8 failed logins per IP per 10 minutes (in-process).

## 4. Database objects

| Object | Purpose |
|---|---|
| `content_docs` | `key`, `draft`, `published`, `updated_by/at`, `published_by/at` |
| `content_versions` | Snapshot per publish (`key`, `version`, `doc`, `saved_by`) |
| `gallery_events` | Event albums (`slug`, EN/BN title + description, date, location, cover, status, sort) |
| `gallery_photos` | Photos per album (URL, dimensions, EN/BN alt + caption, sort); cascade-deleted with the album |
| `sessions` | Admin sessions (hash, user, expiry, user-agent) |
| `audit_log` | Existing table, now written on save/publish/reset/login |
| `users` | Extended with `name`, `last_login_at` |

Migration: `drizzle/0002_content_cms.sql` (idempotent) plus
`drizzle/0004_gallery_events.sql` for event albums.

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
npm run db:migrate        # apply drizzle/*.sql (includes gallery albums)
npm run db:seed:gallery   # one-time: turn existing gallery photos into albums
npm run seed:admin        # create/reset the admin login, prints credentials
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:admin   # non-interactive
npm run typecheck
npm run check:content     # editor schema ↔ default document
npm run check:editor      # render every editor control
npm run build
```

Login at `/admin/login`. Sessions expire after 12 hours.

## 7. Current coverage

Editable today:

- **Home** — hero copy/CTAs/video, hero slides with per-slide buttons, stat
  counters, upcoming events, guardian testimonials, the admission offer block
  (headline, deadline, bullets, helpline, fine print, on/off switch), the
  “Our Levels” cards (title, age badge in EN + BN, description, image, link),
  a **Day Long School preview** and the gallery/testimonial headings.
  The preview card reads its name, tagline, age, timing, photo and the three
  highlights live from the published Day-Long School page, so editing that page
  updates the home page too. Only the framing (eyebrow, optional heading/intro
  override, photo override, button labels, on/off) lives on Home.
- **Site settings** — identity, contact, social links, every admission banner
  (header badge, hero badge, footer strip, apply label, helpline) and SEO
  defaults.
- **About** — hero (copy + background image), section jump links, who-we-are,
  journey milestones, facility cards, story paragraphs, beliefs, the four
  working-structure groups, wider approach and both call-to-action buttons.
- **Academics** — hero, the four learning stages (image, age band, description,
  optional highlight), weekly routine table, commitment points and the
  academic goal steps.
- **Admission** — hero, the eight admission steps, required documents, age
  criteria table, guardian FAQs and the inquiry-form block.
- **Clubs** — hero plus one card per club (icon, name, description) and the
  card button labels/links.
- **Contact** — page headings, campus/office card labels and the map embed
  (phone, e-mail, address, hours and social links come from Site settings).
- **Leadership** — hero, the three leader messages (photo, name, role,
  eyebrow, paragraphs) and the faculty section headings/button.
- **Mission & Vision** — hero, principal's message, mission points and the
  admission button.
- **Results** — headline numbers, stat labels, table column labels and rows.
- **Teachers** — hero and one card per teacher (optional photo, name, role,
  subject, experience). The Leadership page renders the same list.
- **Day-Long School** — hero, parent worries, the full daily routine, special
  features, photo strip, staff spotlight, guardian quote, the twelve
  why-Cosmo reasons, the Cosmo Promise, all feature cards, campus-visit block,
  visit-request form labels and the sticky sub-navigation.
- **Notices** (`/admin/notices`) — English + Bengali title and body, tag, date,
  pin, draft/publish, delete.
- **Gallery albums** (`/admin/gallery`) — one album per event (Poha Boishakh, Eid,
  Book Fair, Science Fair), with a title/description in EN + BN, date, location,
  cover photo, draft/publish visibility and sort order. Each album accepts
  **many photos at once** (drag-and-drop, up to 40 per upload), photos from the
  media library, per-photo EN/BN alt text and captions, reordering and cover
  selection. Deleting an album cascades its photos.
- **Gallery page** — the page headings and footnote. Public albums live at
  `/gallery` and `/gallery/<slug>` with `ImageGallery` + `BreadcrumbList`
  structured data, canonical URLs and Open Graph images.
- **Media** (`/admin/media`) — upload many files at once, alt text (EN/BN), copy
  URL, delete, search. The same library powers the image picker and gallery
  albums.
- **Inquiry inbox** (`/admin/inquiries`) — filter by status, mark
  new/contacted/done, internal notes, delete, CSV export.
- **Accounts** (`/admin/users`) — create logins, change roles, reset passwords,
  delete. Guarded so the panel always keeps one superadmin.

The original panel (`/admin/legacy`) and its `site-content` endpoint have been
removed. Its content is either migrated above or scheduled below.

## 8. Roadmap

| Phase | Scope |
|---|---|
| ~~1~~ | ✅ English-first site, content engine, session auth, admin shell, home + site settings |
| ~~2~~ | ✅ Notices, media library, inquiry inbox, users & roles |
| ~~3~~ | ✅ Page editors for About, Academics, Admission, Clubs, Contact, Gallery, Leadership, Mission & Vision, Results, Teachers, Day-Long School + media-library image picker |
| ~~3.5~~ | ✅ Event-based gallery albums with bulk upload, admin shell/dashboard/editor UX refresh, gallery SEO (`ImageGallery` JSON-LD, canonical, Open Graph), `sitemap.xml` and `robots.txt` |
| 4 | Retire `config/site.ts` + `data/*.json` as content sources, preview/rollback UI, WordPress code removal |

## 9. Admin UX & search

- **Navigation.** The sidebar groups Dashboard → Pages → Content (Gallery,
  Notices, Media, Inquiries) → Settings (Site settings, Accounts). Page rows carry
  a status dot (published / draft / defaults), and the filter box narrows the page
  list. The header shows the current section and a constant “drafts are private”
  reminder.
- **Long editors.** Page editors with more than four sections open the first
  section and collapse the rest. Section chips jump and expand, and “Expand all”
  / “Collapse all” are one click. Save/publish stay in the sticky bar.
- **Uploads.** Every image field can take a file directly (camera or gallery on
  a phone), drag-and-drop, the media library, or a pasted URL. The browser
  downscales to 2000 px and re-encodes to WebP before sending, so large phone
  photos still upload quickly on mobile data; the server then runs `sharp`
  (EXIF rotation, 1600 px max, WebP quality 82, metadata stripped) and stores the
  result in Cloudflare R2 (`STORAGE_DRIVER=r2`, `R2_*`). Gallery albums and the
  media library both accept batches. Deleting a row also deletes the object.
- **R2 configuration.** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`, plus
  `STORAGE_DRIVER=r2`. Without them the driver falls back to local disk
  (`public/uploads`) so development still works; `/admin/media` shows which
  driver is active.
- **Search / AEO / GEO.** Public gallery pages return canonical URLs, Open Graph
  and Twitter cards, `ImageGallery` and `BreadcrumbList` JSON-LD, semantic
  `<figure>` / `<figcaption>` markup, descriptive alt text and visible event
  date/location. `/sitemap.xml` lists every published album and `/robots.txt`
  keeps crawlers out of `/admin` and `/api`. The admin panel stays `noindex`.

## 10. Known gaps

- The home page still mixes content documents with legacy `getSiteContent()`
  data (clubs, the FlexibleSchooling block and `site.programs`, which is now only
  the fallback for the editable “Our Levels” cards). Phase 4 moves the rest into
  documents too.
- **Age criteria have three editable homes by design** — the home “Our Levels”
  age badges, the Academics stage age bands and the Admission age-criteria table.
  Each renders from its own document, so change a number in all three if the
  policy applies everywhere. `config/site.ts` no longer exports `ageCriteria`
  (it was a stale duplicate); `config/site.ts` `programs[].age` only seeds the
  defaults for a fresh database.
- `data/cms.json` and `config/site.ts` still hold Bengali-only notice bodies for
  the seed fallback; database rows carry English and win on read.
- `NEXT_PUBLIC_SITE_URL` should be set in production so canonical URLs, Open
  Graph and `sitemap.xml` point at the real domain (it falls back to the Vercel
  URL or localhost).
- The `x-admin-key` header is still accepted by `authorizeAdmin()` for scripts
  and emergencies; the UI only uses real sessions.
- Schema checks (`npm run check:content` and `npm run check:editor`) validate
  every editor field against its default document and render each control.
  They are developer tools, not part of the build.


