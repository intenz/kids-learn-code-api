import { optionsResponse, withCors } from "@/lib/cors";
import { isJsLessonModuleId } from "@/lib/jsLessons";
import {
  getLessonJsProgress,
  isValidPlayerId,
} from "@/lib/progress";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const playerId = request.headers.get("X-Player-Id");
  if (!isValidPlayerId(playerId)) {
    return withCors(
      Response.json(
        { error: "Header X-Player-Id must be a valid UUID v4" },
        { status: 400 },
      ),
      request,
    );
  }

  const moduleParam = new URL(request.url).searchParams.get("module");
  if (!moduleParam || !isJsLessonModuleId(moduleParam)) {
    return withCors(
      Response.json(
        {
          error:
            "Query module is required: basics | arrays | objects | functions",
        },
        { status: 400 },
      ),
      request,
    );
  }

  const progress = await getLessonJsProgress(playerId, moduleParam);
  return withCors(Response.json(progress), request);
}
