# Kids Learn Code — API (backend)

Next.js (App Router) API for **Код для дітей**. Serves health, card stubs, the **«Збери вираз»** game, and player progress (SQLite via Prisma).

## Local setup

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001).

### Environment

| Variable | Description |
|----------|-------------|
| `ALLOWED_ORIGIN` | Comma-separated browser origins for CORS (default `http://localhost:5173`) |
| `DATABASE_URL` | SQLite path for Prisma, e.g. `file:./dev.db` (relative to the `prisma/` folder) |

### Database

Progress is stored in SQLite. After changing `prisma/schema.prisma`, sync the local DB:

```bash
npx prisma db push
```

Generated client lives under `node_modules/@prisma/client`. The DB file (`prisma/dev.db`) is gitignored.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm start` | Start production server on 3001 |
| `npx prisma db push` | Apply schema to SQLite (no migration history) |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | `{ "ok": true }` |
| GET | `/api/cards` | Static card stubs |
| GET | `/api/game/expression/levels` | Game levels (no correct answers) |
| POST | `/api/game/expression/check` | `{ levelId, choiceId }` → `{ correct, message }`. Optional `X-Player-Id` records progress (soft-fail on DB errors) |
| GET | `/api/progress/expression` | Expression progress for player (`X-Player-Id` required) |
| POST | `/api/progress/expression/event` | `{ levelId, correct }` — record an event (`X-Player-Id` required) |
| GET | `/api/progress/summary` | Per-game progress summary (`X-Player-Id` required) |

CORS allows methods `GET, POST, OPTIONS` and headers `Content-Type, X-Player-Id`.

Player identity: anonymous UUID in header `X-Player-Id` (UUID v4). Missing/invalid header on progress routes → `400`.

See `CONTRACT.md`, `GAME_CONTRACT.md`, and `PROGRESS_CONTRACT.md`.

## Deploy (e.g. Vercel)

1. Import this repository on Vercel (Next.js preset).
2. Set env `ALLOWED_ORIGIN` to your frontend URL(s), e.g. `https://your-web.vercel.app` (comma-separated if several).
3. Set `DATABASE_URL` for the deployed SQLite (or a persistent store appropriate for your host).
4. Deploy, then put the API public URL into the web app’s `VITE_API_URL` and redeploy the web app.

Companion web repo: `kids-learn-code-web`.
