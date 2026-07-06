// Standalone DB connectivity test: npm run test:db
// dotenv must load before the client is created — Prisma 7 and plain Node
// don't auto-load .env (Next.js only does it for the app itself).
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting over the pooled Neon connection...");

    const [users, items, collections, itemTypes] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.collection.count(),
      prisma.itemType.count(),
    ]);
    console.log("✓ Read OK  —", { users, items, collections, itemTypes });

    const testUser = await prisma.user.create({
      data: { email: `test-${Date.now()}@test.local`, name: "DB Test" },
    });
    console.log("✓ Write OK —", testUser.id);

    await prisma.user.delete({ where: { id: testUser.id } });
    console.log("✓ Delete OK — test user cleaned up");

    console.log("\nDatabase connection works.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Database test failed:", error);
  process.exit(1);
});
