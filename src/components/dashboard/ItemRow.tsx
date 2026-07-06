import { FileText, Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { mockItemTypes, mockItems } from "@/lib/mock-data";
import { typeIcons } from "@/lib/type-icons";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

/** A single item row shared by the Pinned and Recent Items sections. */
export function ItemRow({ item }: { item: (typeof mockItems)[number] }) {
  const type = mockItemTypes.find((t) => t.id === item.itemTypeId);
  const Icon = typeIcons[type?.icon ?? ""] ?? FileText;

  return (
    <div
      className="border-border flex items-start gap-3 rounded-lg border border-l-4 p-4 transition-colors hover:bg-accent/50"
      style={{ borderLeftColor: type?.color }}
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${type?.color}1a`, color: type?.color }}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium">{item.title}</span>
          {item.isPinned && (
            <Pin className="text-muted-foreground size-3.5 shrink-0" />
          )}
          {item.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
          )}
          <span className="text-muted-foreground ml-auto shrink-0 text-xs">
            {dateFormatter.format(item.createdAt)}
          </span>
        </div>
        {item.description && (
          <p className="text-muted-foreground mt-1 text-sm">
            {item.description}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
