import { describe, expect, it } from "vitest";
import {
  buildGameProgress,
  computeProgressStats,
  isValidPlayerId,
  mergeLevelProgress,
} from "@/lib/progressHelpers";

describe("isValidPlayerId", () => {
  it("accepts UUID v4", () => {
    expect(isValidPlayerId("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects null, empty, and non-v4 UUIDs", () => {
    expect(isValidPlayerId(null)).toBe(false);
    expect(isValidPlayerId(undefined)).toBe(false);
    expect(isValidPlayerId("")).toBe(false);
    expect(isValidPlayerId("not-a-uuid")).toBe(false);
    // UUID v1 — wrong version nibble
    expect(isValidPlayerId("550e8400-e29b-11d4-a716-446655440000")).toBe(false);
  });
});

describe("mergeLevelProgress", () => {
  const known = [
    { id: "l1", title: "One" },
    { id: "l2", title: "Two" },
  ];

  it("defaults missing rows to zero progress", () => {
    expect(mergeLevelProgress(known, [])).toEqual([
      {
        levelId: "l1",
        title: "One",
        completed: false,
        correctCount: 0,
        wrongCount: 0,
      },
      {
        levelId: "l2",
        title: "Two",
        completed: false,
        correctCount: 0,
        wrongCount: 0,
      },
    ]);
  });

  it("merges stored rows by level id", () => {
    expect(
      mergeLevelProgress(known, [
        {
          levelId: "l2",
          completed: true,
          correctCount: 2,
          wrongCount: 1,
        },
      ]),
    ).toEqual([
      {
        levelId: "l1",
        title: "One",
        completed: false,
        correctCount: 0,
        wrongCount: 0,
      },
      {
        levelId: "l2",
        title: "Two",
        completed: true,
        correctCount: 2,
        wrongCount: 1,
      },
    ]);
  });
});

describe("computeProgressStats", () => {
  it("returns zeros for an empty list", () => {
    expect(computeProgressStats([])).toEqual({
      totalLevels: 0,
      completedLevels: 0,
      percent: 0,
    });
  });

  it("rounds percent to nearest integer", () => {
    const levels = [
      {
        levelId: "a",
        title: "A",
        completed: true,
        correctCount: 1,
        wrongCount: 0,
      },
      {
        levelId: "b",
        title: "B",
        completed: false,
        correctCount: 0,
        wrongCount: 1,
      },
      {
        levelId: "c",
        title: "C",
        completed: false,
        correctCount: 0,
        wrongCount: 0,
      },
    ];
    expect(computeProgressStats(levels)).toEqual({
      totalLevels: 3,
      completedLevels: 1,
      percent: 33,
    });
  });
});

describe("buildGameProgress", () => {
  it("assembles gameId, levels, and stats", () => {
    const result = buildGameProgress(
      "lesson-js",
      [{ id: "l1", title: "One" }],
      [{ levelId: "l1", completed: true, correctCount: 1, wrongCount: 0 }],
    );

    expect(result).toEqual({
      gameId: "lesson-js",
      totalLevels: 1,
      completedLevels: 1,
      percent: 100,
      levels: [
        {
          levelId: "l1",
          title: "One",
          completed: true,
          correctCount: 1,
          wrongCount: 0,
        },
      ],
    });
  });
});
