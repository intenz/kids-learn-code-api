import { prisma } from "@/lib/prisma";
import {
  evaluateAnswer,
  parseChoices,
  parseCodeLines,
  type CheckResult,
  type Choice,
} from "@/lib/quiz";

export type { CheckResult, Choice };

export type PublicExpressionLevel = {
  id: string;
  title: string;
  codeLines: string[];
  choices: Choice[];
};

const EXPRESSION_MODULE_ID = "expression";

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

  return evaluateAnswer(level.correctChoiceId, choiceId, level.sortOrder);
}
