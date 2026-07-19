import { prisma } from "@/lib/db";

export type ProgressItemType = "lesson" | "game_level";

export type ProgressRecord = {
  id: string;
  itemType: ProgressItemType;
  itemId: string;
  gameId: string | null;
  completed: boolean;
  attempts: number;
  updatedAt: string;
};

export async function createPlayer(id?: string) {
  return prisma.player.create({
    data: id ? { id } : {},
    select: { id: true, createdAt: true },
  });
}

export async function getPlayer(id: string) {
  return prisma.player.findUnique({
    where: { id },
    select: { id: true, createdAt: true },
  });
}

export async function ensurePlayer(id: string) {
  const existing = await getPlayer(id);
  if (existing) {
    return existing;
  }
  return createPlayer(id);
}

export async function listProgress(playerId: string): Promise<ProgressRecord[]> {
  const rows = await prisma.progress.findMany({
    where: { playerId },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    itemType: row.itemType as ProgressItemType,
    itemId: row.itemId,
    gameId: row.gameId,
    completed: row.completed,
    attempts: row.attempts,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export type UpsertProgressInput = {
  playerId: string;
  itemType: ProgressItemType;
  itemId: string;
  gameId?: string | null;
  completed?: boolean;
  incrementAttempts?: boolean;
};

export async function upsertProgress(
  input: UpsertProgressInput,
): Promise<ProgressRecord> {
  await ensurePlayer(input.playerId);

  const existing = await prisma.progress.findUnique({
    where: {
      playerId_itemType_itemId: {
        playerId: input.playerId,
        itemType: input.itemType,
        itemId: input.itemId,
      },
    },
  });

  const attempts =
    (existing?.attempts ?? 0) + (input.incrementAttempts ? 1 : 0);

  const row = await prisma.progress.upsert({
    where: {
      playerId_itemType_itemId: {
        playerId: input.playerId,
        itemType: input.itemType,
        itemId: input.itemId,
      },
    },
    create: {
      playerId: input.playerId,
      itemType: input.itemType,
      itemId: input.itemId,
      gameId: input.gameId ?? null,
      completed: input.completed ?? false,
      attempts: input.incrementAttempts ? 1 : 0,
    },
    update: {
      ...(input.gameId !== undefined ? { gameId: input.gameId } : {}),
      ...(input.completed !== undefined ? { completed: input.completed } : {}),
      ...(input.incrementAttempts ? { attempts } : {}),
    },
  });

  return {
    id: row.id,
    itemType: row.itemType as ProgressItemType,
    itemId: row.itemId,
    gameId: row.gameId,
    completed: row.completed,
    attempts: row.attempts,
    updatedAt: row.updatedAt.toISOString(),
  };
}
