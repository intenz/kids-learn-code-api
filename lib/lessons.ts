import { prisma } from "@/lib/db";

export type LessonSummary = {
  id: string;
  title: string;
  summary: string;
};

export type LessonDetail = LessonSummary & {
  body: string;
};

export async function listLessons(): Promise<LessonSummary[]> {
  const lessons = await prisma.lesson.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      summary: true,
    },
  });
  return lessons;
}

export async function getLesson(id: string): Promise<LessonDetail | null> {
  return prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      body: true,
    },
  });
}
