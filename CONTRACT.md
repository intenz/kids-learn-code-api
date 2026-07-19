# Kids Learn Code — Shared Contract

## Frontend routes (Ukrainian UI)

| Path | Page | Notes |
|------|------|--------|
| `/` | Головна | Can fetch `GET /api/cards` |
| `/games` | Ігри | Links to games; expression at `/games/expression` |
| `/lessons` | Уроки | Can fetch `GET /api/lessons` |
| `/progress` | Прогрес | Can fetch `GET /api/progress?playerId=` |

## Database (Prisma + SQLite)

Local file: `prisma/dev.db` via `DATABASE_URL`.

| Table | Purpose |
|-------|---------|
| `Card` | Home grid cards (`lesson` \| `game`) |
| `Lesson` | Lesson content |
| `Game` | Games (`slug`: `expression`, `maze`, …) |
| `GameLevel` | Levels + **server-only** `correctChoiceId` |
| `Player` | Anonymous learner id (no auth yet) |
| `Progress` | Per-player lesson / level completion |

Seed: `npm run db:seed` (or `prisma migrate reset`).

## Backend API

### `GET /api/health`

```json
{ "ok": true }
```

### `GET /api/cards`

```json
[
  { "id": "1", "title": "Перший урок", "type": "lesson", "href": "/lessons" },
  { "id": "4", "title": "Гра: Збери вираз", "type": "game", "href": "/games/expression" }
]
```

`type` is `"lesson" | "game"`. `href` is optional.

### `GET /api/lessons`

```json
{
  "lessons": [
    { "id": "lesson-1", "title": "Перший урок", "summary": "Знайомство зі змінними" }
  ]
}
```

### `GET /api/lessons/:id`

```json
{
  "id": "lesson-1",
  "title": "Перший урок",
  "summary": "Знайомство зі змінними",
  "body": "Змінна зберігає значення. Наприклад: let a = 3"
}
```

### `POST /api/players`

Optional body `{ "id": "…" }` to use a client-chosen id; otherwise server generates one.

```json
{ "id": "clx…", "createdAt": "…" }
```

### `GET /api/progress?playerId=`

```json
{
  "playerId": "clx…",
  "progress": [
    {
      "id": "…",
      "itemType": "game_level",
      "itemId": "expr-1",
      "gameId": "game-expression",
      "completed": true,
      "attempts": 2,
      "updatedAt": "…"
    }
  ]
}
```

### `POST /api/progress`

```json
{
  "playerId": "clx…",
  "itemType": "lesson",
  "itemId": "lesson-1",
  "completed": true,
  "incrementAttempts": true
}
```

For game levels, also send `"gameId": "game-expression"`. Creates the player if missing.

### Expression game (unchanged shapes)

See `GAME_CONTRACT.md`:

- `GET /api/game/expression/levels` — levels **without** `correctChoiceId`
- `POST /api/game/expression/check` — `{ levelId, choiceId }` → `{ correct, message }`

## Integration

- Frontend env: `VITE_API_URL=http://localhost:3001`
- Backend port: `3001`
- Frontend Vite port: `5173`
- CORS on API must allow `http://localhost:5173`
- Methods: `GET`, `POST`, `OPTIONS`

## Ownership

- This repo (`kids-learn-code-api`) is owned by the **backend agent only**.
- Do not modify `kids-learn-code-web`.
