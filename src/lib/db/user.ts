import { cache } from "react";

import { prisma } from "@/lib/prisma";

// No session/auth yet (NextAuth is still planned) — every dashboard query
// resolves to the single seeded demo user until real auth is wired up.
const DEMO_USER_EMAIL = "demo@devstash.io";

// Wrapped in React's cache() so the several dashboard data-fetching
// functions that each need the current user id only resolve it once
// per request instead of once per call site.
export const getCurrentUserId = cache(async (): Promise<string> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_USER_EMAIL },
  });
  return user.id;
});
