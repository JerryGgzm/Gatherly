"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SeatRow } from "@/components/ui/SeatRow";
import type { Night } from "@/lib/data";

/** Ticket-shaped slot for a night with no open table: either nobody has started one, or every table is full. */
export function StartTableCard({ night, reason, filtered, onStart }: { night: Night; reason: "empty" | "full"; filtered: boolean; onStart: () => void }) {
  const reduce = useReducedMotion();
  const title =
    reason === "empty"
      ? filtered
        ? "No matching table yet"
        : "No tables yet this night"
      : filtered
        ? "Matching tables are full"
        : "Every table this night is full";
  const line = reason === "empty" ? "Start one and take the first seat." : "Start a new one and take the first seat.";
  return (
    <motion.button
      type="button"
      onClick={onStart}
      className="group relative block w-full text-left"
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      variants={{ rest: { y: 0 }, hover: { y: -6 } }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      aria-label={`${title} on ${night.dayLabel} ${night.month} ${night.day}. Start a table.`}
    >
      <div className="flex overflow-hidden rounded-[22px] border-[2.5px] border-dashed border-ink bg-white/60 transition-colors group-hover:bg-lemon-soft">
        <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-0.5 border-r-[2.5px] border-dashed border-ink/60 px-2 py-4 text-center sm:w-28">
          <span className="font-display text-sm font-bold tracking-widest text-ink-soft">{night.weekday}</span>
          <span className="font-display text-xs font-semibold tracking-widest text-ink-soft">{night.month}</span>
          <span className="font-display text-4xl font-bold leading-none text-ink-soft">{night.day}</span>
          <span className="mt-1 rounded-full border-2 border-dashed border-ink/50 px-2 py-0.5 font-display text-[11px] font-semibold text-ink-soft">
            7:00 PM
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <span className="font-display text-lg font-bold">{title}</span>
          <span className="text-sm text-ink-soft">{line}</span>
          <SeatRow dinnerId="new" taken={0} />
          <span className="flex items-center gap-2 font-display text-sm font-bold text-orange">
            <motion.span
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-orange text-base leading-none text-white"
              variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
              aria-hidden
            >
              +
            </motion.span>
            Start a table
          </span>
        </div>
      </div>
    </motion.button>
  );
}
