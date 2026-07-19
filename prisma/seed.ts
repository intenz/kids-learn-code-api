import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const expressionLevels = [
  {
    id: "expr-1",
    title: "Додавання",
    sortOrder: 1,
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
    sortOrder: 2,
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
    sortOrder: 3,
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
    sortOrder: 4,
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
    sortOrder: 5,
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
    sortOrder: 6,
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
] as const;

async function main() {
  await prisma.progress.deleteMany();
  await prisma.player.deleteMany();
  await prisma.card.deleteMany();
  await prisma.gameLevel.deleteMany();
  await prisma.game.deleteMany();
  await prisma.lesson.deleteMany();

  const lesson1 = await prisma.lesson.create({
    data: {
      id: "lesson-1",
      title: "Перший урок",
      summary: "Знайомство зі змінними",
      body: "Змінна зберігає значення. Наприклад: let a = 3",
      sortOrder: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      id: "lesson-2",
      title: "Другий урок",
      summary: "Додавання і множення",
      body: "Вирази комбінують змінні: a + b, a * b",
      sortOrder: 2,
    },
  });

  const expressionGame = await prisma.game.create({
    data: {
      id: "game-expression",
      slug: "expression",
      title: "Збери вираз",
    },
  });

  const mazeGame = await prisma.game.create({
    data: {
      id: "game-maze",
      slug: "maze",
      title: "Лабіринт",
    },
  });

  for (const level of expressionLevels) {
    await prisma.gameLevel.create({
      data: {
        id: level.id,
        gameId: expressionGame.id,
        title: level.title,
        sortOrder: level.sortOrder,
        codeLines: JSON.stringify(level.codeLines),
        choices: JSON.stringify(level.choices),
        correctChoiceId: level.correctChoiceId,
      },
    });
  }

  await prisma.card.createMany({
    data: [
      {
        id: "1",
        title: lesson1.title,
        type: "lesson",
        sortOrder: 1,
        href: "/lessons",
        lessonId: lesson1.id,
      },
      {
        id: "2",
        title: lesson2.title,
        type: "lesson",
        sortOrder: 2,
        href: "/lessons",
        lessonId: lesson2.id,
      },
      {
        id: "3",
        title: `Гра: ${mazeGame.title}`,
        type: "game",
        sortOrder: 3,
        href: "/games",
        gameId: mazeGame.id,
      },
      {
        id: "4",
        title: `Гра: ${expressionGame.title}`,
        type: "game",
        sortOrder: 4,
        href: "/games/expression",
        gameId: expressionGame.id,
      },
    ],
  });

  console.log("Seeded lessons, games, expression levels, and cards.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
