# GAME CONTRACT — «Збери вираз» (Expression Game)

Parent orchestrator owns this file. Three agents must follow it exactly.

## Product

- Name (UA): **Збери вираз**
- Route: `/games/expression`
- Games list page links to this route from `/games`
- UI language: Ukrainian
- Correct answer is **never** sent to the client in the levels payload

## API

Base URL (frontend): `VITE_API_URL=http://localhost:3001`

### `GET /api/game/expression/levels`

Response shape:

```json
{
  "levels": [
    {
      "id": "expr-1",
      "title": "Додавання",
      "codeLines": ["let a = 3", "let b = 4", "let result = a + b"],
      "choices": [
        { "id": "a", "label": "7" },
        { "id": "b", "label": "12" },
        { "id": "c", "label": "1" },
        { "id": "d", "label": "34" }
      ]
    }
  ]
}
```

Backend must ship **exactly 6 levels** covering `+`, `*`, combinations, and multiple variables. Do not include `correctChoiceId` in the JSON response.

### `POST /api/game/expression/check`

Request:

```json
{ "levelId": "expr-1", "choiceId": "a" }
```

Response:

```json
{ "correct": true, "message": "Супер!" }
```

or

```json
{ "correct": false, "message": "Спробуй ще" }
```

CORS: allow origin `http://localhost:5173`. Methods must include `GET`, `POST`, `OPTIONS`.

## File ownership (STRICT — do not touch other agents' files)

### Agent 1 — UI only (`kids-learn-code-web`)

Create only:

- `src/components/game/expression/CodeBoard.tsx`
- `src/components/game/expression/ChoiceList.tsx`
- `src/components/game/expression/GameFeedback.tsx`
- `src/components/game/expression/expression.css`
- `src/components/game/expression/index.ts` (barrel exports allowed)

**No fetch. No pages. No App.tsx. No api/. No hooks/.**

### Agent 2 — Wire FE↔BE only (`kids-learn-code-web`)

Create/edit only:

- `src/api/expressionGame.ts`
- `src/hooks/useExpressionGame.ts`
- `src/pages/ExpressionGamePage.tsx`
- `src/App.tsx` (add route `/games/expression`)
- `src/pages/GamesPage.tsx` (card/link to the game)
- `.env` with `VITE_API_URL=http://localhost:3001`

Import UI from `../components/game/expression` (or `@/` if alias exists). Match prop names below.

### Agent 3 — Backend only (`kids-learn-code-api`)

Create/edit only:

- `lib/expressionGame.ts` (levels data + correct answers server-side)
- `app/api/game/expression/levels/route.ts`
- `app/api/game/expression/check/route.ts`
- `lib/cors.ts` (add POST to allowed methods if needed)
- Optionally update card title in existing cards data for this game

**Do not touch the web project.**

## UI component props (Agent 1 must export these names)

### `CodeBoard`

```ts
type CodeBoardProps = {
  lines: string[]
}
```

### `ChoiceList`

```ts
type Choice = { id: string; label: string }

type ChoiceListProps = {
  choices: Choice[]
  selectedId: string | null
  onSelect: (id: string) => void
  disabled?: boolean
}
```

### `GameFeedback`

```ts
type GameFeedbackProps = {
  result: { correct: boolean; message: string } | null
}
```

## Page composition (Agent 2)

`ExpressionGamePage` should roughly:

```tsx
const game = useExpressionGame()
// loading / error states in Ukrainian
// show level title + "Рівень X з Y"
// <CodeBoard lines={game.level.codeLines} />
// <ChoiceList choices={...} selectedId={...} onSelect={game.select} />
// button «Перевірити» -> game.check()
// <GameFeedback result={game.feedback} />
// when correct: button «Далі» -> game.next()
```

Hook responsibilities: load levels from API, track index/selection/feedback, call check endpoint, advance level.

## Suggested 6 levels (Agent 3 — answers stay server-side)

1. `a + b` → 7  
2. `a * b` → 12  
3. `a * b + 2` → 14  
4. three vars sum  
5. `(a + b) * c` style  
6. slightly harder mix  

Messages UA: success variants like «Супер!», «Молодець!» ; fail «Спробуй ще».
