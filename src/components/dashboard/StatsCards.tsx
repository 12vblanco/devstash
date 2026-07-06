import { FolderClosed, Layers, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getCollectionCounts } from "@/lib/db/collections";
import { getItemCounts } from "@/lib/db/items";

/** Dashboard stats row: item, collection, and favorite counts from the database. */
export async function StatsCards() {
  const [itemCounts, collectionCounts] = await Promise.all([
    getItemCounts(),
    getCollectionCounts(),
  ]);

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Total Items", value: itemCounts.total, icon: Layers },
    {
      label: "Collections",
      value: collectionCounts.total,
      icon: FolderClosed,
    },
    { label: "Favorite Items", value: itemCounts.favorites, icon: Star },
    {
      label: "Favorite Collections",
      value: collectionCounts.favorites,
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-3">
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
              <stat.icon className="text-muted-foreground size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-muted-foreground truncate text-xs">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
