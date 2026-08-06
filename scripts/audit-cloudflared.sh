#!/usr/bin/env bash
set -u

printf 'cloudflared_state=%s\n' "$(systemctl is-active cloudflared 2>/dev/null || true)"
printf 'cloudflared_fragment=%s\n' "$(systemctl show cloudflared -p FragmentPath --value 2>/dev/null || true)"
printf 'cloudflared_exec='
systemctl show cloudflared -p ExecStart --value 2>/dev/null | sed -E 's/(--token[= ]+)[^ ;}]+/\1[REDACTED]/g; s/(TUNNEL_TOKEN=)[^ ;}]+/\1[REDACTED]/g'

for config in /etc/cloudflared/config.yml /etc/cloudflared/config.yaml "$HOME/.cloudflared/config.yml"; do
  if [[ -f "$config" ]]; then
    printf 'cloudflared_config=%s\n' "$config"
    grep -E '^[[:space:]]*(hostname|service|path|noTLSVerify|originRequest):' "$config" || true
  fi
done
