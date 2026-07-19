import { describe, expect, it } from "vitest";
import {
  evaluateAnswer,
  FAIL_MESSAGE,
  parseChoices,
  parseCodeLines,
  SUCCESS_MESSAGES,
  successMessageForSortOrder,
} from "@/lib/quiz";

describe("parseChoices", () => {
  it("parses choice JSON", () => {
    expect(parseChoices('[{"id":"a","label":"A"}]')).toEqual([
      { id: "a", label: "A" },
    ]);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseChoices("not-json")).toThrow();
  });
});

describe("parseCodeLines", () => {
  it("parses code line JSON", () => {
    expect(parseCodeLines('["const x = 1;","x + 1"]')).toEqual([
      "const x = 1;",
      "x + 1",
    ]);
  });
});

describe("successMessageForSortOrder", () => {
  it("uses zero-based indexing for the first level", () => {
    expect(successMessageForSortOrder(0)).toBe(SUCCESS_MESSAGES[0]);
  });

  it("rotates through success messages", () => {
    expect(successMessageForSortOrder(1)).toBe(SUCCESS_MESSAGES[1]);
    expect(successMessageForSortOrder(2)).toBe(SUCCESS_MESSAGES[0]);
    expect(successMessageForSortOrder(3)).toBe(SUCCESS_MESSAGES[1]);
  });
});

describe("evaluateAnswer", () => {
  it("returns correct feedback with rotating success message", () => {
    expect(evaluateAnswer("c1", "c1", 0)).toEqual({
      correct: true,
      message: SUCCESS_MESSAGES[0],
    });
    expect(evaluateAnswer("c1", "c1", 1)).toEqual({
      correct: true,
      message: SUCCESS_MESSAGES[1],
    });
  });

  it("returns fail feedback for wrong choice", () => {
    expect(evaluateAnswer("c1", "c2", 0)).toEqual({
      correct: false,
      message: FAIL_MESSAGE,
    });
  });
});
