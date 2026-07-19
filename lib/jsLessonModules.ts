export type JsLessonModuleId = "basics" | "arrays" | "objects" | "functions";

export const JS_LESSON_MODULE_IDS: readonly JsLessonModuleId[] = [
  "basics",
  "arrays",
  "objects",
  "functions",
] as const;

export function isJsLessonModuleId(value: string): value is JsLessonModuleId {
  return (JS_LESSON_MODULE_IDS as readonly string[]).includes(value);
}
