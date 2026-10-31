# Deploying on your own server (Postgres + Nginx)

The site runs as one Node process, talks to Postgres on the private network, and
is published by Nginx over HTTPS. No managed database, no WordPress, no Vercel.

```
Internet ──▶ Nginx :443 ──▶ Next.js (app:3000) ──▶ Postgres (db:5432, private)
```

Everything below assumes Ubuntu 22.04/24.04 on a 2 vCPU / 4 GB VPS with Docker.

---

## 1. DNS

Point the domain at the server before requesting a certificate:

| Record | Name | Value |
|---|---|---|
| A | `@` | your server IPv4 |
| A | `www` | your server IPv4 |

## 2. Get the code and secrets

```bash
sudo apt update && sudo apt install -y git docker.io docker-compose-v2
git clone <your-repo> /srv/cosmo && cd /srv/cosmo

cp .env.production.example .env
# edit .env: POSTGRES_PASSWORD, ADMIN_KEY, ADMIN_EMAIL, REVALIDATE_SECRET
```

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Certificates (first run)

```bash
mkdir -p deploy/nginx/certs
# temporary self-signed cert so Nginx can start
openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
  -keyout deploy/nginx/certs/privkey.pem \
  -out deploy/nginx/certs/fullchain.pem \
  -subj "/CN=cosmo.example.org"
# replace the domain in the Nginx config
sed -i 's/cosmo.example.org/YOUR.DOMAIN/g' deploy/nginx/cosmo.conf
```

## 4. Start the stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

## 5. Create the schema and the admin account

```bash
docker compose -f docker-compose.prod.yml exec app npm run db:migrate:prod
docker compose -f docker-compose.prod.yml exec app npm run seed:admin:prod
```

`seed:admin:prod` prints the email and password once — save it, then sign in at
`https://YOUR.DOMAIN/admin/login`.

## 6. Real certificate

```bash
sudo apt install -y certbot
sudo certbot certonly --webroot -w /var/lib/docker/volumes/cosmo_certbot-www/_data \
  -d YOUR.DOMAIN -d www.YOUR.DOMAIN --agree-tos -m you@example.org

sudo cp /etc/letsencrypt/live/YOUR.DOMAIN/fullchain.pem deploy/nginx/certs/
sudo cp /etc/letsencrypt/live/YOUR.DOMAIN/privkey.pem  deploy/nginx/certs/
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

Renewal: `certbot renew --deploy-hook "cd /srv/cosmo && cp -L /etc/letsencrypt/live/YOUR.DOMAIN/*.pem deploy/nginx/certs/ && docker compose -f docker-compose.prod.yml exec nginx nginx -s reload"` in a weekly cron.

---

## 7. Moving the existing data off Neon

The current content lives in a Neon database. Copy it into the new Postgres in
one step (sessions are intentionally not copied):

```bash
cd /srv/cosmo
docker compose -f docker-compose.prod.yml exec app \
  node scripts/db-transfer.mjs \
  --from="postgres://…neon…" \
  --to="postgres://cosmo:PASSWORD@db:5432/cosmo"
```

Run it **after** step 5 so the schema exists. It truncates the target tables
first, so it is safe to re-run. Always keep a dump first:

```bash
docker compose -f docker-compose.prod.yml exec -T db \
  pg_dump -U cosmo cosmo > backup-before-transfer.sql
```

Dry run to see row counts without writing:

```bash
node scripts/db-transfer.mjs --from=… --to=… --dry-run
```

Then switch the app over: set `DATABASE_URL` / `DATABASE_URL_MIGRATE` to the new
server, `docker compose -f docker-compose.prod.yml up -d app`, and check
`/api/health` (`"db":{"ok":true}`).

## 8. Backups (do this on day one)

```bash
# /etc/cron.daily/cosmo-backup
docker compose -f /srv/cosmo/docker-compose.prod.yml exec -T db \
  pg_dump -U cosmo -Fc cosmo > /srv/backups/cosmo-$(date +%F).dump
find /srv/backups -name 'cosmo-*.dump' -mtime +14 -delete
```

Also back up the `uploads` volume if `STORAGE_DRIVER=disk`:

```bash
docker run --rm -v cosmo_uploads:/data -v /srv/backups:/out alpine \
  tar czf /out/uploads-$(date +%F).tar.gz -C /data .
```

Restore a dump with `pg_restore -d cosmo --clean --if-exists <file>`.

## 9. Updating the site

```bash
cd /srv/cosmo && git pull
docker compose -f docker-compose.prod.yml up -d --build app
docker compose -f docker-compose.prod.yml exec app npm run db:migrate:prod
```

Zero-downtime is not configured: expect a couple of seconds of 502 while the app
container restarts. For a school site that is normally fine; schedule it late.

## 10. Health and logs

| Check | Command |
|---|---|
| App + DB health | `curl -s https://YOUR.DOMAIN/api/health` |
| Container status | `docker compose -f docker-compose.prod.yml ps` |
| App logs | `docker compose -f docker-compose.prod.yml logs -f app` |
| Nginx logs | `docker compose -f docker-compose.prod.yml logs -f nginx` |
| Slow queries | `docker compose -f docker-compose.prod.yml logs db \| grep duration` |

`/api/health?deep=1` also checks the storage driver and R2.

## 11. Security checklist

- [ ] `POSTGRES_PASSWORD` is long and random; port 5432 is **not** published.
- [ ] `ADMIN_KEY` is 32+ random bytes; a real admin password is set (12+ chars).
- [ ] Firewall allows only 22, 80, 443: `sudo ufw allow 22,80,443/tcp && sudo ufw enable`.
- [ ] Nginx rate limits are active (`limit_req` zones in `deploy/nginx/cosmo.conf`).
- [ ] `/admin` optionally restricted to school IPs (commented block in the same file).
- [ ] Backups run daily and a restore has been tested once.
- [ ] `docker compose exec app npm run check:env:prod` passes.

## 12. Troubleshooting

| Symptom | Likely cause |
|---|---|
| 502 from Nginx | `app` container down — `docker compose logs app` |
| `db: connection refused` | `db` not healthy yet, or `DATABASE_URL` host is not `db` |
| Login says "Database is not configured" | `DATABASE_URL` missing in the `app` environment |
| Uploads 404 after redeploy | `uploads` volume not mounted |
| Admin redirect loop | cookie blocked — check the domain matches and HTTPS is used |
| Notices show seed content | schema is behind: run `db:migrate:prod` |
