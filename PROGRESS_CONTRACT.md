# PROGRESS CONTRACT — SQLite + Prisma + X-Player-Id

Parent orchestrator owns this file. Backend and Frontend agents must follow it exactly.

## Decisions

- DB: SQLite via Prisma in `kids-learn-code-api`
- Player: anonymous UUID in browser `localStorage` key `klc_player_id`
- Header: `X-Player-Id: <uuid>` on progress and check requests
- Game scope: `gameId = "expression"`, levels `expr-1` … `expr-6`

## Prisma models

```prisma
model Player {
  id        String     @id
  createdAt DateTime   @default(now())
  progress  Progress[]
}

model Progress {
  id           String   @id @default(cuid())
  playerId     String
  player       Player   @relation(fields: [playerId], references: [id])
  gameId       String
  levelId      String
  completed    Boolean  @default(false)
  correctCount Int      @default(0)
  wrongCount   Int      @default(0)
  updatedAt    DateTime @updatedAt

  @@unique([playerId, gameId, levelId])
}
```

`DATABASE_URL="file:./dev.db"` (path relative to `prisma/` folder as Prisma expects, e.g. `file:./dev.db` in schema datasource).

## API

### CORS

Allow methods `GET, POST, OPTIONS`.  
Allow headers `Content-Type, X-Player-Id`.  
Keep existing origin logic via `ALLOWED_ORIGIN`.

### `POST /api/game/expression/check` (existing + progress)

Body: `{ "levelId": "expr-1", "choiceId": "a" }`  
Response unchanged: `{ "correct": boolean, "message": string }`

If header `X-Player-Id` is present and a valid UUID:
- Upsert `Player`
- Record progress event for that level (`correct` from check result)
- Soft-fail DB errors (still return check result; log error)
If header missing: behave exactly as before (no progress write)

### `POST /api/progress/expression/event`

Requires `X-Player-Id` (valid UUID) else `400`.  
Body: `{ "levelId": string, "correct": boolean }`  
Upsert Player + Progress:
- if correct: `completed=true`, `correctCount++`
- else: `wrongCount++`  
Response: `{ "ok": true }`

### `GET /api/progress/expression`

Requires `X-Player-Id` else `400`.  
Response shape:

```json
{
  "gameId": "expression",
  "totalLevels": 6,
  "completedLevels": 2,
  "percent": 33,
  "levels": [
    {
      "levelId": "expr-1",
      "title": "Додавання",
      "completed": true,
      "correctCount": 1,
      "wrongCount": 0
    }
  ]
}
```

Include all 6 levels (merge with known level titles from expression game data). Missing DB rows → `completed: false`, counts 0.

### `GET /api/progress/summary`

Requires `X-Player-Id` else `400`.  
Response:

```json
{
  "games": [
    {
      "gameId": "expression",
      "title": "Збери вираз",
      "totalLevels": 6,
      "completedLevels": 2,
      "percent": 33
    }
  ]
}
```

## Ownership (STRICT)

### Backend agent — only `kids-learn-code-api`

- `prisma/schema.prisma`
- `lib/prisma.ts`, `lib/progress.ts`
- Update `lib/cors.ts` (Allow-Headers)
- Update `app/api/game/expression/check/route.ts`
- `app/api/progress/expression/route.ts` (GET)
- `app/api/progress/expression/event/route.ts` (POST)
- `app/api/progress/summary/route.ts` (GET)
- `.env.example`, `.gitignore` (`*.db`), `package.json` deps, `README.md`
- Run `npx prisma db push` or migrate; ensure `npm run build` works

Do NOT touch the web project.

### Frontend agent — only `kids-learn-code-web`

- `src/lib/playerId.ts` — `getOrCreatePlayerId()`
- Update `src/api/expressionGame.ts` — send `X-Player-Id` on `checkAnswer`
- `src/api/progress.ts` — `getExpressionProgress()`, `getProgressSummary()`
- `src/hooks/useProgress.ts`
- Update `src/pages/ProgressPage.tsx` — UA UI with % and level list
- Update `README.md` if needed

Do NOT touch the API project. Do NOT edit game UI components under `components/game/expression/` unless required for headers (prefer api layer only).

## UUID validation

Treat as valid if matches standard UUID v4 regex (case-insensitive).
