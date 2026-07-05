import { FolderClosed, Layers, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { mockCollections, mockItems } from "@/lib/mock-data";

const stats: { label: string; value: number; icon: LucideIcon }[] = [
  { label: "Total Items", value: mockItems.length, icon: Layers },
  { label: "Collections", value: mockCollections.length, icon: FolderClosed },
  {
    label: "Favorite Items",
    value: mockItems.filter((item) => item.isFavorite).length,
    icon: Star,
  },
  {
    label: "Favorite Collections",
    value: mockCollections.filter((collection) => collection.isFavorite)
      .length,
    icon: Star,
  },
];

/**
 * Dashboard stats row: item, collection, and favorite counts computed
 * from mock data.
 */
export function StatsCards() {
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
