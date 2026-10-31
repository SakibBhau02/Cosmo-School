-- Phase 2 — page content CMS + real admin authentication.
-- Idempotent: safe to re-run against an existing database.

-- One row per editable document (home, global, about, ...).
-- `draft` is what the editor saves; `published` is what visitors read.
CREATE TABLE IF NOT EXISTS content_docs (
  key          text PRIMARY KEY,
  draft        jsonb NOT NULL,
  published    jsonb,
  updated_by   text NOT NULL DEFAULT '',
  updated_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  published_by text NOT NULL DEFAULT ''
);

-- Publish history, used for rollback and the activity feed.
CREATE TABLE IF NOT EXISTS content_versions (
  id       serial PRIMARY KEY,
  key      text NOT NULL,
  version  integer NOT NULL,
  doc      jsonb NOT NULL,
  saved_by text NOT NULL DEFAULT '',
  saved_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_versions_key_idx
  ON content_versions (key, version DESC);

-- Server-side admin sessions. Only the SHA-256 hash of the cookie token is
-- stored, so a database leak cannot be replayed as a login.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  user_agent text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions (expires_at);

-- Display name for the admin header ("Signed in as ...").
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
