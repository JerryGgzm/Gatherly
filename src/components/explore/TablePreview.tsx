"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { tableCats } from "@/components/dinner/cats";
import { Button } from "@/components/ui/Button";
import { SEATS_PER_TABLE, budgetById, dinnerStub, locationById, themeById, type Dinner } from "@/lib/data";

type Props = {
  dinner: Dinner;
  heldForYou: boolean;
  seatsOpen: number;
  /** Take-a-seat sequence stage for this dinner. */
  taking: "idle" | "pulling" | "seated";
  onTakeSeat: () => void;
  onSequenceDone: () => void;
};

export function TablePreview({ dinner, heldForYou, seatsOpen, taking, onTakeSeat, onSequenceDone }: Props) {
  const loc = locationById(dinner.location);
  const seated = tableCats(dinner.id, dinner.seatsTaken);
  const full = seatsOpen <= 0 && !heldForYou;
  const orangeIn = seated.includes("orange");

  return (
    <div className="overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-cream-deep shadow-[5px_5px_0_#242424]">
      <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-ink bg-white px-4 py-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dinner.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <p className="font-display text-xs font-bold uppercase tracking-widest" style={{ color: loc.accent }}>
              Peek at the table
            </p>
            <p className="font-display text-lg font-bold">{dinnerStub(dinner)}</p>
          </motion.div>
        </AnimatePresence>
        <span className="shrink-0 rounded-full border-2 border-ink bg-lemon px-2.5 py-0.5 font-display text-xs font-bold">
          {Math.min(dinner.seatsTaken, SEATS_PER_TABLE)} of {SEATS_PER_TABLE} seated
        </span>
      </div>

      <DinnerScene
        present={seated}
        selected={taking !== "idle" && orangeIn}
        youSeated={taking === "seated" || heldForYou}
        seatLabel={full ? "Table full" : dinner.seatsTaken === 0 ? "Be the first" : "Could be you"}
        onSeatClick={full ? undefined : onTakeSeat}
        onSequenceDone={onSequenceDone}
      />

      <div className="flex flex-col gap-3 border-t-[2.5px] border-ink bg-white px-4 py-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {dinner.themes.map((t) => {
            const th = themeById(t);
            return (
              <span
                key={t}
                className="rounded-full border-2 border-ink px-2 py-0.5 font-display text-[11px] font-bold uppercase"
                style={{ background: `${th.color}33` }}
              >
                {th.icon} {th.label}
              </span>
            );
          })}
          <span className="ml-auto font-display text-sm font-semibold text-ink-soft">{budgetById(dinner.budget).range} / person</span>
        </div>
        <p className="text-sm text-ink-soft">Who&apos;s really coming stays a surprise until dinner. The cats are just keeping the seats warm.</p>
        {!full && (
          <Button onClick={onTakeSeat} arrow={taking === "idle"} variant={taking !== "idle" ? "lemon" : "primary"} className="w-full">
            {taking !== "idle" ? "Seat held ✓" : heldForYou ? "Continue" : "Take a seat"}
          </Button>
        )}
      </div>
    </div>
  );
}
