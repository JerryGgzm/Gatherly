"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { budgetById, locationById, themeById, type Dinner } from "@/lib/data";
import { SeatRow } from "./SeatRow";

const MotionLink = motion.create(Link);

export function TicketCard({ dinner, tilt = 0, className }: { dinner: Dinner; tilt?: number; className?: string }) {
  const reduce = useReducedMotion();
  const loc = locationById(dinner.location);
  const budget = budgetById(dinner.budget);
  const left = 6 - dinner.seatsTaken;
  const full = left <= 0;

  return (
    <MotionLink
      href={full ? `/explore` : `/book/${dinner.id}`}
      className={clsx("group relative block", className)}
      style={{ rotate: tilt }}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      variants={{ rest: { y: 0 }, hover: { y: -6, rotate: tilt * 0.3 } }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <div className="relative flex overflow-hidden rounded-[22px] border-[2.5px] border-ink bg-[#FFFDF7] shadow-[4px_4px_0_#242424] transition-shadow group-hover:shadow-[7px_7px_0_#242424]">
        <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-0.5 border-r-[2.5px] border-dashed border-ink/60 px-2 py-4 text-center sm:w-28" style={{ background: `${loc.accent}22` }}>
          <span className="font-display text-sm font-bold tracking-widest" style={{ color: loc.accent }}>
            {dinner.weekday}
          </span>
          <span className="font-display text-xs font-semibold tracking-widest text-ink-soft">{dinner.month}</span>
          <span className="font-display text-4xl font-bold leading-none">{dinner.day}</span>
          <span className="mt-1 rounded-full bg-ink px-2 py-0.5 font-display text-[11px] font-semibold text-cream">7:00 PM</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <div className="font-display text-lg font-bold uppercase tracking-wide">{loc.short}</div>
          <div className="flex flex-wrap gap-1.5">
            {dinner.themes.map((t) => {
              const th = themeById(t);
              return (
                <span key={t} className="rounded-full border-2 border-ink px-2 py-0.5 font-display text-[11px] font-bold uppercase" style={{ background: `${th.color}33` }}>
                  {th.icon} {th.label}
                </span>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2">
            <SeatRow taken={dinner.seatsTaken} />
            <span className="font-display text-sm font-semibold text-ink-soft">{budget.range}</span>
          </div>
          <div className="flex items-center justify-between">
            <motion.span
              className={clsx(
                "rounded-md border-2 px-2 py-0.5 font-display text-xs font-bold uppercase",
                full ? "border-ink-soft text-ink-soft" : "border-orange text-orange",
              )}
              variants={{ rest: { rotate: -6 }, hover: { rotate: [-6, 2, -8, -4] } }}
              transition={{ duration: 0.5 }}
            >
              {full ? "Table full" : `${left} seat${left > 1 ? "s" : ""} left`}
            </motion.span>
            <span className="font-display text-sm font-bold">
              {full ? "Save me a seat" : "Take a seat"}{" "}
              <motion.span className="inline-block" variants={{ rest: { x: 0 }, hover: { x: 5 } }}>
                →
              </motion.span>
            </span>
          </div>
        </div>

        <motion.span
          aria-hidden
          className="absolute right-0 top-0 h-0 w-0 border-ink"
          style={{ borderStyle: "solid", borderColor: "transparent #FFF7E8 #FFD84D transparent" }}
          variants={{ rest: { borderWidth: "0px 0px 0px 0px" }, hover: { borderWidth: "0px 22px 22px 0px" } }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <span aria-hidden className="absolute left-[88px] top-[-9px] h-4 w-4 rounded-full border-[2.5px] border-ink bg-cream sm:left-[104px]" />
      <span aria-hidden className="absolute bottom-[-9px] left-[88px] h-4 w-4 rounded-full border-[2.5px] border-ink bg-cream sm:left-[104px]" />
    </MotionLink>
  );
}
