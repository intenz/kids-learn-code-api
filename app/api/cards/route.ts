import { optionsResponse, withCors } from "@/lib/cors";

const cards = [
  { id: "1", title: "Перший урок", type: "lesson" },
  { id: "2", title: "Другий урок", type: "lesson" },
  { id: "3", title: "Гра: лабіринт", type: "game" },
  { id: "4", title: "Гра: Збери вираз", type: "game" },
] as const;

export function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export function GET(request: Request) {
  return withCors(Response.json(cards), request);
}
