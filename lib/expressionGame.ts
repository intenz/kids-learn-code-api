import { prisma } from "@/lib/db";

export type Choice = {
  id: string;
  label: string;
};

export type PublicExpressionLevel = {
  id: string;
  title: string;
  codeLines: string[];
  choices: Choice[];
};

export type CheckResult = {
  correct: boolean;
  message: string;
};

const SUCCESS_MESSAGES = ["Супер!", "Молодець!"] as const;
const FAIL_MESSAGE = "Спробуй ще";
const EXPRESSION_GAME_SLUG = "expression";

function parseChoices(raw: string): Choice[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter(
    (item): item is Choice =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Choice).id === "string" &&
      typeof (item as Choice).label === "string",
  );
}

function parseCodeLines(raw: string): string[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter((item): item is string => typeof item === "string");
}

export async function getPublicLevels(): Promise<PublicExpressionLevel[]> {
  const game = await prisma.game.findUnique({
    where: { slug: EXPRESSION_GAME_SLUG },
    include: {
      levels: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!game) {
    return [];
  }

  return game.levels.map((level) => ({
    id: level.id,
    title: level.title,
    codeLines: parseCodeLines(level.codeLines),
    choices: parseChoices(level.choices),
  }));
}

export async function checkAnswer(
  levelId: string,
  choiceId: string,
): Promise<CheckResult | null> {
  const level = await prisma.gameLevel.findFirst({
    where: {
      id: levelId,
      game: { slug: EXPRESSION_GAME_SLUG },
    },
  });

  if (!level) {
    return null;
  }

  const correct = level.correctChoiceId === choiceId;
  if (correct) {
    const message =
      SUCCESS_MESSAGES[(level.sortOrder - 1) % SUCCESS_MESSAGES.length];
    return { correct: true, message };
  }

  return { correct: false, message: FAIL_MESSAGE };
}
