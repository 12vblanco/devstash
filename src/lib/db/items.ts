import type { Prisma } from "@/generated/prisma/client";
import { getCurrentUserId } from "@/lib/db/user";
import { prisma } from "@/lib/prisma";

const itemWithRelations = {
  type: { select: { name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} satisfies Prisma.ItemInclude;

type ItemWithRelations = Prisma.ItemGetPayload<{
  include: typeof itemWithRelations;
}>;

export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  type: { name: string; icon: string | null; color: string | null };
  tags: string[];
}

function toItemSummary(item: ItemWithRelations): ItemSummary {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    type: item.type,
    tags: item.tags.map((itemTag) => itemTag.tag.name),
  };
}

/** All pinned items for the dashboard's Pinned section. */
export async function getPinnedItems(): Promise<ItemSummary[]> {
  const userId = await getCurrentUserId();

  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: "desc" },
    include: itemWithRelations,
  });

  return items.map(toItemSummary);
}

/** Most recently created items for the dashboard's Recent Items section. */
export async function getRecentItems(limit = 10): Promise<ItemSummary[]> {
  const userId = await getCurrentUserId();

  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: itemWithRelations,
  });

  return items.map(toItemSummary);
}

export interface ItemCounts {
  total: number;
  favorites: number;
}

/** Total and favorite item counts for the dashboard stats row. */
export async function getItemCounts(): Promise<ItemCounts> {
  const userId = await getCurrentUserId();

  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorites };
}

export interface ItemTypeSummary {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  itemCount: number;
}

// ItemType has no createdAt to order by, so pin the sidebar to this fixed
// sequence (matches the system types as seeded); anything unrecognized
// (future custom types) sorts after the known ones.
const SYSTEM_TYPE_ORDER = [
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
];

function typeSortIndex(name: string): number {
  const index = SYSTEM_TYPE_ORDER.indexOf(name);
  return index === -1 ? SYSTEM_TYPE_ORDER.length : index;
}

/** System item types with the current user's per-type item counts, for the sidebar. */
export async function getItemTypesWithCounts(): Promise<ItemTypeSummary[]> {
  const userId = await getCurrentUserId();

  const types = await prisma.itemType.findMany({
    where: { OR: [{ isSystem: true }, { userId }] },
    include: {
      _count: { select: { items: { where: { userId } } } },
    },
  });

  return types
    .map((type) => ({
      id: type.id,
      name: type.name,
      icon: type.icon,
      color: type.color,
      itemCount: type._count.items,
    }))
    .sort((a, b) => typeSortIndex(a.name) - typeSortIndex(b.name));
}
