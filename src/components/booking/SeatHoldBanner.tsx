"use client";

import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { CatFace } from "@/components/dinner/CatFace";
import { dinnerStub } from "@/lib/data";
import { findDinner, formatCountdown, holdActive, seatDestination, useNow } from "@/lib/booking";
import { useDemo } from "@/lib/store";

/**
 * Sticky "Your seat is held" strip with a ticket stub and a live countdown.
 * Used on every signup / onboarding page; on /explore it also offers a way back into the flow.
 */
export function SeatHoldBanner({ showContinue = false, className }: { showContinue?: boolean; className?: string }) {
  const { state, hydrated } = useDemo();
  const now = useNow();
  const hold = state.hold;
  const dinner = hold ? findDinner(state, hold.dinnerId) : undefined;
  if (!hydrated || !hold || !dinner || now === null) return null;

  const active = holdActive(hold, now);
  const left = hold.heldUntil - now;
  const urgent = active && left < 5 * 60 * 1000;

  return (
    <div className={clsx("sticky top-16 z-40 border-b-[2.5px] border-ink", active ? "bg-lemon" : "bg-cream-deep", className)} role="status" aria-live="off">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
        <div className="relative flex items-center gap-2 rounded-xl border-2 border-dashed border-ink bg-white px-3 py-1 font-display text-sm font-bold">
          <CatFace id="orange" className="h-6 w-6" />
          {dinnerStub(dinner)}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.p
              key="on"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 font-display text-[15px] font-semibold"
            >
              Your seat is held
              <span
                className={clsx(
                  "rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-sm font-bold tabular-nums",
                  urgent ? "bg-orange text-white" : "bg-white",
                )}
                aria-label={`${Math.ceil(left / 60000)} minutes left`}
              >
                {formatCountdown(left)}
              </span>
            </motion.p>
          ) : (
            <motion.p key="off" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[15px] font-semibold text-ink-soft">
              Your hold ended — we&apos;ll check if the seat is still free.
            </motion.p>
          )}
        </AnimatePresence>
        {showContinue && (
          <Link
            href={seatDestination(state, dinner.id)}
            className="ml-auto font-display text-sm font-bold underline decoration-2 underline-offset-4 hover:text-orange"
          >
            {state.signedIn ? "Pick up where you left off →" : state.account ? "Log in to continue →" : "Finish signing up →"}
          </Link>
        )}
      </div>
    </div>
  );
}
