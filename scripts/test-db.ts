// Standalone DB connectivity test: npm run test:db
// dotenv must load before the client is created — Prisma 7 and plain Node
// don't auto-load .env (Next.js only does it for the app itself).
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const DEMO_USER_EMAIL = "demo@devstash.io";
const EXPECTED_COLLECTIONS = 5;
const EXPECTED_ITEMS = 18;
const EXPECTED_ITEM_TYPES = 7;

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

    console.log("\nFetching demo data...");
    const demoUser = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      include: {
        collections: {
          include: { items: { include: { type: true } } },
        },
      },
    });

    if (!demoUser) {
      throw new Error(`Demo user (${DEMO_USER_EMAIL}) not found — run "npx prisma db seed" first`);
    }

    let demoItemCount = 0;
    for (const collection of demoUser.collections) {
      demoItemCount += collection.items.length;
      const titles = collection.items.map((item) => `${item.title} (${item.type.name})`).join(", ");
      console.log(`  - ${collection.name}: ${collection.items.length} items — ${titles}`);
    }

    if (demoUser.collections.length !== EXPECTED_COLLECTIONS) {
      throw new Error(
        `Expected ${EXPECTED_COLLECTIONS} collections for demo user, found ${demoUser.collections.length}`
      );
    }
    if (demoItemCount !== EXPECTED_ITEMS) {
      throw new Error(`Expected ${EXPECTED_ITEMS} items for demo user, found ${demoItemCount}`);
    }
    if (itemTypes !== EXPECTED_ITEM_TYPES) {
      throw new Error(`Expected ${EXPECTED_ITEM_TYPES} item types, found ${itemTypes}`);
    }
    console.log(
      `✓ Demo data OK — user "${demoUser.name}", ${demoUser.collections.length} collections, ${demoItemCount} items, ${itemTypes} item types`
    );

    const testUser = await prisma.user.create({
      data: { email: `test-${Date.now()}@test.local`, name: "DB Test" },
    });
    console.log("\n✓ Write OK —", testUser.id);

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
