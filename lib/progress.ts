import { getPublicLevels as getExpressionPublicLevels } from "@/lib/expressionGame";
import {
  getModules,
  getPublicLevels as getJsLessonPublicLevels,
  type JsLessonModuleId,
} from "@/lib/jsLessons";
import { prisma } from "@/lib/prisma";
import {
  buildGameProgress,
  type GameProgressResponse,
  type LevelProgress,
} from "@/lib/progressHelpers";

export {
  buildGameProgress,
  computeProgressStats,
  isValidPlayerId,
  mergeLevelProgress,
  type GameProgressResponse,
  type LevelProgress,
} from "@/lib/progressHelpers";

export const EXPRESSION_GAME_ID = "expression";
export const EXPRESSION_GAME_TITLE = "Збери вираз";

export const LESSON_JS_GAME_ID = "lesson-js";

export type ExpressionLevelProgress = LevelProgress;
export type ExpressionProgressResponse = GameProgressResponse & {
  gameId: typeof EXPRESSION_GAME_ID;
};
export type LessonJsLevelProgress = LevelProgress;
export type LessonJsProgressResponse = GameProgressResponse;

/** Upsert a progress event for any game/level. Shared by expression + lesson routes. */
export async function recordProgressEvent(
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

export async function recordExpressionEvent(
  playerId: string,
  levelId: string,
  correct: boolean,
): Promise<void> {
  await recordProgressEvent(playerId, EXPRESSION_GAME_ID, levelId, correct);
}

export async function recordLessonJsEvent(
  playerId: string,
  gameId: string,
  levelId: string,
  correct: boolean,
): Promise<void> {
  await recordProgressEvent(playerId, gameId, levelId, correct);
}

export async function getExpressionProgress(
  playerId: string,
): Promise<ExpressionProgressResponse> {
  const knownLevels = await getExpressionPublicLevels();
  const rows = await prisma.progress.findMany({
    where: { playerId, gameId: EXPRESSION_GAME_ID },
  });

  return buildGameProgress(
    EXPRESSION_GAME_ID,
    knownLevels,
    rows,
  ) as ExpressionProgressResponse;
}

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

  return buildGameProgress(mod.gameId, knownLevels, rows);
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
