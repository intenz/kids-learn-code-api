import { prisma } from "@/lib/prisma";

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
const EXPRESSION_MODULE_ID = "expression";

function parseChoices(json: string): Choice[] {
  return JSON.parse(json) as Choice[];
}

function parseCodeLines(json: string): string[] {
  return JSON.parse(json) as string[];
}

export async function getPublicLevels(): Promise<PublicExpressionLevel[]> {
  const levels = await prisma.contentLevel.findMany({
    where: { moduleId: EXPRESSION_MODULE_ID },
    orderBy: { sortOrder: "asc" },
  });

  return levels.map((level) => ({
    id: level.id,
    title: level.title,
    codeLines: parseCodeLines(level.codeLinesJson),
    choices: parseChoices(level.choicesJson),
  }));
}

export async function checkAnswer(
  levelId: string,
  choiceId: string,
): Promise<CheckResult | null> {
  const level = await prisma.contentLevel.findFirst({
    where: { id: levelId, moduleId: EXPRESSION_MODULE_ID },
  });
  if (!level) {
    return null;
  }

  const correct = level.correctChoiceId === choiceId;
  if (correct) {
    const message = SUCCESS_MESSAGES[level.sortOrder % SUCCESS_MESSAGES.length];
    return { correct: true, message };
  }

  return { correct: false, message: FAIL_MESSAGE };
}
