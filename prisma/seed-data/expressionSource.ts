export type Choice = {
  id: string;
  label: string;
};

export type ExpressionLevel = {
  id: string;
  title: string;
  codeLines: string[];
  choices: Choice[];
  correctChoiceId: string;
};

export const seedExpressionLevels: ExpressionLevel[] = [
  {
    id: "expr-1",
    title: "Додавання",
    codeLines: ["let a = 3", "let b = 4", "let result = a + b"],
    choices: [
      { id: "a", label: "7" },
      { id: "b", label: "12" },
      { id: "c", label: "1" },
      { id: "d", label: "34" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "expr-2",
    title: "Множення",
    codeLines: ["let a = 3", "let b = 4", "let result = a * b"],
    choices: [
      { id: "a", label: "7" },
      { id: "b", label: "12" },
      { id: "c", label: "34" },
      { id: "d", label: "1" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "expr-3",
    title: "Множення і додавання",
    codeLines: ["let a = 3", "let b = 4", "let result = a * b + 2"],
    choices: [
      { id: "a", label: "14" },
      { id: "b", label: "18" },
      { id: "c", label: "20" },
      { id: "d", label: "10" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "expr-4",
    title: "Кілька змінних",
    codeLines: [
      "let a = 2",
      "let b = 5",
      "let c = 3",
      "let result = a + b + c",
    ],
    choices: [
      { id: "a", label: "8" },
      { id: "b", label: "10" },
      { id: "c", label: "15" },
      { id: "d", label: "30" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "expr-5",
    title: "Дужки",
    codeLines: [
      "let a = 2",
      "let b = 3",
      "let c = 4",
      "let result = (a + b) * c",
    ],
    choices: [
      { id: "a", label: "14" },
      { id: "b", label: "20" },
      { id: "c", label: "24" },
      { id: "d", label: "9" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "expr-6",
    title: "Складніший вираз",
    codeLines: [
      "let a = 5",
      "let b = 2",
      "let c = 3",
      "let result = a * b + c * 2",
    ],
    choices: [
      { id: "a", label: "16" },
      { id: "b", label: "22" },
      { id: "c", label: "13" },
      { id: "d", label: "30" },
    ],
    correctChoiceId: "a",
  },
];
