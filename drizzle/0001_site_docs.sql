-- Phase 1.5 — editable site documents.
-- /admin writes these instead of data/*.json, because the repo filesystem is
-- read-only on Vercel. Idempotent so it can be re-run safely.
CREATE TABLE IF NOT EXISTS site_docs (
  key        text PRIMARY KEY,
  doc        jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
