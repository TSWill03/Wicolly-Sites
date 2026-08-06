#!/usr/bin/env bash
set -euo pipefail

backup_dir="$(find /root/codex-backups -maxdepth 1 -type d -name 'hefesto-nginx-default-*' -printf '%T@ %p\n' | sort -nr | head -n 1 | cut -d' ' -f2-)"
test -n "$backup_dir"
(cd "$backup_dir" && sha256sum -c SHA256SUMS)
tar -tzf "$backup_dir/default-root.tar.gz" | sed -n '1,10p'
nginx -t
printf 'backup=%s\n' "$backup_dir"
printf 'random_host_status=%s\n' "$(curl -sS -o /dev/null -w '%{http_code}' --header 'Host: random.invalid' http://127.0.0.1/)"
printf 'direct_ip_status=%s\n' "$(curl -sS -o /dev/null -w '%{http_code}' --header 'Host: 127.0.0.1' http://127.0.0.1/)"
printf 'blacklight_origin_status=%s\n' "$(curl -sS -o /dev/null -w '%{http_code}' --header 'Host: wp-origin.wicolly.com.br' http://127.0.0.1/)"
