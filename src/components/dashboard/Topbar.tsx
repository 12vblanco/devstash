import { FolderPlus, PanelLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Dashboard top bar: sidebar toggle, search, and create actions.
 * Phase 1 is display-only — no handlers are wired up yet.
 */
export function Topbar() {
  return (
    <header className="flex h-16 items-center gap-3 border-b px-4">
      <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
        <PanelLeft className="size-5" />
      </Button>

      <div className="relative max-w-xl flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search items..."
          className="pl-9"
          aria-label="Search items"
        />
        <kbd className="text-muted-foreground bg-muted pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 rounded border px-1.5 font-mono text-xs sm:inline-flex">
          ⌘ K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline">
          <FolderPlus className="size-4" />
          New Collection
        </Button>
        <Button>
          <Plus className="size-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
