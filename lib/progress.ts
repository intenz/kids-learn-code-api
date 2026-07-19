import { getPublicLevels as getExpressionPublicLevels } from "@/lib/expressionGame";
import {
  getModules,
  getPublicLevels as getJsLessonPublicLevels,
  type JsLessonModuleId,
} from "@/lib/jsLessons";
import { prisma } from "@/lib/prisma";

export const EXPRESSION_GAME_ID = "expression";
export const EXPRESSION_GAME_TITLE = "Збери вираз";

export const LESSON_JS_GAME_ID = "lesson-js";

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidPlayerId(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_V4_RE.test(value);
}

export async function recordExpressionEvent(
  playerId: string,
  levelId: string,
  correct: boolean,
): Promise<void> {
  await prisma.player.upsert({
    where: { id: playerId },
    create: { id: playerId },
    update: {},
  });

  const existing = await prisma.progress.findUnique({
    where: {
      playerId_gameId_levelId: {
        playerId,
        gameId: EXPRESSION_GAME_ID,
        levelId,
      },
    },
  });

  if (existing) {
    await prisma.progress.update({
      where: { id: existing.id },
      data: correct
        ? {
            completed: true,
            correctCount: { increment: 1 },
          }
        : {
            wrongCount: { increment: 1 },
          },
    });
    return;
  }

  await prisma.progress.create({
    data: {
      playerId,
      gameId: EXPRESSION_GAME_ID,
      levelId,
      completed: correct,
      correctCount: correct ? 1 : 0,
      wrongCount: correct ? 0 : 1,
    },
  });
}

export type ExpressionLevelProgress = {
  levelId: string;
  title: string;
  completed: boolean;
  correctCount: number;
  wrongCount: number;
};

export type ExpressionProgressResponse = {
  gameId: typeof EXPRESSION_GAME_ID;
  totalLevels: number;
  completedLevels: number;
  percent: number;
  levels: ExpressionLevelProgress[];
};

export async function getExpressionProgress(
  playerId: string,
): Promise<ExpressionProgressResponse> {
  const knownLevels = await getExpressionPublicLevels();
  const rows = await prisma.progress.findMany({
    where: { playerId, gameId: EXPRESSION_GAME_ID },
  });
  const byLevelId = new Map(rows.map((row) => [row.levelId, row]));

  const levels: ExpressionLevelProgress[] = knownLevels.map((level) => {
    const row = byLevelId.get(level.id);
    return {
      levelId: level.id,
      title: level.title,
      completed: row?.completed ?? false,
      correctCount: row?.correctCount ?? 0,
      wrongCount: row?.wrongCount ?? 0,
    };
  });

  const totalLevels = knownLevels.length;
  const completedLevels = levels.filter((level) => level.completed).length;
  const percent =
    totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100);

  return {
    gameId: EXPRESSION_GAME_ID,
    totalLevels,
    completedLevels,
    percent,
    levels,
  };
}

export async function recordLessonJsEvent(
  playerId: string,
  gameId: string,
  levelId: string,
  correct: boolean,
): Promise<void> {
  await prisma.player.upsert({
    where: { id: playerId },
    create: { id: playerId },
    update: {},
  });

  const existing = await prisma.progress.findUnique({
    where: {
      playerId_gameId_levelId: {
        playerId,
        gameId,
        levelId,
      },
    },
  });

  if (existing) {
    await prisma.progress.update({
      where: { id: existing.id },
      data: correct
        ? {
            completed: true,
            correctCount: { increment: 1 },
          }
        : {
            wrongCount: { increment: 1 },
          },
    });
    return;
  }

  await prisma.progress.create({
    data: {
      playerId,
      gameId,
      levelId,
      completed: correct,
      correctCount: correct ? 1 : 0,
      wrongCount: correct ? 0 : 1,
    },
  });
}

export type LessonJsLevelProgress = {
  levelId: string;
  title: string;
  completed: boolean;
  correctCount: number;
  wrongCount: number;
};

export type LessonJsProgressResponse = {
  gameId: string;
  totalLevels: number;
  completedLevels: number;
  percent: number;
  levels: LessonJsLevelProgress[];
};

export async function getLessonJsProgress(
  playerId: string,
  moduleId: JsLessonModuleId = "basics",
): Promise<LessonJsProgressResponse> {
  const mod = (await getModules()).find((item) => item.id === moduleId);
  if (!mod) {
    return {
      gameId: LESSON_JS_GAME_ID,
      totalLevels: 0,
      completedLevels: 0,
      percent: 0,
      levels: [],
    };
  }

  const knownLevels = await getJsLessonPublicLevels(moduleId);
  const rows = await prisma.progress.findMany({
    where: { playerId, gameId: mod.gameId },
  });
  const byLevelId = new Map(rows.map((row) => [row.levelId, row]));

  const levels: LessonJsLevelProgress[] = knownLevels.map((level) => {
    const row = byLevelId.get(level.id);
    return {
      levelId: level.id,
      title: level.title,
      completed: row?.completed ?? false,
      correctCount: row?.correctCount ?? 0,
      wrongCount: row?.wrongCount ?? 0,
    };
  });

  const totalLevels = knownLevels.length;
  const completedLevels = levels.filter((level) => level.completed).length;
  const percent =
    totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100);

  return {
    gameId: mod.gameId,
    totalLevels,
    completedLevels,
    percent,
    levels,
  };
}

export type ProgressSummaryGame = {
  gameId: string;
  title: string;
  totalLevels: number;
  completedLevels: number;
  percent: number;
};

export type ProgressSummaryResponse = {
  games: ProgressSummaryGame[];
};

export async function getProgressSummary(
  playerId: string,
): Promise<ProgressSummaryResponse> {
  const lessonModules = await getModules();
  const [expression, ...lessonProgress] = await Promise.all([
    getExpressionProgress(playerId),
    ...lessonModules.map((mod) => getLessonJsProgress(playerId, mod.id)),
  ]);

  return {
    games: [
      {
        gameId: EXPRESSION_GAME_ID,
        title: EXPRESSION_GAME_TITLE,
        totalLevels: expression.totalLevels,
        completedLevels: expression.completedLevels,
        percent: expression.percent,
      },
      ...lessonModules.map((mod, index) => {
        const progress = lessonProgress[index];
        return {
          gameId: mod.gameId,
          title: mod.title,
          totalLevels: progress.totalLevels,
          completedLevels: progress.completedLevels,
          percent: progress.percent,
        };
      }),
    ],
  };
}
