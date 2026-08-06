#!/usr/bin/env bash
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  printf 'Run as root.\n' >&2
  exit 1
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_dir="/root/codex-backups/hefesto-nginx-default-${stamp}"
config="/etc/nginx/sites-available/default"

mkdir -p "$backup_dir"
cp --preserve=all "$config" "$backup_dir/default"
tar -C / -czf "$backup_dir/default-root.tar.gz" var/www/html
tar -tzf "$backup_dir/default-root.tar.gz" >/dev/null
printf '%s  %s\n' "$(sha256sum "$backup_dir/default" | awk '{print $1}')" default >"$backup_dir/SHA256SUMS"
printf '%s  %s\n' "$(sha256sum "$backup_dir/default-root.tar.gz" | awk '{print $1}')" default-root.tar.gz >>"$backup_dir/SHA256SUMS"

cat >"${config}.codex-new" <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    access_log off;
    log_not_found off;
    return 404;
}
NGINX

cp --preserve=mode,ownership "$config" "${config}.codex-old"
mv "${config}.codex-new" "$config"

if ! nginx -t; then
  mv "${config}.codex-old" "$config"
  nginx -t
  printf 'New configuration rejected; original restored.\n' >&2
  exit 1
fi

systemctl reload nginx
rm -f "${config}.codex-old"
(cd "$backup_dir" && sha256sum -c SHA256SUMS)
printf 'backup=%s\n' "$backup_dir"
printf 'random_host_status=%s\n' "$(curl -sS -o /dev/null -w '%{http_code}' --header 'Host: random.invalid' http://127.0.0.1/)"
printf 'direct_ip_status=%s\n' "$(curl -sS -o /dev/null -w '%{http_code}' --header 'Host: 127.0.0.1' http://127.0.0.1/)"
printf 'blacklight_origin_status=%s\n' "$(curl -sS -o /dev/null -w '%{http_code}' --header 'Host: wp-origin.wicolly.com.br' http://127.0.0.1/)"
