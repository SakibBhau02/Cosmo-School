-- Gallery albums (event-based photo galleries).
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS gallery_events (
  id           serial PRIMARY KEY,
  slug         text NOT NULL UNIQUE,
  title_en     text NOT NULL,
  title_bn     text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_bn text NOT NULL DEFAULT '',
  event_date   text NOT NULL DEFAULT '',
  location     text NOT NULL DEFAULT '',
  cover_url    text NOT NULL DEFAULT '',
  cover_file   text NOT NULL DEFAULT '',
  status       text NOT NULL DEFAULT 'published',
  sort         integer NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id           serial PRIMARY KEY,
  event_id     integer NOT NULL REFERENCES gallery_events(id) ON DELETE CASCADE,
  url          text NOT NULL,
  file_path    text NOT NULL DEFAULT '',
  width        integer,
  height       integer,
  size         integer,
  alt_en       text NOT NULL DEFAULT '',
  alt_bn       text NOT NULL DEFAULT '',
  caption_en   text NOT NULL DEFAULT '',
  caption_bn   text NOT NULL DEFAULT '',
  sort         integer NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_events_status_idx
  ON gallery_events (status, sort, id DESC);

CREATE INDEX IF NOT EXISTS gallery_photos_event_idx
  ON gallery_photos (event_id, sort, id);
