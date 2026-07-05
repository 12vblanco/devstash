import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { mockCollections } from "@/lib/mock-data";

const recentCollections = [...mockCollections].sort(
  (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
);

/**
 * Collections grid on the dashboard main area, ordered by most recently
 * updated first.
 */
export function RecentCollections() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <span className="text-muted-foreground text-sm">View all</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCollections.map((collection) => (
          <Card key={collection.id}>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-1.5">
                <h3 className="font-medium">{collection.name}</h3>
                {collection.isFavorite && (
                  <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {collection.itemCount} items
              </p>
              {collection.description && (
                <p className="text-muted-foreground text-sm">
                  {collection.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
