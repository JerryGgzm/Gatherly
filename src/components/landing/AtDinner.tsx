"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { CONVERSATION_PROMPTS } from "@/lib/data";

export function AtDinner() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % CONVERSATION_PROMPTS.length), 3600);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section className="relative overflow-hidden border-b-[2.5px] border-ink bg-[#FFE7D6] py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-orange">What happens at dinner?</p>
          <h2 className="mt-1 text-4xl sm:text-5xl">Six seats, good food, zero awkward name tags.</h2>
          <ul className="mt-6 space-y-4 text-lg">
            {[
              ["🚶", "Everyone arrives on their own at 7 PM."],
              ["🃏", "A few optional conversation cards, if the table wants them."],
              ["🧾", "You split the bill at the restaurant. No host, no workshop."],
              ["🤝", "After dinner, pick who you'd meet again. Mutual only."],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink bg-white text-xl shadow-[2px_2px_0_#242424]">{icon}</span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <DinnerScene youSeated />
          <div className="absolute -top-4 right-0 w-[64%] max-w-xs sm:-top-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={reduce ? false : { y: 30, opacity: 0, rotate: 6 }}
                animate={{ y: 0, opacity: 1, rotate: 2 }}
                exit={{ x: -120, opacity: 0, rotate: -12 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="rounded-2xl border-[2.5px] border-ink bg-white p-4 shadow-[4px_4px_0_#242424]"
              >
                <p className="font-display text-xs font-bold uppercase tracking-widest text-purple">Try this one</p>
                <p className="mt-1 font-display text-base font-semibold leading-snug sm:text-lg">{CONVERSATION_PROMPTS[i]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
