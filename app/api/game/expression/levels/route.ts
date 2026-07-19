import { optionsResponse, withCors } from "@/lib/cors";
import { getPublicLevels } from "@/lib/expressionGame";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const levels = await getPublicLevels();
  return withCors(Response.json({ levels }), request);
}
