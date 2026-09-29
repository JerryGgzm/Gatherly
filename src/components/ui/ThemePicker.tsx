"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { THEMES, type ThemeId } from "@/lib/data";
import { Sticker } from "./Sticker";

export function ThemePicker({
  value,
  onChange,
  max = 3,
  size = "md",
  className,
}: {
  value: ThemeId[];
  onChange: (next: ThemeId[]) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [nudge, setNudge] = useState(false);
  const full = value.length >= max;

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(false), 1800);
    return () => clearTimeout(t);
  }, [nudge]);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-2xl sm:text-3xl">Pick up to {max} vibes</h3>
        <span className={clsx("rounded-full border-2 border-ink px-3 py-0.5 font-display text-sm font-bold", full ? "bg-orange text-white" : "bg-white")}>
          {value.length} / {max} selected
        </span>
        <AnimatePresence>
          {nudge && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-display text-base font-bold text-orange"
              role="status"
            >
              Three is plenty 😄
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start sm:gap-5">
        {THEMES.map((t) => {
          const selected = value.includes(t.id);
          return (
            <Sticker
              key={t.id}
              label={t.label}
              icon={t.icon}
              color={t.color}
              tilt={t.tilt}
              size={size}
              selected={selected}
              dimmed={full}
              blocked={full && !selected}
              onBlocked={() => setNudge(true)}
              onClick={() => onChange(selected ? value.filter((v) => v !== t.id) : [...value, t.id])}
            />
          );
        })}
      </div>
    </div>
  );
}
