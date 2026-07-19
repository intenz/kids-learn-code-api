# LESSONS CONTRACT — JavaScript уроки (Kids Learn Code)

Identical copy lives in `kids-learn-code-api` and `kids-learn-code-web`. Follow this contract exactly.

## Product

- Name (UA): **Уроки JavaScript**
- List route: `/lessons`
- Quiz route: `/lessons/js`
- Format: same quiz UX as «Збери вираз» — code board + question + 4 choices
- UI language: Ukrainian
- Correct answers are **never** sent to the client in the levels payload
- Progress `gameId`: `"lesson-js"` (reuse existing Progress model + X-Player-Id)

## API

Base URL (frontend): `VITE_API_URL=http://localhost:3001`

### `GET /api/lessons/js/levels`

Response shape (no `correctChoiceId`):

```json
{
  "levels": [
    {
      "id": "js-1",
      "title": "Змінні та типи",
      "topic": "variables",
      "codeLines": ["let age = 10", "typeof age"],
      "question": "Що поверне цей код?",
      "choices": [
        { "id": "a", "label": "\"number\"" },
        { "id": "b", "label": "10" },
        { "id": "c", "label": "\"age\"" },
        { "id": "d", "label": "undefined" }
      ]
    }
  ]
}
```

- Backend ships **exactly 10 levels**
- Fields: `id`, `title`, `topic`, `codeLines`, optional `question`, `choices`
- Do **not** include `correctChoiceId` in the JSON response

### `POST /api/lessons/js/check`

Request:

```json
{ "levelId": "js-1", "choiceId": "a" }
```

Response:

```json
{ "correct": true, "message": "Супер!" }
```

or

```json
{ "correct": false, "message": "Спробуй ще" }
```

- Optional header `X-Player-Id` (valid UUID v4): on success path, record progress with `gameId: "lesson-js"` via the same helpers pattern as expression
- Soft-fail DB errors (still return check result; log error)
- If header missing: check works, no progress write

CORS: allow origin `http://localhost:5173`. Methods `GET`, `POST`, `OPTIONS`. Headers `Content-Type, X-Player-Id`. Use `withCors(response, request)`.

### `GET /api/progress/summary` (update)

Include `lesson-js` in `games[]` when implemented:

```json
{
  "games": [
    {
      "gameId": "expression",
      "title": "Збери вираз",
      "totalLevels": 6,
      "completedLevels": 2,
      "percent": 33
    },
    {
      "gameId": "lesson-js",
      "title": "Уроки JavaScript",
      "totalLevels": 10,
      "completedLevels": 0,
      "percent": 0
    }
  ]
}
```

## Level list (10 topics)

| id   | topic (EN)   | title (UA)              |
|------|--------------|-------------------------|
| js-1 | variables    | Змінні та типи          |
| js-2 | strings      | Рядки                   |
| js-3 | arrays       | Масиви                  |
| js-4 | objects      | Об’єкти                 |
| js-5 | if           | Умови (if)              |
| js-6 | for          | Цикл for                |
| js-7 | functions    | Функції                 |
| js-8 | filter       | filter                  |
| js-9 | map          | map                     |
| js-10| combo        | filter + map            |

Messages UA: success «Супер!», «Молодець!»; fail «Спробуй ще».

## File ownership

### Backend (`kids-learn-code-api`)

- `LESSONS_CONTRACT.md`
- `lib/jsLessons.ts` — levels data + correct answers server-side
- `app/api/lessons/js/levels/route.ts`
- `app/api/lessons/js/check/route.ts`
- `lib/progress.ts` — record/summary helpers for `lesson-js`
- Optionally keep expression progress helpers unchanged

### Frontend (`kids-learn-code-web`)

- `LESSONS_CONTRACT.md`
- `src/api/jsLessons.ts` — fetch levels + check (send `X-Player-Id` on check)
- `src/hooks/useJsLessons.ts`
- `src/pages/JsLessonsPage.tsx` — quiz page
- `src/pages/LessonsPage.tsx` — list with card to JS lessons
- `src/App.tsx` — route `/lessons/js`
- `src/pages/ProgressPage.tsx` — show `lesson-js` when summary includes it

**Reuse** from expression game (do not duplicate UI):

- `CodeBoard`, `ChoiceList`, `GameFeedback` from `src/components/game/expression`

## Page composition

`JsLessonsPage` should roughly:

```tsx
const lesson = useJsLessons()
// loading / error states in Ukrainian
// show level title + topic + "Рівень X з Y"
// <CodeBoard lines={lesson.level.codeLines} />
// question text if present
// <ChoiceList choices={...} selectedId={...} onSelect={lesson.select} />
// button «Перевірити» -> lesson.check()
// <GameFeedback result={lesson.feedback} />
// when correct: button «Далі» -> lesson.next()
```

Hook: load levels, track index/selection/feedback, call check endpoint, advance level.
