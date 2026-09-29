"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BUDGETS, LOCATIONS, NIGHTS, THEMES, nightKey, nightLabel, type ThemeId } from "@/lib/data";
import { EMPTY_FILTERS, MAX_THEMES, type Filters } from "./filters";

export function Chip({
  on,
  color = "#FFD84D",
  onClick,
  children,
  className,
}: {
  on: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -2, rotate: -1 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      className={clsx(
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-ink px-3.5 font-display text-sm font-semibold transition-shadow",
        on ? "shadow-[3px_3px_0_#242424]" : "bg-white hover:bg-lemon-soft",
        className,
      )}
      style={on ? { background: color } : undefined}
    >
      {children}
    </motion.button>
  );
}

function Row({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex min-h-11 w-28 shrink-0 items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-ink-soft">{label}</div>
      <div className="-mx-4 flex min-w-0 flex-1 flex-col gap-1 px-4 sm:mx-0 sm:px-0">
        <div className="no-scrollbar -my-1 flex gap-2 overflow-x-auto py-1 pr-4 sm:flex-wrap sm:overflow-visible sm:pr-0">{children}</div>
        {hint}
      </div>
    </div>
  );
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function FilterBar({ value, onChange, count }: { value: Filters; onChange: (next: Filters) => void; count: number }) {
  const shake = useAnimationControls();
  const reduce = useReducedMotion();
  const [nudge, setNudge] = useState(false);
  const active = value.nights.length + value.areas.length + value.themes.length + value.budgets.length > 0;

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(false), 1800);
    return () => clearTimeout(t);
  }, [nudge]);

  const pickTheme = (id: ThemeId) => {
    if (!value.themes.includes(id) && value.themes.length >= MAX_THEMES) {
      if (!reduce) shake.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.35 } });
      setNudge(true);
      return;
    }
    onChange({ ...value, themes: toggle(value.themes, id) });
  };

  return (
    <div className="overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-white p-4 shadow-[5px_5px_0_#242424] sm:overflow-visible sm:p-6">
      <div className="flex flex-col gap-4">
        <Row label="Night">
          <Chip on={value.nights.length === 0} onClick={() => onChange({ ...value, nights: [] })}>
            Any night
          </Chip>
          {NIGHTS.map((n) => {
            const k = nightKey(n);
            return (
              <Chip
                key={k}
                on={value.nights.includes(k)}
                color={n.weekday === "THU" ? "#CFE0FF" : "#FFD2BF"}
                onClick={() => onChange({ ...value, nights: toggle(value.nights, k) })}
              >
                {nightLabel(n)}
              </Chip>
            );
          })}
        </Row>

        <Row label="Area">
          {LOCATIONS.map((l) => {
            const on = value.areas.includes(l.id);
            return (
              <Chip key={l.id} on={on} color={`${l.accent}55`} onClick={() => onChange({ ...value, areas: toggle(value.areas, l.id) })}>
                <span className="h-3 w-3 rounded-full border-2 border-ink" style={{ background: l.accent }} aria-hidden />
                {l.short}
              </Chip>
            );
          })}
        </Row>

        <Row
          label="Vibes"
          hint={
            <div className="flex min-h-5 items-center gap-2 font-display text-xs font-semibold text-ink-soft">
              {value.themes.length} / {MAX_THEMES} picked
              <AnimatePresence>
                {nudge && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-bold text-orange"
                    role="status"
                  >
                    Three is plenty 😄
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          }
        >
          <motion.div animate={shake} className="flex gap-2 sm:flex-wrap">
            {THEMES.map((t) => {
              const on = value.themes.includes(t.id);
              return (
                <Chip
                  key={t.id}
                  on={on}
                  color={`${t.color}66`}
                  onClick={() => pickTheme(t.id)}
                  className={clsx(!on && value.themes.length >= MAX_THEMES && "opacity-70")}
                >
                  <span aria-hidden>{t.icon}</span>
                  {t.label}
                </Chip>
              );
            })}
          </motion.div>
        </Row>

        <Row label="Budget">
          {BUDGETS.map((b) => (
            <Chip
              key={b.id}
              on={value.budgets.includes(b.id)}
              color={`${b.color}88`}
              onClick={() => onChange({ ...value, budgets: toggle(value.budgets, b.id) })}
            >
              <span className="font-bold">{b.sign}</span>
              {b.label}
              <span className="text-ink-soft">{b.range}</span>
            </Chip>
          ))}
        </Row>
      </div>

      <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-ink/25 pt-4">
        <span className="font-display text-sm font-bold" aria-live="polite">
          {count} {count === 1 ? "table" : "tables"} {active ? "match" : "coming up"}
        </span>
        {active && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="min-h-11 font-display text-sm font-bold underline decoration-2 underline-offset-4 hover:text-orange"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
