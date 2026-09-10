# EDUCATED-ARENA

Educated Gamer Arena (EGA) — Pakistan's premier competitive Free Fire digital esports battleground.

## Overview 
- **Combat Modes**: 1v1 One-Tap Aim, 2v2 Duo Clash, 4v4 Clash Squad, Guild vs Guild (GvG), Craftland, and Battle Royale.
- **Financial Integrity**: Double-entry ledger system with automated escrow holds, referee verification, and verified Easypaisa / JazzCash transactions (PKR).
- **Esports Atmosphere**: High-impact Cyber Neon HUD theme, real-time live ticker, dynamic categories, and ELO rating leaderboards.
 
## Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack, TypeScript Strict)
- **Styling**: Tailwind CSS v4, Framer Motion, Lucide Icons
- **Database**: PostgreSQL (Neon Database) with Prisma ORM
- **Media & Assets**: Cloudinary SDK
- **Testing**: Vitest Suite

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
DATABASE_URL="your-neon-postgres-connection-string"
AUTH_SECRET="your-32-character-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

3. Initialize Prisma & Run Migrations:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Build for Production:
```bash
npm run build
```
