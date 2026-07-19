import { optionsResponse, withCors } from "@/lib/cors";
import { isValidPlayerId, recordExpressionEvent } from "@/lib/progress";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  const playerId = request.headers.get("X-Player-Id");
  if (!isValidPlayerId(playerId)) {
    return withCors(
      Response.json(
        { error: "Missing or invalid X-Player-Id header" },
        { status: 400 },
      ),
      request,
    );
  }

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
    typeof (body as { correct?: unknown }).correct !== "boolean" ||
    !(body as { levelId: string }).levelId
  ) {
    return withCors(
      Response.json(
        { error: "Expected { levelId: string, correct: boolean }" },
        { status: 400 },
      ),
      request,
    );
  }

  const { levelId, correct } = body as {
    levelId: string;
    correct: boolean;
  };

  await recordExpressionEvent(playerId, levelId, correct);
  return withCors(Response.json({ ok: true }), request);
}
