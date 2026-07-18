# Kids Learn Code — API (backend)

Next.js (App Router) API for **Код для дітей**. Serves health, card stubs, and the **«Збери вираз»** game endpoints.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001).

`ALLOWED_ORIGIN` — comma-separated browser origins allowed by CORS (default `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm start` | Start production server on 3001 |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | `{ "ok": true }` |
| GET | `/api/cards` | Static card stubs |
| GET | `/api/game/expression/levels` | Game levels (no correct answers) |
| POST | `/api/game/expression/check` | `{ levelId, choiceId }` → `{ correct, message }` |

## Deploy (e.g. Vercel)

1. Import this repository on Vercel (Next.js preset).
2. Set env `ALLOWED_ORIGIN` to your frontend URL(s), e.g. `https://your-web.vercel.app` (comma-separated if several).
3. Deploy, then put the API public URL into the web app’s `VITE_API_URL` and redeploy the web app.

See `CONTRACT.md` and `GAME_CONTRACT.md`.

Companion web repo: `kids-learn-code-web`.
