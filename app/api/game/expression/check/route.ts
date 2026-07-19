import { optionsResponse, withCors } from "@/lib/cors";
import { checkAnswer } from "@/lib/expressionGame";
import { isValidPlayerId, recordExpressionEvent } from "@/lib/progress";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withCors(
      Response.json({ error: "Invalid JSON body" }, { status: 400 }),
      request,
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { levelId?: unknown }).levelId !== "string" ||
    typeof (body as { choiceId?: unknown }).choiceId !== "string" ||
    !(body as { levelId: string }).levelId ||
    !(body as { choiceId: string }).choiceId
  ) {
    return withCors(
      Response.json(
        { error: "Expected { levelId: string, choiceId: string }" },
        { status: 400 },
      ),
      request,
    );
  }

  const { levelId, choiceId } = body as {
    levelId: string;
    choiceId: string;
  };

  const result = await checkAnswer(levelId, choiceId);
  if (!result) {
    return withCors(
      Response.json({ error: "Level not found" }, { status: 404 }),
      request,
    );
  }

  const playerId = request.headers.get("X-Player-Id");
  if (isValidPlayerId(playerId)) {
    try {
      await recordExpressionEvent(playerId, levelId, result.correct);
    } catch (error) {
      console.error("Failed to record expression progress:", error);
    }
  }

  return withCors(Response.json(result), request);
}
