#!/usr/bin/env bash
# Jaroché — self-contained VPS deployment script.
#
# Runs the entire setup end-to-end on a fresh checkout: Postgres user/db,
# .env generation, install, build, Prisma migrate + seed, pm2 services,
# and a sample nginx vhost. Re-running is safe — it reuses existing state.
#
# Usage:
#   bash /var/www/carl/jaroche/deploy.sh
#
# Optional overrides (export before running):
#   DOMAIN=jaroche.example.com  CLIENT_PORT=3001  SERVER_PORT=4001
#   DB_NAME=jaroche_prod        DB_USER=jaroche
#
# Defaults pick non-conflicting ports (3001 / 4001) so it won't collide
# with other apps on the same VPS.

set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/carl/jaroche}"
DOMAIN="${DOMAIN:-}"
CLIENT_PORT="${CLIENT_PORT:-3001}"
SERVER_PORT="${SERVER_PORT:-4001}"
DB_NAME="${DB_NAME:-jaroche_prod}"
DB_USER="${DB_USER:-jaroche}"

cd "$REPO_DIR"

G='\033[0;32m'; Y='\033[0;33m'; R='\033[0;31m'; N='\033[0m'
say()  { echo -e "${G}==>${N} $*"; }
warn() { echo -e "${Y}!!!${N} $*"; }
die()  { echo -e "${R}xxx${N} $*"; exit 1; }

# ---------------------------------------------------------------- preflight
say "Preflight checks"
for cmd in node npm psql openssl sed grep; do
  command -v "$cmd" >/dev/null || die "$cmd is required but not installed"
done
if ! command -v pm2 >/dev/null; then
  warn "pm2 not found — installing globally via npm"
  npm install -g pm2
fi
echo "node : $(node -v)"
echo "npm  : $(npm -v)"
echo "psql : $(psql --version)"
echo "pm2  : $(pm2 -v)"

