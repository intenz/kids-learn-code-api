const DEFAULT_ORIGIN = "http://localhost:5173";

export function parseAllowedOrigins(
  raw: string | undefined = process.env.ALLOWED_ORIGIN,
): string[] {
  const value = raw ?? DEFAULT_ORIGIN;
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function resolveAllowOrigin(
  requestOrigin: string | null,
  allowedOrigins: string[] = parseAllowedOrigins(),
): string {
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowedOrigins[0] ?? DEFAULT_ORIGIN;
}

export function corsHeadersFor(request?: Request): Record<string, string> {
  const requestOrigin = request?.headers.get("Origin") ?? null;
  return {
    "Access-Control-Allow-Origin": resolveAllowOrigin(requestOrigin),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Player-Id",
    Vary: "Origin",
  };
}

/** @deprecated Prefer corsHeadersFor(request) when Origin matters */
export const corsHeaders = corsHeadersFor();

export function withCors(response: Response, request?: Request): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeadersFor(request))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function optionsResponse(request?: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeadersFor(request),
  });
}
