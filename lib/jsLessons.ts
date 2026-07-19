import { prisma } from "@/lib/prisma";
import {
  isJsLessonModuleId,
  JS_LESSON_MODULE_IDS,
  type JsLessonModuleId,
} from "@/lib/jsLessonModules";
import {
  evaluateAnswer,
  parseChoices,
  parseCodeLines,
  type CheckResult,
  type Choice,
} from "@/lib/quiz";

export type { CheckResult, Choice, JsLessonModuleId };
export { isJsLessonModuleId, JS_LESSON_MODULE_IDS };

export type JsLessonModuleMeta = {
  id: JsLessonModuleId;
  gameId: string;
  title: string;
  description: string;
  levelCount: number;
};

export type PublicJsLessonLevel = {
  id: string;
  title: string;
  topic: string;
  codeLines: string[];
  question?: string;
  choices: Choice[];
};

export async function getModules(): Promise<JsLessonModuleMeta[]> {
  const rows = await prisma.contentModule.findMany({
    where: { kind: "lesson" },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { levels: true } } },
  });

  return rows
    .filter((row) => isJsLessonModuleId(row.id))
    .map((row) => ({
      id: row.id as JsLessonModuleId,
      gameId: row.gameId,
      title: row.title,
      description: row.description,
      levelCount: row._count.levels,
    }));
}

export async function getGameIdForModule(
  moduleId: JsLessonModuleId,
): Promise<string | undefined> {
  const row = await prisma.contentModule.findUnique({
    where: { id: moduleId },
    select: { gameId: true },
  });
  return row?.gameId;
}

export async function getPublicLevels(
  moduleId: JsLessonModuleId = "basics",
): Promise<PublicJsLessonLevel[]> {
  const levels = await prisma.contentLevel.findMany({
    where: { moduleId },
    orderBy: { sortOrder: "asc" },
  });

  return levels.map((level) => ({
    id: level.id,
    title: level.title,
    topic: level.topic,
    codeLines: parseCodeLines(level.codeLinesJson),
    ...(level.question ? { question: level.question } : {}),
    choices: parseChoices(level.choicesJson),
  }));
}

export async function checkAnswer(
  moduleId: JsLessonModuleId,
  levelId: string,
  choiceId: string,
): Promise<CheckResult | null> {
  const level = await prisma.contentLevel.findFirst({
    where: { id: levelId, moduleId },
  });
  if (!level) {
    return null;
  }

  return evaluateAnswer(level.correctChoiceId, choiceId, level.sortOrder);
}
