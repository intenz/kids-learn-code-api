import { optionsResponse, withCors } from "@/lib/cors";
import { getExpressionProgress, isValidPlayerId } from "@/lib/progress";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const playerId = request.headers.get("X-Player-Id");
  if (!isValidPlayerId(playerId)) {
    return withCors(
      Response.json(
        { error: "Missing or invalid X-Player-Id header" },
        { status: 400 },
      ),
      request,
    );
  }

  const progress = await getExpressionProgress(playerId);
  return withCors(Response.json(progress), request);
}
