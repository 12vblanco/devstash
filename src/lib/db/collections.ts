import { prisma } from "@/lib/prisma";

// No session/auth yet (NextAuth is still planned) — every dashboard query
// resolves to the single seeded demo user until real auth is wired up.
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface CollectionTypeSummary {
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  updatedAt: Date;
  /** Distinct item types present in the collection, sorted most-used first. */
  types: CollectionTypeSummary[];
}

/**
 * Collections for the dashboard's main area, most recently updated first,
 * with per-type item counts for border color and icon display.
 */
export async function getRecentCollections(): Promise<CollectionSummary[]> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_USER_EMAIL },
  });

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        select: {
          type: { select: { name: true, icon: true, color: true } },
        },
      },
    },
  });

  return collections.map((collection) => {
    const typeCounts = new Map<string, CollectionTypeSummary>();
    for (const { type } of collection.items) {
      const existing = typeCounts.get(type.name);
      if (existing) {
        existing.count += 1;
      } else {
        typeCounts.set(type.name, {
          name: type.name,
          icon: type.icon,
          color: type.color,
          count: 1,
        });
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      updatedAt: collection.updatedAt,
      types: [...typeCounts.values()].sort((a, b) => b.count - a.count),
    };
  });
}
