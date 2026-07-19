# Kids Learn Code — API (backend)

Next.js (App Router) API for **Код для дітей**. Serves health, cards, lessons, progress, and the **«Збери вираз»** game — backed by **Prisma + SQLite**.

## Local setup

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001).

| Env | Description |
|-----|-------------|
| `ALLOWED_ORIGIN` | Comma-separated browser origins for CORS (default `http://localhost:5173`) |
| `DATABASE_URL` | SQLite path, default `file:./prisma/dev.db` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Start production server on 3001 |
| `npm run db:migrate` | Apply migrations (dev) |
| `npm run db:seed` | Seed lessons, cards, expression levels |
| `npm run db:reset` | Reset DB + re-seed |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | `{ "ok": true }` |
| GET | `/api/cards` | Home cards from DB |
| GET | `/api/lessons` | Lesson list |
| GET | `/api/lessons/:id` | Lesson detail |
| POST | `/api/players` | Create anonymous player |
| GET | `/api/progress?playerId=` | Player progress |
| POST | `/api/progress` | Upsert progress |
| GET | `/api/game/expression/levels` | Game levels (no correct answers) |
| POST | `/api/game/expression/check` | `{ levelId, choiceId }` → `{ correct, message }` |

## Deploy (e.g. Vercel)

SQLite + `better-sqlite3` is for **local / single-node** use. For serverless (Vercel), plan a switch to hosted Postgres (or Turso) and update the Prisma adapter.

1. Import this repository on Vercel (Next.js preset).
2. Set `ALLOWED_ORIGIN` to your frontend URL(s).
3. Set `DATABASE_URL` for your hosted DB once migrated off SQLite.
4. Deploy, then put the API public URL into the web app’s `VITE_API_URL`.

See `CONTRACT.md` and `GAME_CONTRACT.md`.

Companion web repo: `kids-learn-code-web`.
