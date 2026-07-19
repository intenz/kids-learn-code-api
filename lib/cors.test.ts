import { describe, expect, it } from "vitest";
import {
  corsHeadersFor,
  optionsResponse,
  parseAllowedOrigins,
  resolveAllowOrigin,
  withCors,
} from "@/lib/cors";

describe("parseAllowedOrigins", () => {
  it("defaults when unset", () => {
    expect(parseAllowedOrigins(undefined)).toEqual(["http://localhost:5173"]);
  });

  it("splits and trims comma-separated origins", () => {
    expect(parseAllowedOrigins(" https://a.example , https://b.example ")).toEqual([
      "https://a.example",
      "https://b.example",
    ]);
  });
});

describe("resolveAllowOrigin", () => {
  const allowed = ["https://a.example", "https://b.example"];

  it("echoes a matching request origin", () => {
    expect(resolveAllowOrigin("https://b.example", allowed)).toBe(
      "https://b.example",
    );
  });

  it("falls back to the first allowed origin", () => {
    expect(resolveAllowOrigin("https://evil.example", allowed)).toBe(
      "https://a.example",
    );
    expect(resolveAllowOrigin(null, allowed)).toBe("https://a.example");
  });
});

describe("corsHeadersFor / withCors / optionsResponse", () => {
  it("includes required CORS headers", () => {
    const headers = corsHeadersFor();
    expect(headers["Access-Control-Allow-Methods"]).toBe("GET, POST, OPTIONS");
    expect(headers["Access-Control-Allow-Headers"]).toBe(
      "Content-Type, X-Player-Id",
    );
    expect(headers.Vary).toBe("Origin");
  });

  it("wraps a response with CORS headers", () => {
    const response = withCors(Response.json({ ok: true }));
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
    expect(response.status).toBe(200);
  });

  it("returns 204 for OPTIONS", () => {
    const response = optionsResponse();
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, OPTIONS",
    );
  });
});
