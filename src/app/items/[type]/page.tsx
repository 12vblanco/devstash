import { notFound } from "next/navigation";

import { mockItemTypes } from "@/lib/mock-data";

export default async function ItemsByTypePage(
  props: PageProps<"/items/[type]">,
) {
  const { type } = await props.params;
  const itemType = mockItemTypes.find((t) => `${t.name}s` === type);

  if (!itemType) {
    notFound();
  }

  const label =
    itemType.name.charAt(0).toUpperCase() + itemType.name.slice(1) + "s";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{label}</h1>
      <p className="text-muted-foreground mt-2">Coming soon.</p>
    </div>
  );
}
