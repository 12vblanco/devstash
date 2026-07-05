import { Clock } from "lucide-react";

import { ItemRow } from "@/components/dashboard/ItemRow";
import { mockItems } from "@/lib/mock-data";

const recentItems = [...mockItems]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 10);

/** 10 most recently created items on the dashboard main area. */
export function RecentItems() {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Clock className="text-muted-foreground size-4" />
        Recent Items
      </h2>
      <div className="space-y-3">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
