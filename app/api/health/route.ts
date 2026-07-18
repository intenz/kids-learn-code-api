import { optionsResponse, withCors } from "@/lib/cors";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export function GET(request: Request) {
  return withCors(Response.json({ ok: true }), request);
}
