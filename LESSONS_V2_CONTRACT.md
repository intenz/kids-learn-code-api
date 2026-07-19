# LESSONS V2 CONTRACT — JS modules (wave 2)

Parent owns this file. Backend and Frontend agents follow ownership strictly.

## Product

Ukrainian quiz lessons (code + 4 choices). Correct answers **never** sent to client.

Wave 2 modules (new). Existing `lesson-js` (js-1…js-10) stays as module **basics**.

| moduleId     | gameId               | Title (UA)   | Levels |
|--------------|----------------------|--------------|--------|
| `basics`     | `lesson-js`          | Основи       | existing js-1…js-10 |
| `arrays`     | `lesson-js-arrays`   | Масиви       | 7 new  |
| `objects`    | `lesson-js-objects`  | Об’єкти      | 6 new  |
| `functions`  | `lesson-js-functions`| Функції      | 6 new  |

Wave 3 later: `classes`, `async` — **do not implement now**.

## API

### `GET /api/lessons/js/modules`

```json
{
  "modules": [
    {
      "id": "basics",
      "gameId": "lesson-js",
      "title": "Основи",
      "description": "Змінні, рядки, умови, цикли, filter/map",
      "levelCount": 10
    },
    {
      "id": "arrays",
      "gameId": "lesson-js-arrays",
      "title": "Масиви",
      "description": "length, push, includes, find, slice…",
      "levelCount": 7
    },
    {
      "id": "objects",
      "gameId": "lesson-js-objects",
      "title": "Об’єкти",
      "description": "ключі, вкладеність, деструктуризація",
      "levelCount": 6
    },
    {
      "id": "functions",
      "gameId": "lesson-js-functions",
      "title": "Функції",
      "description": "параметри, return, arrow, callback",
      "levelCount": 6
    }
  ]
}
```

### `GET /api/lessons/js/levels?module=<moduleId>`

`module` required: `basics` | `arrays` | `objects` | `functions`.  
Missing/invalid → `400`.

Response same shape as before:

```json
{
  "levels": [
    {
      "id": "arr-1",
      "title": "…",
      "topic": "…",
      "codeLines": ["…"],
      "question": "Що поверне цей код?",
      "choices": [{ "id": "a", "label": "…" }]
    }
  ]
}
```

For `module=basics`, return existing levels from current `jsLessons` (ids `js-1`…).

### `POST /api/lessons/js/check`

Body: `{ "moduleId": "arrays", "levelId": "arr-1", "choiceId": "a" }`  
(Also accept legacy body `{ levelId, choiceId }` for basics-only if already deployed — prefer requiring `moduleId`.)

Response: `{ "correct": boolean, "message": string }`

If `X-Player-Id` valid UUID: record progress with the module’s `gameId`.  
Soft-fail DB errors. Missing header: still return check result.

### Progress summary

`GET /api/progress/summary` must list all four gameIds when player has any activity (and ideally always show registered games with 0 progress). Update `lib/progress.ts` accordingly: totalLevels per gameId = level count for that module.

## Content guidelines (Backend)

Simple kid-friendly JS snippets. Ukrainian titles/questions. 4 choices each.

### arrays (7): arr-1…arr-7
length, push (length after), pop return value, includes, indexOf, find, slice (copy not mutate) — keep simple.

### objects (6): obj-1…obj-6
dot access, bracket access, assign property then read, Object.keys length, nested `user.address.city`, destructuring `{ name }`.

### functions (6): fn-1…fn-6
basic return, default param, missing return → undefined, arrow function, callback map-style one-liner concept, function as value assigned to const then call.

## Ownership

### Backend only — `kids-learn-code-api`
- Refactor/extend `lib/jsLessons.ts` (or split `lib/jsLessons/` modules) with all levels
- Modules metadata helper
- Update levels route to support `?module=`
- Update check route for `moduleId` + progress gameId mapping
- `GET /api/lessons/js/modules/route.ts`
- Progress summary totals for new gameIds
- Copy this contract; README note
- `npm run build` must pass

Do NOT touch web.

### Frontend only — `kids-learn-code-web`
- `GET` modules on LessonsPage — cards for each module linking to `/lessons/js/:moduleId`
- Route `/lessons/js/:moduleId` (keep `/lessons/js` redirect to `basics` optional)
- Update `jsLessons` API client + hook to pass moduleId
- Quiz page reuses CodeBoard / ChoiceList / GameFeedback
- Progress page should display all games from summary (already generic — verify titles)
- README; copy this contract
- `npm run build` must pass

Do NOT touch API.

## Verify
curl modules; curl levels?module=arrays; check with header; both builds.
