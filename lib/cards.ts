import { prisma } from "@/lib/db";

export async function listCards() {
  const cards = await prisma.card.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      type: true,
      href: true,
    },
  });

  return cards.map((card) => ({
    id: card.id,
    title: card.title,
    type: card.type,
    ...(card.href ? { href: card.href } : {}),
  }));
}
