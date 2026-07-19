import { optionsResponse, withCors } from "@/lib/cors";
import { getLesson } from "@/lib/lessons";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const lesson = await getLesson(id);

  if (!lesson) {
    return withCors(
      Response.json({ error: "Lesson not found" }, { status: 404 }),
      request,
    );
  }

  return withCors(Response.json(lesson), request);
}
