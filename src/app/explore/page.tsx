import type { Metadata } from "next";
import { ExploreView } from "@/components/explore/ExploreView";
import { MAX_THEMES, type Filters } from "@/components/explore/filters";
import { BUDGETS, LOCATIONS, NIGHTS, THEMES, nightKey } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pick a night — Gatherly.pub",
  description: "Browse upcoming six-person dinners in Seattle by night, neighborhood, vibe and budget.",
};

const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : (v ?? "").split(",")).map((s) => s.trim()).filter(Boolean);

function pick<T extends string>(raw: string | string[] | undefined, allowed: readonly T[], max = Infinity): T[] {
  return [...new Set(list(raw))].filter((v): v is T => (allowed as readonly string[]).includes(v)).slice(0, max);
}

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const sp = await searchParams;
  const initial: Filters = {
    nights: pick(sp.night, NIGHTS.map(nightKey)),
    areas: pick(sp.area, LOCATIONS.map((l) => l.id)),
    themes: pick(sp.themes, THEMES.map((t) => t.id), MAX_THEMES),
    budgets: pick(sp.budget, BUDGETS.map((b) => b.id)),
  };
  return <ExploreView initial={initial} />;
}
