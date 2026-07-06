import { Clock } from "lucide-react";

import { ItemRow } from "@/components/dashboard/ItemRow";
import { getRecentItems } from "@/lib/db/items";

/** 10 most recently created items on the dashboard main area. */
export async function RecentItems() {
  const items = await getRecentItems();

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Clock className="text-muted-foreground size-4" />
        Recent Items
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
