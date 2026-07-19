import { optionsResponse, withCors } from "@/lib/cors";
import { getModules } from "@/lib/jsLessons";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const modules = await getModules();
  return withCors(Response.json({ modules }), request);
}
