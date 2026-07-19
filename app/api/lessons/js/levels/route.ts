import { optionsResponse, withCors } from "@/lib/cors";
import {
  getPublicLevels,
  isJsLessonModuleId,
} from "@/lib/jsLessons";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const moduleParam = new URL(request.url).searchParams.get("module");

  if (!moduleParam || !isJsLessonModuleId(moduleParam)) {
    return withCors(
      Response.json(
        {
          error:
            "Query param module is required: basics | arrays | objects | functions",
        },
        { status: 400 },
      ),
      request,
    );
  }

  const levels = await getPublicLevels(moduleParam);
  return withCors(Response.json({ levels }), request);
}
