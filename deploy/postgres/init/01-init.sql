-- Runs once, on first container start with an empty data volume.
-- Keep this file idempotent-ish; it is only used to initialise a fresh cluster.

ALTER DATABASE cosmo SET timezone TO 'Asia/Dhaka';

-- Modest safety rails for a school site.
ALTER SYSTEM SET log_min_duration_statement = '500ms';
