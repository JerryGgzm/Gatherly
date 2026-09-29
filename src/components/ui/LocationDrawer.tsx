"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { DINNERS, type Location } from "@/lib/data";
import { Button } from "./Button";
import { TicketCard } from "./TicketCard";

export function LocationDrawer({ location, onClose }: { location: Location | null; onClose: () => void }) {
  useEffect(() => {
    if (!location) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [location, onClose]);

  const dinners = location ? DINNERS.filter((d) => d.location === location.id) : [];

  return (
    <AnimatePresence>
      {location && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[60] bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${location.name} dinners`}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[80vh] max-w-3xl overflow-y-auto rounded-t-[32px] border-[2.5px] border-b-0 border-ink bg-cream p-6 pb-10 shadow-[0_-4px_0_#242424] sm:p-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.15 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-ink/30" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-xs font-bold text-white" style={{ background: location.accent }}>
                  {location.short}
                </span>
                <h3 className="mt-2 text-3xl sm:text-4xl">{location.name}</h3>
                <p className="mt-1 text-ink-soft">Upcoming dinners</p>
              </div>
              <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-white font-display text-lg font-bold shadow-[2px_2px_0_#242424]" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {dinners.map((d, i) => (
                <TicketCard key={d.id} dinner={d} tilt={i % 2 ? 0.8 : -0.8} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button href={`/explore?area=${location.id}`} arrow>
                Explore dinners
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
