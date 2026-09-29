"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { budgetById, locationById, themeById, type Dinner } from "@/lib/data";
import { formatCountdown, holdActive, seatsLeft, useNow, useTakeSeat } from "@/lib/booking";
import { useDemo } from "@/lib/store";
import { SeatRow } from "./SeatRow";

const MotionLink = motion.create(Link);

type Props = {
  dinner: Dinner;
  tilt?: number;
  className?: string;
  /** Shared clock from a parent list; each card ticks on its own otherwise. */
  now?: number | null;
  /** Take over navigation (e.g. to play the table animation first). */
  onTakeSeat?: (dinner: Dinner) => void;
  pending?: boolean;
  onPreview?: (dinner: Dinner | null) => void;
};

export function TicketCard({ dinner, tilt = 0, className, now: sharedNow, onTakeSeat, pending = false, onPreview }: Props) {
  const reduce = useReducedMotion();
  const { state } = useDemo();
  const ownNow = useNow();
  const now = sharedNow === undefined ? ownNow : sharedNow;
  const { reserve, destination, toggleWaitlist } = useTakeSeat();
  const loc = locationById(dinner.location);
  const budget = budgetById(dinner.budget);

  const heldForYou = holdActive(state.hold, now) && state.hold.dinnerId === dinner.id;
  const left = seatsLeft(dinner, state.hold, now);
  const full = left <= 0 && !heldForYou;
  const waitlisted = state.waitlist.includes(dinner.id);

  const stamp = heldForYou ? `Held · ${formatCountdown(state.hold!.heldUntil - now!)}` : full ? "Full" : `${left} seat${left > 1 ? "s" : ""} left`;
  const cta = pending ? "Seat held ✓" : heldForYou ? "Continue" : full ? (waitlisted ? "On the waitlist ✓" : "Save me a seat") : "Take a seat";

  const shared = {
    className: clsx("group relative block w-full text-left", className),
    style: { rotate: tilt },
    initial: "rest" as const,
    animate: pending ? ("hover" as const) : ("rest" as const),
    whileHover: reduce ? undefined : ("hover" as const),
    variants: { rest: { y: 0 }, hover: { y: -6, rotate: tilt * 0.3 } },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
    onMouseEnter: () => onPreview?.(dinner),
    onFocus: () => onPreview?.(dinner),
    "aria-label": `${dinner.dayLabel} ${loc.name}, 7 PM, ${full ? "table full" : heldForYou ? "seat held for you" : `${left} seats left`}. ${cta}`,
  };

  const body = (
    <>
      <div
        className={clsx(
          "relative flex overflow-hidden rounded-[22px] border-[2.5px] border-ink bg-[#FFFDF7] shadow-[4px_4px_0_#242424] transition-shadow group-hover:shadow-[7px_7px_0_#242424]",
          heldForYou && "ring-4 ring-lemon",
          full && "bg-[#F4EFE6]",
        )}
      >
        <div
          className="flex w-24 shrink-0 flex-col items-center justify-center gap-0.5 border-r-[2.5px] border-dashed border-ink/60 px-2 py-4 text-center sm:w-28"
          style={{ background: `${loc.accent}22` }}
        >
          <span className="font-display text-sm font-bold tracking-widest" style={{ color: loc.accent }}>
            {dinner.weekday}
          </span>
          <span className="font-display text-xs font-semibold tracking-widest text-ink-soft">{dinner.month}</span>
          <span className="font-display text-4xl font-bold leading-none">{dinner.day}</span>
          <span className="mt-1 rounded-full bg-ink px-2 py-0.5 font-display text-[11px] font-semibold text-cream">7:00 PM</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-display text-lg font-bold uppercase tracking-wide">{loc.short}</span>
            <span className="shrink-0 font-display text-sm font-semibold text-ink-soft" title={budget.label}>
              {budget.range}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dinner.created && <span className="rounded-full border-2 border-ink bg-grass-soft px-2 py-0.5 font-display text-[11px] font-bold uppercase">★ Your table</span>}
            {dinner.themes.map((t) => {
              const th = themeById(t);
              return (
                <span key={t} className="rounded-full border-2 border-ink px-2 py-0.5 font-display text-[11px] font-bold uppercase" style={{ background: `${th.color}33` }}>
                  {th.icon} {th.label}
                </span>
              );
            })}
          </div>
          <SeatRow dinnerId={dinner.id} taken={Math.min(dinner.seatsTaken, 6)} heldForYou={heldForYou} />
          <div className="flex items-center justify-between gap-2">
            <motion.span
              className={clsx(
                "whitespace-nowrap rounded-md border-2 px-2 py-0.5 font-display text-xs font-bold uppercase tabular-nums",
                heldForYou ? "border-ink bg-lemon text-ink" : full ? "border-ink bg-ink text-cream" : "border-orange text-orange",
              )}
              variants={{ rest: { rotate: -6 }, hover: { rotate: [-6, 2, -8, -4] } }}
              transition={{ duration: 0.5 }}
            >
              {stamp}
            </motion.span>
            <span className={clsx("whitespace-nowrap font-display text-sm font-bold", pending && "text-grass")}>
              {cta}{" "}
              {!pending && !waitlisted && (
                <motion.span className="inline-block" variants={{ rest: { x: 0 }, hover: { x: 5 } }}>
                  →
                </motion.span>
              )}
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
    </>
  );

  if (full) {
    return (
      <motion.button type="button" {...shared} aria-pressed={waitlisted} onClick={() => toggleWaitlist(dinner)}>
        {body}
      </motion.button>
    );
  }

  return (
    <MotionLink
      href={destination(dinner)}
      {...shared}
      onClick={(e: React.MouseEvent) => {
        if (pending) return e.preventDefault();
        if (onTakeSeat) {
          e.preventDefault();
          onTakeSeat(dinner);
        } else reserve(dinner);
      }}
    >
      {body}
    </MotionLink>
  );
}
