import { optionsResponse, withCors } from "@/lib/cors";
import { createPlayer } from "@/lib/progress";

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch {
    return withCors(
      Response.json({ error: "Invalid JSON body" }, { status: 400 }),
      request,
    );
  }

  const id =
    typeof body === "object" &&
    body !== null &&
    typeof (body as { id?: unknown }).id === "string" &&
    (body as { id: string }).id
      ? (body as { id: string }).id
      : undefined;

  try {
    const player = await createPlayer(id);
    return withCors(Response.json(player, { status: 201 }), request);
  } catch {
    return withCors(
      Response.json({ error: "Could not create player" }, { status: 409 }),
      request,
    );
  }
}
