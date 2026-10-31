-- Phase 2 — English-first notices and a workable inquiry inbox.
-- Idempotent: safe to re-run.

ALTER TABLE notices ADD COLUMN IF NOT EXISTS body_en text NOT NULL DEFAULT '';
ALTER TABLE notices ADD COLUMN IF NOT EXISTS tag_en  text NOT NULL DEFAULT '';
ALTER TABLE notices ADD COLUMN IF NOT EXISTS pinned  boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS notices_status_idx ON notices (status, published_at DESC);

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notes      text NOT NULL DEFAULT '';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS handled_by text NOT NULL DEFAULT '';
