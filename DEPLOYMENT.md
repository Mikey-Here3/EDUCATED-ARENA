# Educated Gamer Arena — Production Deployment Guide

This guide provides step-by-step instructions for deploying the Educated Gamer Arena Free Fire competitive platform (PKR) to a production server (Ubuntu 22.04 LTS, Debian, Docker, or Node.js hosting platform).

---

## Architecture Overview

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Runtime**: Node.js v20.x or v22.x LTS
- **Database**: PostgreSQL 15+ (with connection pooling via PgBouncer or Supabase/Neon/AWS RDS)
- **ORM**: Prisma 6 with strict migrations (`prisma migrate deploy`)
- **Storage**: AWS S3, Cloudflare R2, or DigitalOcean Spaces
- **Email**: SMTP or Resend HTTP API
- **Payments**: Manual Pakistani mobile accounts (Easypaisa, JazzCash) with Manager/Admin verification

---

## 1. Prerequisites & System Setup

On your production server:

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v   # v20.x.x
npm -v    # 10.x.x

# Install PM2 globally for process management
sudo npm install -g pm2
```

---

## 2. Production PostgreSQL Database

### Option A: Managed PostgreSQL (Recommended)
Use Supabase, Neon, AWS RDS, or DigitalOcean Managed PostgreSQL:
- Enforce SSL (`sslmode=require`)
- Enable connection pooling (e.g. PgBouncer on port 6543)
- Set max connections appropriate for your traffic (minimum 50)

### Option B: Self-Hosted PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql

CREATE DATABASE educated_gamer_arena;
CREATE USER ega_admin WITH ENCRYPTED PASSWORD 'REPLACE_WITH_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE educated_gamer_arena TO ega_admin;
ALTER DATABASE educated_gamer_arena OWNER TO ega_admin;
\q
```

---

## 3. Environment Variables Configuration

Clone the repository and create `.env` from `.env.example`:

```bash
cd /var/www/educated-gamer-arena
cp .env.example .env
nano .env
```

### Required Production Values:

```env
# Database (SSL required in production)
DATABASE_URL="postgresql://ega_admin:YOUR_DB_PASSWORD@127.0.0.1:5432/educated_gamer_arena?schema=public&sslmode=prefer"

# Authentication — Generate 64-char hex key: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
AUTH_SECRET="f6c8d7e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7"
SESSION_EXPIRY_DAYS=7

# Application URLs
APP_URL="https://educatedgamerarena.com"
NEXT_PUBLIC_APP_URL="https://educatedgamerarena.com"
NODE_ENV="production"

# Email Provider
EMAIL_PROVIDER="smtp"
EMAIL_FROM="noreply@educatedgamerarena.com"
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@mg.educatedgamerarena.com"
SMTP_PASS="YOUR_SMTP_PASSWORD"

# S3/R2 Cloud Storage
STORAGE_PROVIDER="s3"
STORAGE_BUCKET="ega-production-assets"
STORAGE_REGION="ap-south-1"
STORAGE_ACCESS_KEY="YOUR_S3_ACCESS_KEY"
STORAGE_SECRET_KEY="YOUR_S3_SECRET_KEY"
STORAGE_ENDPOINT="https://s3.ap-south-1.amazonaws.com"

# Payment
PAYMENT_PROVIDER="manual"

# Cron Shared Secret
CRON_SECRET="GENERATE_A_RANDOM_CRON_SECRET_KEY"
```

---

## 4. Install Dependencies & Build

```bash
# Clean install of dependencies
npm ci

# Generate Prisma Client
npm run postinstall

# Apply production database migrations (NEVER use db push in production)
npx prisma migrate deploy

# Build Next.js application
npm run build
```

---

## 5. Seed Initial Data (FIRST TIME ONLY)

> **SAFETY WARNING**: Seed data must NEVER run automatically on production deployments. 
> To initialize the required game categories, modes, maps, and system roles:

```bash
# Temporarily allow seed execution for initialization only
NODE_ENV=development npm run db:seed
```

Immediately update the seeded Admin account password via the database or admin interface!

---

## 6. Process Management with PM2

