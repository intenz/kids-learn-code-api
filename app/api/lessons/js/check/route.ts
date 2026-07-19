import { optionsResponse, withCors } from "@/lib/cors";
import {
  checkAnswer,
  getGameIdForModule,
  isJsLessonModuleId,
  type JsLessonModuleId,
} from "@/lib/jsLessons";
import { isValidPlayerId, recordLessonJsEvent } from "@/lib/progress";

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
        {
          error:
            "Expected { moduleId: string, levelId: string, choiceId: string }",
        },
        { status: 400 },
      ),
      request,
    );
  }

  const raw = body as {
    levelId: string;
    choiceId: string;
    moduleId?: unknown;
  };

  let moduleId: JsLessonModuleId = "basics";
  if (raw.moduleId !== undefined) {
    if (typeof raw.moduleId !== "string" || !isJsLessonModuleId(raw.moduleId)) {
      return withCors(
        Response.json(
          {
            error:
              "moduleId must be one of: basics | arrays | objects | functions",
          },
          { status: 400 },
        ),
        request,
      );
    }
    moduleId = raw.moduleId;
  }

  const result = await checkAnswer(moduleId, raw.levelId, raw.choiceId);
  if (!result) {
    return withCors(
      Response.json({ error: "Level not found" }, { status: 404 }),
      request,
    );
  }

  const gameId = await getGameIdForModule(moduleId);
  const playerId = request.headers.get("X-Player-Id");
  if (gameId && isValidPlayerId(playerId)) {
    try {
      await recordLessonJsEvent(
        playerId,
        gameId,
        raw.levelId,
        result.correct,
      );
    } catch (error) {
      console.error("Failed to record lesson-js progress:", error);
    }
  }

  return withCors(Response.json(result), request);
}
