import { FileText, Star } from "lucide-react";

import { CollectionCardMenu } from "@/components/dashboard/CollectionCardMenu";
import { Card, CardContent } from "@/components/ui/card";
import { getRecentCollections } from "@/lib/db/collections";
import { typeIcons } from "@/lib/type-icons";

/**
 * Collections grid on the dashboard main area, ordered by most recently
 * updated first. Card border color and type icons are derived from the
 * item types actually present in each collection.
 */
export async function RecentCollections() {
  const collections = await getRecentCollections();

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <span className="text-muted-foreground text-sm">View all</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => {
          const dominantType = collection.types[0];
          return (
            <Card
              key={collection.id}
              className="border-l-4 transition-shadow hover:shadow-md hover:ring-foreground/20"
              style={{ borderLeftColor: dominantType?.color ?? undefined }}
            >
              <CardContent className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium">{collection.name}</h3>
                  {collection.isFavorite && (
                    <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
                  )}
                  <div className="ml-auto">
                    <CollectionCardMenu isFavorite={collection.isFavorite} />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {collection.itemCount}{" "}
                  {collection.itemCount === 1 ? "item" : "items"}
                </p>
                {collection.description && (
                  <p className="text-muted-foreground text-sm">
                    {collection.description}
                  </p>
                )}
                {collection.types.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {collection.types.map((type) => {
                      const Icon = typeIcons[type.icon ?? ""] ?? FileText;
                      return (
                        <div
                          key={type.name}
                          className="flex size-6 shrink-0 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: `${type.color}1a`,
                            color: type.color ?? undefined,
                          }}
                        >
                          <Icon className="size-3.5" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
