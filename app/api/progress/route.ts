import { optionsResponse, withCors } from "@/lib/cors";
import {
  listProgress,
  upsertProgress,
  type ProgressItemType,
} from "@/lib/progress";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const playerId = new URL(request.url).searchParams.get("playerId");
  if (!playerId) {
    return withCors(
      Response.json({ error: "Query playerId is required" }, { status: 400 }),
      request,
    );
  }

  const progress = await listProgress(playerId);
  return withCors(Response.json({ playerId, progress }), request);
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

  if (typeof body !== "object" || body === null) {
    return withCors(
      Response.json({ error: "Expected JSON object" }, { status: 400 }),
      request,
    );
  }

  const {
    playerId,
    itemType,
    itemId,
    gameId,
    completed,
    incrementAttempts,
  } = body as {
    playerId?: unknown;
    itemType?: unknown;
    itemId?: unknown;
    gameId?: unknown;
    completed?: unknown;
    incrementAttempts?: unknown;
  };

  if (
    typeof playerId !== "string" ||
    !playerId ||
    (itemType !== "lesson" && itemType !== "game_level") ||
    typeof itemId !== "string" ||
    !itemId
  ) {
    return withCors(
      Response.json(
        {
          error:
            'Expected { playerId, itemType: "lesson"|"game_level", itemId }',
        },
        { status: 400 },
      ),
      request,
    );
  }

  if (
    gameId !== undefined &&
    gameId !== null &&
    typeof gameId !== "string"
  ) {
    return withCors(
      Response.json({ error: "gameId must be a string or null" }, { status: 400 }),
      request,
    );
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return withCors(
      Response.json({ error: "completed must be a boolean" }, { status: 400 }),
      request,
    );
  }

  if (
    incrementAttempts !== undefined &&
    typeof incrementAttempts !== "boolean"
  ) {
    return withCors(
      Response.json(
        { error: "incrementAttempts must be a boolean" },
        { status: 400 },
      ),
      request,
    );
  }

  const progress = await upsertProgress({
    playerId,
    itemType: itemType as ProgressItemType,
    itemId,
    gameId: gameId === undefined ? undefined : (gameId as string | null),
    completed: completed as boolean | undefined,
    incrementAttempts: incrementAttempts as boolean | undefined,
  });

  return withCors(Response.json(progress), request);
}
