#!/usr/bin/env bash
# Deploy this repo's build artifacts to the KBG server.
#   ./deploy.sh
# Ships the repo root to a new timestamped release and atomically swaps the
# symlink Caddy's root points at, so a deploy is never half-applied.

set -euo pipefail

HOST="${KBG_HOST:-ubuntu@144.24.122.125}"
RELEASES="/var/www/kbgwebsite-releases"
CURRENT="/var/www/kbgwebsite"
KEEP=5

cd "$(dirname "$0")"
test -f index.html || { echo "FATAL: run from the deploy repo root"; exit 1; }

REL="$(date +%Y%m%d%H%M%S)"
echo "▸ release $REL"

# NOTE: rsync is NOT installed on the server — tar over ssh.
# COPYFILE_DISABLE stops macOS shipping AppleDouble ._* files into the webroot.
ssh "$HOST" "sudo mkdir -p $RELEASES/$REL"
COPYFILE_DISABLE=1 tar czf - --exclude .git --exclude DEPLOY.md --exclude deploy.sh . \
  | ssh "$HOST" "sudo tar xzf - -C $RELEASES/$REL"

ssh "$HOST" "
  set -e
  sudo find $RELEASES/$REL -name '._*' -delete
  sudo find $RELEASES/$REL -name '.DS_Store' -delete
  sudo chown -R caddy:caddy $RELEASES/$REL
  sudo find $RELEASES/$REL -type d -exec chmod 755 {} \;
  sudo find $RELEASES/$REL -type f -exec chmod 644 {} \;

  test -f $RELEASES/$REL/index.html || { echo 'FATAL: no index.html; not swapping'; exit 1; }

  sudo ln -sfn $RELEASES/$REL ${CURRENT}.new
  sudo mv -Tf ${CURRENT}.new $CURRENT

  cd $RELEASES && ls -1dt */ | tail -n +$((KEEP + 1)) | xargs -r sudo rm -rf
  echo '▸ live:' \$(readlink $CURRENT)
"

echo "▸ verifying"
for p in / /about /team /events /projects /race; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://144.24.122.125${p}")
  printf '   %-10s %s\n' "$p" "$code"
  [ "$code" = "200" ] || { echo "FAILED on $p"; exit 1; }
done
echo "▸ done"
