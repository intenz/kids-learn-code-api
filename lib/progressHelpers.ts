export type LevelProgress = {
  levelId: string;
  title: string;
  completed: boolean;
  correctCount: number;
  wrongCount: number;
};

export type GameProgressResponse = {
  gameId: string;
  totalLevels: number;
  completedLevels: number;
  percent: number;
  levels: LevelProgress[];
};

type ProgressRow = {
  levelId: string;
  completed: boolean;
  correctCount: number;
  wrongCount: number;
};

type KnownLevel = {
  id: string;
  title: string;
};

/** Merge known levels with stored progress rows into a per-level list. */
export function mergeLevelProgress(
  knownLevels: KnownLevel[],
  rows: ProgressRow[],
): LevelProgress[] {
  const byLevelId = new Map(rows.map((row) => [row.levelId, row]));

  return knownLevels.map((level) => {
    const row = byLevelId.get(level.id);
    return {
      levelId: level.id,
      title: level.title,
      completed: row?.completed ?? false,
      correctCount: row?.correctCount ?? 0,
      wrongCount: row?.wrongCount ?? 0,
    };
  });
}

/** Compute aggregate progress stats from a per-level list. */
export function computeProgressStats(levels: LevelProgress[]): {
  totalLevels: number;
  completedLevels: number;
  percent: number;
} {
  const totalLevels = levels.length;
  const completedLevels = levels.filter((level) => level.completed).length;
  const percent =
    totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100);

  return { totalLevels, completedLevels, percent };
}

export function buildGameProgress(
  gameId: string,
  knownLevels: KnownLevel[],
  rows: ProgressRow[],
): GameProgressResponse {
  const levels = mergeLevelProgress(knownLevels, rows);
  const stats = computeProgressStats(levels);
  return { gameId, levels, ...stats };
}

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidPlayerId(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_V4_RE.test(value);
}
