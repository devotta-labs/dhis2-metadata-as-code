#!/usr/bin/env bash
set -euo pipefail

# Stop the local DHIS2 stack and wipe its data volume so the next
# scripts/dhis2-up.sh gives you a fresh empty instance.
#
# Usage: scripts/dhis2-down.sh [--keep-data]

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
compose_file="$repo_root/docker/docker-compose.yml"

keep_data=0
for arg in "$@"; do
  case "$arg" in
    --keep-data) keep_data=1 ;;
    -h|--help)
      cat <<EOF
Usage: $0 [--keep-data]

  --keep-data   Stop containers but preserve the db-data volume.
                (default: docker compose down -v, wipes the volume)
EOF
      exit 0
      ;;
    *) printf 'unknown arg: %s\n' "$arg" >&2; exit 1 ;;
  esac
done

if (( keep_data )); then
  docker compose -f "$compose_file" down
else
  docker compose -f "$compose_file" down --volumes
fi
