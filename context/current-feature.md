# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Setup** — Scaffolded the project with Next.js (React 19) and Tailwind CSS v4. Established base configuration and project structure, ready for feature development.
- **Dashboard UI — Phase 1** — Initialized ShadCN UI (Nova preset, radix base) and installed button/input components. Added the `/dashboard` route with a top bar (search input, New Collection / New Item buttons, display-only), and placeholder Sidebar/Main sections. Dark mode enabled by default. Swapped the default Geist fonts for Manrope (sans) + JetBrains Mono (monospace) for a more dev-focused SaaS feel, and fixed the font CSS variable wiring so the theme's `--font-sans`/`--font-mono` actually resolve to the loaded fonts.
- **Dashboard UI — Phase 2** — Replaced the placeholder Sidebar with a full `AppSidebar` built on ShadCN's `sidebar` composite (collapsible icon rail on desktop, Sheet-based drawer on mobile). Added Types navigation linking to `/items/[type]` (with a stub route/page), Favorite and Recent collections sections, and a user avatar/account footer using mock data. Wired the Topbar's toggle button to the new `SidebarTrigger`, and wrapped the app in `TooltipProvider` for collapsed-state tooltips. Verified in the browser at desktop and mobile breakpoints; production build passes.
- **Dashboard UI — Phase 3** — Built out the dashboard main area: 4 stats cards (total items, collections, favorite items, favorite collections), a recent-collections grid, a Pinned items section, and a 10-item Recent Items list, all driven by mock data. Extracted the shared item-type icon map to `src/lib/type-icons.ts` and removed an unnecessary `"use client"` directive from `AppSidebar` so it renders on the server per the project's server-components-by-default convention. Verified server-rendered output and interactivity in the browser; production build passes.
- **Neon PostgreSQL + Prisma Setup** — Set up Prisma 7 with Neon PostgreSQL. Schema covers all data models from the project overview plus NextAuth v5 models (Account, Session, VerificationToken), with cascade deletes and indexes for the dashboard's query patterns. Handled Prisma 7's breaking changes: the `prisma-client` generator with a required `output` path (gitignored `src/generated/prisma`), the datasource URL moved out of the schema into `prisma.config.ts`, explicit dotenv loading (v7 no longer auto-loads `.env`), and the now-mandatory driver adapter (`@prisma/adapter-neon`) wired up in a `src/lib/prisma.ts` singleton. `DATABASE_URL` (pooled) is used at runtime; `DIRECT_URL` (unpooled) is used by the CLI for migrations. Initial migration `20260705234351_init` created with `prisma migrate dev` (never `db push`) and applied to the Neon dev branch. Added `scripts/test-db.ts` (`npm run test:db`) as a standalone read/write/delete connectivity check. Verified: migration status in sync, production build passes.
- **Database Seed Script** — Added `prisma/seed.ts`, wired into Prisma 7's now-explicit `seed` command (`prisma.config.ts` → `migrations.seed`, run via `npx prisma db seed`). Seeds a demo user (bcryptjs-hashed password), the 7 system item types, and 5 collections with 18 items covering snippets, prompts, commands, and links, using real reference URLs for the link items. Idempotent — resets and recreates the demo user's data and upserts item types on every run, so it's safe to re-run. Added a new `bcryptjs` dependency. Extended `scripts/test-db.ts` to fetch the demo user's collections/items (with resolved item-type relations) and assert the seeded counts, in addition to its existing connectivity and write/delete checks. Verified: seed runs twice with identical counts, `npm run test:db` confirms all relations resolve correctly, production build passes.
