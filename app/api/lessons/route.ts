import { optionsResponse, withCors } from "@/lib/cors";
import { listLessons } from "@/lib/lessons";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const lessons = await listLessons();
  return withCors(Response.json({ lessons }), request);
}
