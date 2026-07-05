"use client";

import Link from "next/link";
import {
  ChevronDown,
  Code2,
  FileText,
  ImageIcon,
  Layers,
  Link2,
  Settings,
  Sparkles,
  Star,
  StickyNote,
  Terminal,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  mockCollections,
  mockItemTypeCounts,
  mockItemTypes,
  mockUser,
} from "@/lib/mock-data";
import type { LucideIcon } from "lucide-react";

const typeIcons: Record<string, LucideIcon> = {
  Code: Code2,
  Sparkles,
  Terminal,
  StickyNote,
  File: FileText,
  Image: ImageIcon,
  Link: Link2,
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
const recentCollections = [...mockCollections]
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  .slice(0, 5);

/**
 * Dashboard sidebar — item type navigation, favorite/recent collections,
 * and the user account footer. Collapses to icon rail on desktop and
 * renders as a Sheet drawer on mobile (handled by the sidebar primitive).
 */
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="bg-gradient-to-br from-violet-500 to-blue-500 text-white flex size-7 shrink-0 items-center justify-center rounded-lg">
            <Layers className="size-4" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden font-semibold">
            DevStash
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer">
                Types
                <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mockItemTypes.map((type) => {
                    const Icon = typeIcons[type.icon ?? ""] ?? FileText;
                    const label =
                      type.name.charAt(0).toUpperCase() +
                      type.name.slice(1) +
                      "s";
                    return (
                      <SidebarMenuItem key={type.id}>
                        <SidebarMenuButton asChild tooltip={label}>
                          <Link href={`/items/${type.name}s`}>
                            <Icon
                              className="size-4"
                              style={{ color: type.color ?? undefined }}
                            />
                            <span>{label}</span>
                          </Link>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>
                          {mockItemTypeCounts[
                            type.name as keyof typeof mockItemTypeCounts
                          ] ?? 0}
                        </SidebarMenuBadge>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer">
                Collections
                <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <p className="text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden px-2 pt-1 pb-1 text-xs">
                  Favorites
                </p>
                <SidebarMenu>
                  {favoriteCollections.map((collection) => (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton tooltip={collection.name}>
                        <Star className="size-4 fill-current text-amber-400" />
                        <span>{collection.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>
                        {collection.itemCount}
                      </SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                <p className="text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden px-2 pt-3 pb-1 text-xs">
                  Recent
                </p>
                <SidebarMenu>
                  {recentCollections.map((collection) => (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton tooltip={collection.name}>
                        <Layers className="size-4" />
                        <span>{collection.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>
                        {collection.itemCount}
                      </SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback>{initials(mockUser.name)}</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">
              {mockUser.name}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {mockUser.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="group-data-[collapsible=icon]:hidden shrink-0"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
