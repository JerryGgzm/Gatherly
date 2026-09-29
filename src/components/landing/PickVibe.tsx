"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemePicker } from "@/components/ui/ThemePicker";
import { THEMES, type ThemeId } from "@/lib/data";

const listLabels = (ids: ThemeId[]) => {
  const labels = ids.map((id) => THEMES.find((t) => t.id === id)?.label ?? id);
  return labels.length > 1 ? `${labels.slice(0, -1).join(", ")} & ${labels.at(-1)}` : labels[0];
};

export function PickVibe() {
  const [picked, setPicked] = useState<ThemeId[]>(["film", "travel"]);
  return (
    <section className="dotted-bg border-b-[2.5px] border-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-purple">Pick your vibe</p>
        <p className="mt-1 max-w-xl text-lg text-ink-soft">
          Themes give the table something to start with. Nobody has to be the same — it&apos;s just a good first topic.
        </p>
        <ThemePicker className="mt-6" value={picked} onChange={setPicked} />
        <div className="mt-8 min-h-14">
          <AnimatePresence mode="wait">
            {picked.length > 0 && (
              <motion.div
                key={picked.join(",")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <Button href={`/explore?themes=${picked.join(",")}`} arrow>
                  See {listLabels(picked)} tables
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
