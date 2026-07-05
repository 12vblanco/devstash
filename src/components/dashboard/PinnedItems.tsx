import { Pin } from "lucide-react";

import { ItemRow } from "@/components/dashboard/ItemRow";
import { mockItems } from "@/lib/mock-data";

const pinnedItems = mockItems.filter((item) => item.isPinned);

/** Pinned items section on the dashboard main area. */
export function PinnedItems() {
  if (pinnedItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Pin className="text-muted-foreground size-4" />
        Pinned
      </h2>
      <div className="space-y-3">
        {pinnedItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
