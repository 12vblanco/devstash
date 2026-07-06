import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 no longer auto-loads .env — dotenv above does it for the CLI.
// The CLI (migrations) must use Neon's DIRECT (unpooled) connection; the app
// itself connects through the pooled DATABASE_URL via the Neon driver adapter.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