Create an ecosystem file `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [
    {
      name: 'educated-gamer-arena',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

Start the application:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 7. NGINX Reverse Proxy & HTTPS Configuration

Install NGINX & Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Configure `/etc/nginx/sites-available/educatedgamerarena.com`:

```nginx
server {
    server_name educatedgamerarena.com www.educatedgamerarena.com;

    # Client upload limits (for match screenshots & KYC)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site & obtain Let's Encrypt SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/educatedgamerarena.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d educatedgamerarena.com -d www.educatedgamerarena.com
```

---

## 8. Automated Scheduled Jobs (Cron)

Set up a system cron to hit the idempotent cleanup endpoint every 10 minutes:

```bash
crontab -e
```

Add line:
```cron
*/10 * * * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" https://educatedgamerarena.com/api/cron >/dev/null 2>&1
```

This automates:
- Expiring stale open challenges
- Purging expired email verification tokens (>24h)
- Purging expired password reset tokens (>1h)
- Cleaning expired sessions
- Deleting old read notifications (>30 days)

---

## 9. Database Backup Strategy

### Automated Nightly Backups:
Create backup script `/usr/local/bin/backup-ega-db.sh`:

```bash
#!/usr/bin/env bash
set -e
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/postgresql"
mkdir -p "$BACKUP_DIR"

pg_dump -U ega_admin -h 127.0.0.1 -F c -b -v -f "$BACKUP_DIR/ega_db_$TIMESTAMP.dump" educated_gamer_arena

# Retain last 14 days locally
find "$BACKUP_DIR" -type f -name "ega_db_*.dump" -mtime +14 -delete

# Optional: Upload to private off-site S3 backup bucket
# aws s3 cp "$BACKUP_DIR/ega_db_$TIMESTAMP.dump" s3://ega-offsite-backups/database/
```

Make executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup-ega-db.sh
# In crontab:
0 3 * * * /usr/local/bin/backup-ega-db.sh
```

### Recovery Procedure:
```bash
pg_restore -U ega_admin -h 127.0.0.1 -d educated_gamer_arena -v -c /var/backups/postgresql/ega_db_TIMESTAMP.dump
```

---

## 10. Payment Configuration (Easypaisa & JazzCash)

1. Log into the platform with your **Admin** account.
2. Navigate to `/admin/settings` (or configure Payment Methods directly in the database `PaymentMethod` table).
3. Update:
   - **Easypaisa**: Official account title, active phone number, TID submission instructions.
   - **JazzCash**: Official account title, active phone number, instructions.
4. Set minimum deposit: `PKR 50`.
5. Set minimum withdrawal: `PKR 200`.
6. Set platform fee: default `10%`.

---

## 11. Health & Observability Verification

Test the health endpoint:
```bash
curl -I https://educatedgamerarena.com/api/health
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-07T18:25:00.000Z",
  "checks": {
    "app": "ok",
    "database": "ok"
  }
}
```

---

## 12. Complete Production Smoke-Test Checklist

Before opening to public traffic, verify each flow in order:

### Core Match Lifecycle:
- [ ] **Registration**: Sign up with real email `user1@test.com`.
- [ ] **Email Verification**: Receive email token, click link, status becomes verified.
- [ ] **Login**: Sign in with password; verified session cookie `ega_session` is set (Secure, HttpOnly, SameSite=Lax).
- [ ] **Profile**: Set Free Fire UID and In-Game Name.
- [ ] **Deposit (Manual)**: Submit PKR 500 deposit with mock TID.
- [ ] **Manager Approval**: Log in as Manager, verify deposit request, approve. Wallet balance credits PKR 500.
- [ ] **Team**: Create team, invite a teammate, confirm 30-member cap limit.
- [ ] **Create Challenge**: Create PKR 100 1v1 challenge. Ensure PKR 100 is reserved (Available = 400, Reserved = 100).
- [ ] **Accept Challenge**: Second user on matching platform accepts challenge. Match transitions to `MATCH_FIXED`.
- [ ] **Manager Assignment**: Manager claims or assigns match.
- [ ] **Schedule**: Manager sets match date/time. Notifications dispatched to both players.
- [ ] **Room Credentials**: Manager submits Free Fire Room ID and Password. Credentials display only to participants.
- [ ] **Match Result & Evidence**: Winner submits victory screenshot.
- [ ] **Manager Verification**: Manager verifies evidence and marks Side 1 winner.
- [ ] **Settlement**: Match settles:
  - Loser receives PKR 10 refund released to available balance.
  - Winner receives prize pool minus 10% platform fee.
  - Idempotency key prevents duplicate execution.
  - Match status becomes `COMPLETED`.
- [ ] **Leaderboard**: Global public leaderboard immediately updates with new winner ELO rating and total earnings.
- [ ] **Withdrawal**: Submit PKR 250 withdrawal request. Manager approves and marks paid. Available balance debited.
- [ ] **Logout**: Cookies cleared, session deleted from database.