# ---------------------------------------------------------------- postgres
say "Postgres database ($DB_NAME / $DB_USER)"
if [ -f .env ] && grep -q "^DATABASE_URL=" .env; then
  EXISTING=$(grep "^DATABASE_URL=" .env | head -1 | sed -E 's/^DATABASE_URL="?([^"]+)"?$/\1/')
  DB_PASS=$(echo "$EXISTING" | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
  warn "Reusing DB password from existing .env"
else
  DB_PASS=$(openssl rand -hex 16)
fi

sudo -u postgres psql <<PSQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  ELSE
    ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
PSQL

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public"
PGPASSWORD="$DB_PASS" psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" >/dev/null \
  || die "DB connection check failed"
say "DB connection OK"

# ---------------------------------------------------------------- .env
say "Writing .env"
if [ ! -f .env ]; then
  JWT_ACCESS_SECRET=$(openssl rand -hex 64)
  JWT_REFRESH_SECRET=$(openssl rand -hex 64)
  CLIENT_URL_VAL="http://127.0.0.1:${CLIENT_PORT}"
  [ -n "$DOMAIN" ] && CLIENT_URL_VAL="https://${DOMAIN}"
  cat > .env <<ENV
DATABASE_URL="${DATABASE_URL}"
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
BCRYPT_ROUNDS=12
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
PORT=${SERVER_PORT}
CLIENT_URL=${CLIENT_URL_VAL}
NEXT_PUBLIC_API_BASE=/api
API_TARGET=http://127.0.0.1:${SERVER_PORT}
NODE_ENV=production
ENV
  chmod 600 .env
  say ".env written ($(stat -c '%U:%G %a' .env 2>/dev/null || stat -f '%Su:%Sg %A' .env))"
else
  warn ".env already exists — leaving in place"
fi

# pm2 starts the Next client with `--cwd client`, so it can't see the repo-root .env.
# Next.js loads client/.env.production at build + runtime — API_TARGET must live here
# for server-component fetches to reach the Express API.
say "Writing client/.env.production"
cat > client/.env.production <<ENV
API_TARGET=http://127.0.0.1:${SERVER_PORT}
NEXT_PUBLIC_API_BASE=/api
ENV
chmod 600 client/.env.production

# ---------------------------------------------------------------- next.config rewrite
say "Pointing Next /api rewrite at 127.0.0.1:${SERVER_PORT}"
if [ -f client/next.config.ts ] && grep -qE "(localhost|127\.0\.0\.1):[0-9]+" client/next.config.ts; then
  cp client/next.config.ts client/next.config.ts.bak
  sed -i -E "s|http://localhost:[0-9]+|http://127.0.0.1:${SERVER_PORT}|g" client/next.config.ts
  sed -i -E "s|http://127\.0\.0\.1:[0-9]+|http://127.0.0.1:${SERVER_PORT}|g" client/next.config.ts
fi

# ---------------------------------------------------------------- install
say "npm install (workspaces — a few minutes on cold cache)"
npm install

# ---------------------------------------------------------------- env into shell
set -a
# shellcheck disable=SC1091
source .env
set +a

# ---------------------------------------------------------------- build
say "Building shared → server → client"
npm -w shared run build
npm -w server run build
npm -w client run build

# ---------------------------------------------------------------- prisma
say "Running Prisma migrate deploy + seed"
( cd server && npx prisma migrate deploy )
( cd server && npx prisma db seed ) || warn "seed step failed or already applied — continuing"

# ---------------------------------------------------------------- pm2
say "(Re)starting pm2 services: jaroche-server :${SERVER_PORT}, jaroche-client :${CLIENT_PORT}"
NPM_BIN="$(which npm)"
pm2 delete jaroche-server 2>/dev/null || true
pm2 delete jaroche-client 2>/dev/null || true

pm2 start "$NPM_BIN" \
  --name jaroche-server \
  --cwd "$REPO_DIR/server" \
  --interpreter none \
  -- run start

sleep 2

pm2 start "$NPM_BIN" \
  --name jaroche-client \
  --cwd "$REPO_DIR/client" \
  --interpreter none \
  -- run start -- -p "$CLIENT_PORT"

pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# ---------------------------------------------------------------- nginx sample
say "Writing nginx vhost sample to $REPO_DIR/nginx-jaroche.conf"
SERVER_NAME="${DOMAIN:-_}"
cat > "$REPO_DIR/nginx-jaroche.conf" <<NGINX
# Jaroché vhost — proxies the storefront. Next.js internally proxies
# /api/* to the Express server, so this only needs one upstream.
server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAME};

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:${CLIENT_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINX

# ---------------------------------------------------------------- summary
echo
echo "===================================================="
say "Deployment complete"
echo "===================================================="
pm2 ls
echo
echo "Local checks:"
echo "  curl -sI http://127.0.0.1:${CLIENT_PORT} | head -3"
echo "  curl -s  http://127.0.0.1:${SERVER_PORT}/api/products | head -c 200"
echo
echo "Put it on a domain (after pointing DNS to this VPS):"
echo "  1. Edit server_name in $REPO_DIR/nginx-jaroche.conf"
echo "  2. sudo cp $REPO_DIR/nginx-jaroche.conf /etc/nginx/sites-available/jaroche.conf"
echo "  3. sudo ln -sf /etc/nginx/sites-available/jaroche.conf /etc/nginx/sites-enabled/"
echo "  4. sudo nginx -t && sudo systemctl reload nginx"
echo "  5. sudo certbot --nginx -d jaroche.YOUR-DOMAIN.com"
echo
echo "Stripe (when you have keys, edit .env and restart):"
echo "  STRIPE_SECRET_KEY=sk_live_...   STRIPE_WEBHOOK_SECRET=whsec_..."
echo "  pm2 restart jaroche-server"
echo
echo "Admin login (seeded):  admin@jaroche.dev / Password123!"
echo
