import { PrismaClient } from "@prisma/client";
import { seedExpressionLevels } from "./seed-data/expressionSource";
import { seedModules } from "./seed-data/jsLessonsSource";

const prisma = new PrismaClient();

async function seedLessons() {
  let sortModule = 0;
  for (const mod of seedModules) {
    await prisma.contentModule.upsert({
      where: { id: mod.id },
      create: {
        id: mod.id,
        kind: "lesson",
        gameId: mod.gameId,
        title: mod.title,
        description: mod.description,
        sortOrder: sortModule,
      },
      update: {
        kind: "lesson",
        gameId: mod.gameId,
        title: mod.title,
        description: mod.description,
        sortOrder: sortModule,
      },
    });

    let sortLevel = 0;
    for (const level of mod.levels) {
      await prisma.contentLevel.upsert({
        where: { id: level.id },
        create: {
          id: level.id,
          moduleId: mod.id,
          title: level.title,
          topic: level.topic,
          question: level.question ?? null,
          codeLinesJson: JSON.stringify(level.codeLines),
          choicesJson: JSON.stringify(level.choices),
          correctChoiceId: level.correctChoiceId,
          sortOrder: sortLevel,
        },
        update: {
          moduleId: mod.id,
          title: level.title,
          topic: level.topic,
          question: level.question ?? null,
          codeLinesJson: JSON.stringify(level.codeLines),
          choicesJson: JSON.stringify(level.choices),
          correctChoiceId: level.correctChoiceId,
          sortOrder: sortLevel,
        },
      });
      sortLevel += 1;
    }
    sortModule += 1;
  }
}

async function seedExpression() {
  await prisma.contentModule.upsert({
    where: { id: "expression" },
    create: {
      id: "expression",
      kind: "game",
      gameId: "expression",
      title: "Збери вираз",
      description: "Обчисли результат JS-виразу",
      sortOrder: 100,
    },
    update: {
      kind: "game",
      gameId: "expression",
      title: "Збери вираз",
      description: "Обчисли результат JS-виразу",
      sortOrder: 100,
    },
  });

  let sortLevel = 0;
  for (const level of seedExpressionLevels) {
    await prisma.contentLevel.upsert({
      where: { id: level.id },
      create: {
        id: level.id,
        moduleId: "expression",
        title: level.title,
        topic: "expression",
        question: "Що дорівнює result?",
        codeLinesJson: JSON.stringify(level.codeLines),
        choicesJson: JSON.stringify(level.choices),
        correctChoiceId: level.correctChoiceId,
        sortOrder: sortLevel,
      },
      update: {
        moduleId: "expression",
        title: level.title,
        topic: "expression",
        question: "Що дорівнює result?",
        codeLinesJson: JSON.stringify(level.codeLines),
        choicesJson: JSON.stringify(level.choices),
        correctChoiceId: level.correctChoiceId,
        sortOrder: sortLevel,
      },
    });
    sortLevel += 1;
  }
}

async function main() {
  await seedLessons();
  await seedExpression();
  const modules = await prisma.contentModule.count();
  const levels = await prisma.contentLevel.count();
  console.log(`Seeded content: ${modules} modules, ${levels} levels`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
