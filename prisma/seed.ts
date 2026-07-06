// Run via `npx prisma db seed` (Prisma 7 no longer seeds automatically).
// prisma.config.ts's `seed` command loads dotenv, but this script is also
// runnable directly with `tsx prisma/seed.ts`, so load it here too.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

interface SeedItem {
  title: string;
  typeName: (typeof SYSTEM_ITEM_TYPES)[number]["name"];
  description: string;
  content?: string;
  url?: string;
  language?: string;
}

interface SeedCollection {
  name: string;
  description: string;
  items: SeedItem[];
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        title: "useDebounce & useLocalStorage",
        typeName: "snippet",
        language: "typescript",
        description: "Two small custom hooks for debounced values and persisted local state.",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
`,
      },
      {
        title: "Compound Component Pattern",
        typeName: "snippet",
        language: "typescript",
        description: "A Tabs component built with context so subcomponents share state implicitly.",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabsContext();
  return activeTab === id ? <div role="tabpanel">{children}</div> : null;
};
`,
      },
      {
        title: "Utility Functions",
        typeName: "snippet",
        language: "typescript",
        description: "Small, dependency-free helpers used across most projects.",
        content: `export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(decimals) + " " + units[i];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, "")
    .replace(/[\\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        title: "Code Review Prompt",
        typeName: "prompt",
        description: "Reusable prompt for getting a focused, bug-first code review.",
        content: `Review the following code for correctness, security, and maintainability.

For each issue found, report:
1. The specific line(s) affected
2. Why it's a problem (a concrete failure scenario, not a style preference)
3. A minimal suggested fix

Focus on logic errors, edge cases, security vulnerabilities, and unhandled error paths. Skip formatting nitpicks unless they cause a real bug.

Code:
[paste code here]
`,
      },
      {
        title: "Documentation Generator",
        typeName: "prompt",
        description: "Generates concise docs for a function or module.",
        content: `Generate documentation for the following function/module.

Include:
- A one-sentence summary of what it does
- Parameters with types and descriptions
- Return value
- One realistic usage example
- Any thrown errors or edge cases callers should know about

Keep it concise — don't restate what well-named identifiers already say.

Code:
[paste code here]
`,
      },
      {
        title: "Refactoring Assistant",
        typeName: "prompt",
        description: "Refactors code for readability without changing behavior.",
        content: `Refactor the following code to improve readability and reduce duplication, without changing its external behavior.

Constraints:
- Keep the public API/signature identical unless told otherwise
- Don't introduce new dependencies
- Explain each change and why it's an improvement
- Flag anything that isn't clearly behavior-preserving instead of guessing

Code:
[paste code here]
`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Multi-Stage Dockerfile for Next.js",
        typeName: "snippet",
        language: "dockerfile",
        description: "Production Docker build using the Next.js standalone output.",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
`,
      },
      {
        title: "Deploy to Production",
        typeName: "command",
        language: "bash",
        description: "Build and deploy the current branch straight to production.",
        content: "npm run build && vercel deploy --prod",
      },
      {
        title: "Docker Documentation",
        typeName: "link",
        description: "Official Docker docs.",
        url: "https://docs.docker.com/",
      },
      {
        title: "GitHub Actions Documentation",
        typeName: "link",
        description: "Official GitHub Actions docs.",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        title: "Git: delete merged branches",
        typeName: "command",
        language: "bash",
        description: "Removes local branches already merged into main.",
        content: `git branch --merged main | grep -v "^\\*\\|main" | xargs -n 1 git branch -d`,
      },
      {
        title: "Docker: remove unused data",
        typeName: "command",
        language: "bash",
        description: "Frees disk space by pruning unused containers, images, and volumes.",
        content: "docker system prune -af --volumes",
      },
      {
        title: "Free a port",
        typeName: "command",
        language: "bash",
        description: "Kills whatever process is listening on port 3000.",
        content: "lsof -ti:3000 | xargs kill -9",
      },
      {
        title: "Check outdated npm packages",
        typeName: "command",
        language: "bash",
        description: "Lists outdated dependencies so they can be reviewed and upgraded.",
        content: "npx npm-check-updates",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Documentation",
        typeName: "link",
        description: "CSS/Tailwind reference.",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui Components",
        typeName: "link",
        description: "Component library built on Radix + Tailwind.",
        url: "https://ui.shadcn.com/",
      },
      {
        title: "Material Design 3",
        typeName: "link",
        description: "Google's design system.",
        url: "https://m3.material.io/",
      },
      {
        title: "Lucide Icons",
        typeName: "link",
        description: "Icon library used throughout this project.",
        url: "https://lucide.dev/",
      },
    ],
  },
];

async function main() {
  console.log("Seeding system item types...");
  const itemTypesByName = new Map<string, string>();
  for (const type of SYSTEM_ITEM_TYPES) {
    // Prisma's compound-unique `where` (userId_name) rejects an explicit
    // null, even though the column itself is nullable — findFirst first.
    const existing = await prisma.itemType.findFirst({
      where: { userId: null, name: type.name },
    });

    const itemType = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: type.icon, color: type.color },
        })
      : await prisma.itemType.create({
          data: { name: type.name, icon: type.icon, color: type.color, isSystem: true },
        });

    itemTypesByName.set(type.name, itemType.id);
  }

  console.log("Resetting demo user...");
  await prisma.user.deleteMany({ where: { email: DEMO_USER.email } });

  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
  const user = await prisma.user.create({
    data: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  console.log("Seeding collections and items...");
  let itemCount = 0;
  for (const collectionData of COLLECTIONS) {
    const collection = await prisma.collection.create({
      data: {
        name: collectionData.name,
        description: collectionData.description,
        userId: user.id,
      },
    });

    for (const item of collectionData.items) {
      const typeId = itemTypesByName.get(item.typeName);
      if (!typeId) throw new Error(`Unknown item type: ${item.typeName}`);

      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          contentType: "text",
          content: item.content,
          url: item.url,
          language: item.language,
          userId: user.id,
          typeId,
          collectionId: collection.id,
        },
      });
      itemCount++;
    }
  }

  console.log(
    `Seed complete: 1 user, ${SYSTEM_ITEM_TYPES.length} item types, ${COLLECTIONS.length} collections, ${itemCount} items.`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
