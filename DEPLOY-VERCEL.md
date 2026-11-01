# Vercel Deploy — Independent (No External Access Needed)
# User must complete these 3 steps in browser.

STEP 1 — Environment Variables (Vercel Dashboard)
URL: https://vercel.com → [Project] → Settings → Environment Variables
Paste each line from .env.production.local (12 items):
  DATABASE_URL, DATABASE_URL_MIGRATE, STORAGE_DRIVER=r2,
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
  R2_BUCKET=cosmoweb, R2_PUBLIC_BASE_URL,
  ADMIN_KEY, REVALIDATE_SECRET, PREVIEW_SECRET

STEP 2 — Redeploy
Deployments → last build → ⋮ → Redeploy → Production

STEP 3 — Verify (open in browser)
https://<YOUR-VERCEL-URL>/api/health?deep=1
Expected: {"db":"ok","r2":"ok","media":5,"admin":"ok"}

NOTE: I (agent) cannot access Vercel dashboard / CLI token.
All local work complete: R2 upload OK, DB seed OK, .env.production.local ready.
This file exists so the user can complete independently.
