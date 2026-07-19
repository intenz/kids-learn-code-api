export type Choice = {
  id: string;
  label: string;
};

export type CheckResult = {
  correct: boolean;
  message: string;
};

export const SUCCESS_MESSAGES = ["Супер!", "Молодець!"] as const;
export const FAIL_MESSAGE = "Спробуй ще";

export function parseChoices(json: string): Choice[] {
  return JSON.parse(json) as Choice[];
}

export function parseCodeLines(json: string): string[] {
  return JSON.parse(json) as string[];
}

/** Pick a rotating success message from zero-based sortOrder. */
export function successMessageForSortOrder(sortOrder: number): string {
  return SUCCESS_MESSAGES[sortOrder % SUCCESS_MESSAGES.length];
}

/** Compare a player choice against the correct answer and return feedback. */
export function evaluateAnswer(
  correctChoiceId: string,
  choiceId: string,
  sortOrder: number,
): CheckResult {
  const correct = correctChoiceId === choiceId;
  if (correct) {
    return { correct: true, message: successMessageForSortOrder(sortOrder) };
  }
  return { correct: false, message: FAIL_MESSAGE };
}
