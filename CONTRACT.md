# Kids Learn Code — Shared Contract

## Frontend routes (Ukrainian UI)

| Path | Page | Notes |
|------|------|--------|
| `/` | Головна | Grid of placeholder cards (no fetch, no real logic) |
| `/games` | Ігри | Simple page stub |
| `/lessons` | Уроки | Simple page stub |
| `/progress` | Прогрес | Simple page stub |

## Backend API stubs (no database)

### `GET /api/health`

```json
{ "ok": true }
```

### `GET /api/cards`

Static array of 4 cards:

```json
[
  { "id": "1", "title": "Перший урок", "type": "lesson" },
  { "id": "2", "title": "Другий урок", "type": "lesson" },
  { "id": "3", "title": "Гра: лабіринт", "type": "game" },
  { "id": "4", "title": "Гра: пазли коду", "type": "game" }
]
```

`type` is `"lesson" | "game"`.

## Integration (later — not this phase)

- Frontend env: `VITE_API_URL=http://localhost:3001`
- Backend port: `3001`
- Frontend Vite port: `5173`
- CORS on API must allow `http://localhost:5173`
- Frontend does **not** call the API in this phase — structure only.

## Ownership

- This repo (`kids-learn-code-api`) is owned by the **backend agent only**.
- Do not modify `kids-learn-code-web`.
