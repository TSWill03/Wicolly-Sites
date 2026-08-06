#!/usr/bin/env bash
set -u

printf 'host=%s\n' "$(hostname)"
printf 'architecture=%s\n' "$(uname -m)"
printf 'uptime=%s\n' "$(uptime -p)"

for service in tailscaled docker nginx caddy cloudflared; do
  printf 'service:%s=%s\n' "$service" "$(systemctl is-active "$service" 2>/dev/null || true)"
done

if sudo -n nginx -t >/tmp/wicolly-nginx-test.log 2>&1; then
  printf 'nginx_config=valid\n'
else
  printf 'nginx_config=invalid\n'
  sed -n '1,8p' /tmp/wicolly-nginx-test.log
fi
rm -f /tmp/wicolly-nginx-test.log

printf 'nginx_routes_begin\n'
sudo -n nginx -T 2>&1 | grep -E '^[[:space:]]*(listen|server_name|root|proxy_pass|return)[[:space:]]' || true
printf 'nginx_routes_end\n'
printf 'nginx_sites_begin\n'
sudo -n ls -l /etc/nginx/sites-enabled /etc/nginx/sites-available 2>/dev/null || true
printf 'nginx_default_begin\n'
sudo -n sed -n '1,220p' /etc/nginx/sites-enabled/default 2>/dev/null || true
printf 'nginx_default_end\n'
printf 'default_root_begin\n'
sudo -n find /var/www/html -maxdepth 2 -type f -printf '%p %s bytes\n' 2>/dev/null || true
printf 'default_root_end\n'

printf 'containers_begin\n'
sudo -n docker ps --format '{{.Names}}' 2>/dev/null || true
printf 'containers_end\n'

for host in 127.0.0.1 random.invalid wicolly.com.br wp-origin.wicolly.com.br; do
  status="$(curl -sS -o /dev/null -w '%{http_code}' --header "Host: $host" http://127.0.0.1/ || true)"
  printf 'http:%s=%s\n' "$host" "$status"
done
