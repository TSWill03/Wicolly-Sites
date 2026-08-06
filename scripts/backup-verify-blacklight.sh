#!/usr/bin/env bash
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  printf 'Run as root.\n' >&2
  exit 1
fi

db_container="blacklight3d-mariadb"
wp_container="blacklight3d-wordpress"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_dir="/root/codex-backups/blacklight-retirement-${stamp}"
restore_db="codex_restore_check_${stamp//[^0-9]/}"

cleanup() {
  docker exec "$db_container" sh -lc 'root_pass="${MARIADB_ROOT_PASSWORD:-${MYSQL_ROOT_PASSWORD:-}}"; mariadb -uroot --password="$root_pass" -e "DROP DATABASE IF EXISTS '$restore_db';"' >/dev/null 2>&1 || true
}
trap cleanup EXIT

mkdir -p "$backup_dir"
tar -C /opt -czf "$backup_dir/blacklight3d-config.tar.gz" blacklight3d
docker exec "$db_container" sh -lc 'db_user="${MARIADB_USER:-${MYSQL_USER:-root}}"; db_pass="${MARIADB_PASSWORD:-${MYSQL_PASSWORD:-${MARIADB_ROOT_PASSWORD:-${MYSQL_ROOT_PASSWORD:-}}}}"; db_name="${MARIADB_DATABASE:-${MYSQL_DATABASE:-wordpress}}"; mariadb-dump --single-transaction -u"$db_user" --password="$db_pass" "$db_name"' | gzip -9 >"$backup_dir/database.sql.gz"
docker cp "$wp_container:/var/www/html/wp-content" "$backup_dir/wp-content" >/dev/null
tar -C "$backup_dir" -czf "$backup_dir/wp-content.tar.gz" wp-content
rm -rf "$backup_dir/wp-content"

gzip -t "$backup_dir/database.sql.gz"
tar -tzf "$backup_dir/blacklight3d-config.tar.gz" >/dev/null
tar -tzf "$backup_dir/wp-content.tar.gz" >/dev/null
(cd "$backup_dir" && sha256sum blacklight3d-config.tar.gz database.sql.gz wp-content.tar.gz >SHA256SUMS && sha256sum -c SHA256SUMS)

docker exec "$db_container" sh -lc 'root_pass="${MARIADB_ROOT_PASSWORD:-${MYSQL_ROOT_PASSWORD:-}}"; mariadb -uroot --password="$root_pass" -e "CREATE DATABASE '$restore_db';"'
gzip -dc "$backup_dir/database.sql.gz" | docker exec -i "$db_container" sh -lc 'root_pass="${MARIADB_ROOT_PASSWORD:-${MYSQL_ROOT_PASSWORD:-}}"; mariadb -uroot --password="$root_pass" "'$restore_db'"'
table_count="$(docker exec "$db_container" sh -lc 'root_pass="${MARIADB_ROOT_PASSWORD:-${MYSQL_ROOT_PASSWORD:-}}"; mariadb -N -uroot --password="$root_pass" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\"'$restore_db'\";"')"
test "$table_count" -gt 0
cleanup
trap - EXIT

printf 'backup=%s\n' "$backup_dir"
printf 'restore_table_count=%s\n' "$table_count"
