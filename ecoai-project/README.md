# EcoAI — Luxury Environmental Intelligence Platform

> *Apple Health meets Architectural Digest.* Deep forest greens, muted golds, glassmorphic UI, and cryptographic proof-of-action.

## Architecture

- **Backend:** Node.js + TypeScript + Express (deployed on Render/Railway)
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Framer Motion (deployed on Netlify)
- **Satellite Layer:** NASA MODIS NDVI wrapper with 6/8 confidence scoring
- **Trust Layer:** SHA-256 hash-chained proofs (immutable planting history)

## Quick Start

```bash
# 1. Install everything
npm run install:all

# 2. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# -> fill in Supabase keys, Mapbox token, etc.

# 3. Apply database schema
# Paste database/schema.sql into Supabase SQL editor, then policies.sql

# 4. Run dev (backend on :4000, frontend on :3000)
npm run dev
```

## Deployment

- **Frontend → Netlify**: set `NEXT_PUBLIC_API_URL` to your Render backend URL.
- **Backend → Render**: build cmd `npm install && npm run build`, start cmd `npm start`.
- **DB → Supabase**: already hosted.

## The Trust Chain

Every verified post is stored as:
```
current_hash = SHA256(prev_hash + gps + timestamp + image_url + user_id)
```
Editing any historical post breaks the chain → user's "verified" flag is revoked.

## License

MIT — build something beautiful.
