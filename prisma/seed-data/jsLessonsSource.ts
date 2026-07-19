export type Choice = {
  id: string;
  label: string;
};

export type JsLessonLevel = {
  id: string;
  title: string;
  topic: string;
  codeLines: string[];
  question?: string;
  choices: Choice[];
  correctChoiceId: string;
};

export type PublicJsLessonLevel = Omit<JsLessonLevel, "correctChoiceId">;

export type CheckResult = {
  correct: boolean;
  message: string;
};

export type JsLessonModuleId =
  | "basics"
  | "arrays"
  | "objects"
  | "functions";

export type JsLessonModuleMeta = {
  id: JsLessonModuleId;
  gameId: string;
  title: string;
  description: string;
  levelCount: number;
};

export const JS_LESSON_MODULE_IDS: readonly JsLessonModuleId[] = [
  "basics",
  "arrays",
  "objects",
  "functions",
] as const;

export function isJsLessonModuleId(value: string): value is JsLessonModuleId {
  return (JS_LESSON_MODULE_IDS as readonly string[]).includes(value);
}

const SUCCESS_MESSAGES = ["Супер!", "Молодець!"] as const;
const FAIL_MESSAGE = "Спробуй ще";

const basicsLevels: JsLessonLevel[] = [
  {
    id: "js-1",
    title: "Змінні та типи",
    topic: "variables",
    codeLines: ["let age = 10", "typeof age"],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: '"number"' },
      { id: "b", label: "10" },
      { id: "c", label: '"age"' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "js-2",
    title: "Рядки",
    topic: "strings",
    codeLines: ['let name = "Київ"', "name.length"],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "3" },
      { id: "b", label: "4" },
      { id: "c", label: '"Київ"' },
      { id: "d", label: "2" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "js-3",
    title: "Масиви",
    topic: "arrays",
    codeLines: ["let nums = [2, 4, 6]", "nums[1]"],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "2" },
      { id: "b", label: "4" },
      { id: "c", label: "6" },
      { id: "d", label: "[2, 4, 6]" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "js-4",
    title: "Об’єкти",
    topic: "objects",
    codeLines: [
      'let cat = { name: "Мурчик", age: 3 }',
      "cat.name",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "3" },
      { id: "b", label: '"cat"' },
      { id: "c", label: '"Мурчик"' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "js-5",
    title: "Умови (if)",
    topic: "if",
    codeLines: [
      "let score = 8",
      "let result",
      "if (score >= 5) {",
      '  result = "pass"',
      "} else {",
      '  result = "fail"',
      "}",
      "result",
    ],
    question: "Що буде в result?",
    choices: [
      { id: "a", label: '"fail"' },
      { id: "b", label: '"pass"' },
      { id: "c", label: "8" },
      { id: "d", label: "true" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "js-6",
    title: "Цикл for",
    topic: "for",
    codeLines: [
      "let sum = 0",
      "for (let i = 1; i <= 3; i++) {",
      "  sum = sum + i",
      "}",
      "sum",
    ],
    question: "Що буде в sum?",
    choices: [
      { id: "a", label: "3" },
      { id: "b", label: "4" },
      { id: "c", label: "6" },
      { id: "d", label: "1" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "js-7",
    title: "Функції",
    topic: "functions",
    codeLines: [
      "function double(n) {",
      "  return n * 2",
      "}",
      "double(5)",
    ],
    question: "Що поверне double(5)?",
    choices: [
      { id: "a", label: "5" },
      { id: "b", label: "10" },
      { id: "c", label: "25" },
      { id: "d", label: "7" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "js-8",
    title: "filter",
    topic: "filter",
    codeLines: [
      "let nums = [1, 2, 3, 4]",
      "nums.filter((n) => n > 2)",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "[3, 4]" },
      { id: "b", label: "[1, 2]" },
      { id: "c", label: "[2, 3, 4]" },
      { id: "d", label: "4" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "js-9",
    title: "map",
    topic: "map",
    codeLines: [
      "let nums = [1, 2, 3]",
      "nums.map((n) => n * 10)",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "[1, 2, 3]" },
      { id: "b", label: "[10, 20, 30]" },
      { id: "c", label: "60" },
      { id: "d", label: "[0, 10, 20]" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "js-10",
    title: "filter + map",
    topic: "combo",
    codeLines: [
      "let nums = [1, 2, 3, 4, 5]",
      "nums",
      "  .filter((n) => n % 2 === 0)",
      "  .map((n) => n * 2)",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "[2, 4]" },
      { id: "b", label: "[4, 8]" },
      { id: "c", label: "[2, 4, 6, 8, 10]" },
      { id: "d", label: "[1, 3, 5]" },
    ],
    correctChoiceId: "b",
  },
];

const arraysLevels: JsLessonLevel[] = [
  {
    id: "arr-1",
    title: "Довжина масиву",
    topic: "length",
    codeLines: ["let fruits = ['яблуко', 'груша', 'слива']", "fruits.length"],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "2" },
      { id: "b", label: "3" },
      { id: "c", label: "4" },
      { id: "d", label: '"яблуко"' },
    ],
    correctChoiceId: "b",
  },
  {
    id: "arr-2",
    title: "push і length",
    topic: "push",
    codeLines: [
      "let nums = [1, 2]",
      "nums.push(3)",
      "nums.length",
    ],
    question: "Яка довжина nums після push?",
    choices: [
      { id: "a", label: "2" },
      { id: "b", label: "3" },
      { id: "c", label: "1" },
      { id: "d", label: "4" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "arr-3",
    title: "pop повертає елемент",
    topic: "pop",
    codeLines: ["let colors = ['червоний', 'синій', 'зелений']", "colors.pop()"],
    question: "Що поверне colors.pop()?",
    choices: [
      { id: "a", label: '"червоний"' },
      { id: "b", label: '"синій"' },
      { id: "c", label: '"зелений"' },
      { id: "d", label: "3" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "arr-4",
    title: "includes",
    topic: "includes",
    codeLines: ["let pets = ['кіт', 'пес', 'рибка']", "pets.includes('пес')"],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "true" },
      { id: "b", label: "false" },
      { id: "c", label: "1" },
      { id: "d", label: '"пес"' },
    ],
    correctChoiceId: "a",
  },
  {
    id: "arr-5",
    title: "indexOf",
    topic: "indexOf",
    codeLines: ["let nums = [10, 20, 30, 40]", "nums.indexOf(30)"],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "30" },
      { id: "b", label: "2" },
      { id: "c", label: "3" },
      { id: "d", label: "-1" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "arr-6",
    title: "find",
    topic: "find",
    codeLines: [
      "let nums = [3, 8, 12, 5]",
      "nums.find((n) => n > 10)",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "8" },
      { id: "b", label: "12" },
      { id: "c", label: "[12]" },
      { id: "d", label: "5" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "arr-7",
    title: "slice — копія",
    topic: "slice",
    codeLines: [
      "let a = [1, 2, 3]",
      "let b = a.slice()",
      "b.push(4)",
      "a.length",
    ],
    question: "Чому дорівнює a.length після цього?",
    choices: [
      { id: "a", label: "3" },
      { id: "b", label: "4" },
      { id: "c", label: "2" },
      { id: "d", label: "1" },
    ],
    correctChoiceId: "a",
  },
];

const objectsLevels: JsLessonLevel[] = [
  {
    id: "obj-1",
    title: "Доступ через крапку",
    topic: "dot",
    codeLines: [
      'let dog = { name: "Бобік", age: 5 }',
      "dog.name",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "5" },
      { id: "b", label: '"Бобік"' },
      { id: "c", label: '"dog"' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "obj-2",
    title: "Доступ через дужки",
    topic: "bracket",
    codeLines: [
      'let book = { title: "Космос", pages: 100 }',
      'book["pages"]',
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: '"Космос"' },
      { id: "b", label: "100" },
      { id: "c", label: '"pages"' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "obj-3",
    title: "Запис властивості",
    topic: "assign",
    codeLines: [
      "let score = { points: 0 }",
      "score.points = 10",
      "score.points",
    ],
    question: "Що буде в score.points?",
    choices: [
      { id: "a", label: "0" },
      { id: "b", label: "10" },
      { id: "c", label: "undefined" },
      { id: "d", label: '"points"' },
    ],
    correctChoiceId: "b",
  },
  {
    id: "obj-4",
    title: "Object.keys",
    topic: "keys",
    codeLines: [
      'let user = { name: "Оля", age: 12, city: "Львів" }',
      "Object.keys(user).length",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "2" },
      { id: "b", label: "3" },
      { id: "c", label: "12" },
      { id: "d", label: '["name", "age", "city"]' },
    ],
    correctChoiceId: "b",
  },
  {
    id: "obj-5",
    title: "Вкладений об’єкт",
    topic: "nested",
    codeLines: [
      "let user = {",
      '  name: "Ігор",',
      '  address: { city: "Одеса" }',
      "}",
      "user.address.city",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: '"Ігор"' },
      { id: "b", label: '{ city: "Одеса" }' },
      { id: "c", label: '"Одеса"' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "obj-6",
    title: "Деструктуризація",
    topic: "destructure",
    codeLines: [
      'let person = { name: "Марія", age: 11 }',
      "let { name } = person",
      "name",
    ],
    question: "Що буде в name?",
    choices: [
      { id: "a", label: "11" },
      { id: "b", label: '"Марія"' },
      { id: "c", label: '{ name: "Марія" }' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "b",
  },
];

const functionsLevels: JsLessonLevel[] = [
  {
    id: "fn-1",
    title: "return",
    topic: "return",
    codeLines: [
      "function add(a, b) {",
      "  return a + b",
      "}",
      "add(2, 3)",
    ],
    question: "Що поверне add(2, 3)?",
    choices: [
      { id: "a", label: "23" },
      { id: "b", label: "5" },
      { id: "c", label: "6" },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "fn-2",
    title: "Параметр за замовчуванням",
    topic: "default",
    codeLines: [
      "function greet(name = 'друже') {",
      "  return 'Привіт, ' + name",
      "}",
      "greet()",
    ],
    question: "Що поверне greet()?",
    choices: [
      { id: "a", label: '"Привіт, друже"' },
      { id: "b", label: '"Привіт, "' },
      { id: "c", label: '"Привіт, undefined"' },
      { id: "d", label: "undefined" },
    ],
    correctChoiceId: "a",
  },
  {
    id: "fn-3",
    title: "Без return",
    topic: "undefined",
    codeLines: [
      "function sayHi() {",
      '  console.log("Hi")',
      "}",
      "sayHi()",
    ],
    question: "Що поверне виклик sayHi()?",
    choices: [
      { id: "a", label: '"Hi"' },
      { id: "b", label: "null" },
      { id: "c", label: "undefined" },
      { id: "d", label: "true" },
    ],
    correctChoiceId: "c",
  },
  {
    id: "fn-4",
    title: "Стрілкова функція",
    topic: "arrow",
    codeLines: ["const triple = (n) => n * 3", "triple(4)"],
    question: "Що поверне triple(4)?",
    choices: [
      { id: "a", label: "7" },
      { id: "b", label: "12" },
      { id: "c", label: "4" },
      { id: "d", label: "3" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "fn-5",
    title: "Callback у map",
    topic: "callback",
    codeLines: [
      "let nums = [1, 2, 3]",
      "nums.map((n) => n + 1)",
    ],
    question: "Що поверне цей код?",
    choices: [
      { id: "a", label: "[1, 2, 3]" },
      { id: "b", label: "[2, 3, 4]" },
      { id: "c", label: "6" },
      { id: "d", label: "[0, 1, 2]" },
    ],
    correctChoiceId: "b",
  },
  {
    id: "fn-6",
    title: "Функція в змінній",
    topic: "value",
    codeLines: [
      "const shout = function (word) {",
      "  return word + '!'",
      "}",
      'shout("Ура")',
    ],
    question: "Що поверне shout(\"Ура\")?",
    choices: [
      { id: "a", label: '"Ура"' },
      { id: "b", label: '"Ура!"' },
      { id: "c", label: "undefined" },
      { id: "d", label: "shout" },
    ],
    correctChoiceId: "b",
  },
];

type ModuleDefinition = {
  id: JsLessonModuleId;
  gameId: string;
  title: string;
  description: string;
  levels: JsLessonLevel[];
};

export const seedModules: ModuleDefinition[] = [
  {
    id: "basics",
    gameId: "lesson-js",
    title: "Основи",
    description: "Змінні, рядки, умови, цикли, filter/map",
    levels: basicsLevels,
  },
  {
    id: "arrays",
    gameId: "lesson-js-arrays",
    title: "Масиви",
    description: "length, push, includes, find, slice…",
    levels: arraysLevels,
  },
  {
    id: "objects",
    gameId: "lesson-js-objects",
    title: "Об’єкти",
    description: "ключі, вкладеність, деструктуризація",
    levels: objectsLevels,
  },
  {
    id: "functions",
    gameId: "lesson-js-functions",
    title: "Функції",
    description: "параметри, return, arrow, callback",
    levels: functionsLevels,
  },
];
