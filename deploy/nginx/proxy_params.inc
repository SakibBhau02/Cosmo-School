# Shared proxy settings for the Next.js upstream.
# Included by every `location` block in cosmo.conf.

proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;

proxy_connect_timeout 10s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;

# Cache in memory only; the app already sets its own Cache-Control.
proxy_buffering on;
proxy_buffers 16 16k;
proxy_busy_buffers_size 32k;
