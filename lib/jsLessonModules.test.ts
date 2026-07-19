import { describe, expect, it } from "vitest";
import {
  isJsLessonModuleId,
  JS_LESSON_MODULE_IDS,
} from "@/lib/jsLessonModules";

describe("isJsLessonModuleId", () => {
  it("accepts known module ids", () => {
    for (const id of JS_LESSON_MODULE_IDS) {
      expect(isJsLessonModuleId(id)).toBe(true);
    }
  });

  it("rejects unknown ids", () => {
    expect(isJsLessonModuleId("expression")).toBe(false);
    expect(isJsLessonModuleId("")).toBe(false);
  });
});
