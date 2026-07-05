# Current Feature

<!-- Feature Name -->

Dashboard UI — Phase 3

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

Phase 3 of 3 for the dashboard UI layout. Full spec: @context/features/dashboard-phase-3-spec.md

- Main area to the right
- Recent collections
- Pinned items
- 10 recent items
- 4 stats cards at the top (total items, collections, favorite items, favorite collections — not in screenshot)

## Notes

<!-- Any extra notes -->

- Visual reference: @context/screenshots/dashboard-ui-main.png
- Mock data: import directly from @src/lib/mock-data.ts until a database is implemented
- Builds on @context/features/dashboard-phase-1-spec.md and @context/features/dashboard-phase-2-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Setup** — Scaffolded the project with Next.js (React 19) and Tailwind CSS v4. Established base configuration and project structure, ready for feature development.
- **Dashboard UI — Phase 1** — Initialized ShadCN UI (Nova preset, radix base) and installed button/input components. Added the `/dashboard` route with a top bar (search input, New Collection / New Item buttons, display-only), and placeholder Sidebar/Main sections. Dark mode enabled by default. Swapped the default Geist fonts for Manrope (sans) + JetBrains Mono (monospace) for a more dev-focused SaaS feel, and fixed the font CSS variable wiring so the theme's `--font-sans`/`--font-mono` actually resolve to the loaded fonts.
- **Dashboard UI — Phase 2** — Replaced the placeholder Sidebar with a full `AppSidebar` built on ShadCN's `sidebar` composite (collapsible icon rail on desktop, Sheet-based drawer on mobile). Added Types navigation linking to `/items/[type]` (with a stub route/page), Favorite and Recent collections sections, and a user avatar/account footer using mock data. Wired the Topbar's toggle button to the new `SidebarTrigger`, and wrapped the app in `TooltipProvider` for collapsed-state tooltips. Verified in the browser at desktop and mobile breakpoints; production build passes.
