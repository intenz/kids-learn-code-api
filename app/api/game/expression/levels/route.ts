import { optionsResponse, withCors } from "@/lib/cors";
import { getPublicLevels } from "@/lib/expressionGame";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export function GET(request: Request) {
  return withCors(Response.json({ levels: getPublicLevels() }), request);
}
