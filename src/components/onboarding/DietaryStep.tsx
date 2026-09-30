"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FlowHeading, FlowShell, Panel } from "@/components/flow/FlowShell";
import { HeldTableAside } from "@/components/flow/HeldTableAside";
import { Button } from "@/components/ui/Button";
import type { SpiceLevel } from "@/lib/store";
import { useStep } from "./useStep";

const SPICE: { id: SpiceLevel; label: string; chilies: number }[] = [
  { id: "none", label: "Can't do spicy", chilies: 1 },
  { id: "mild", label: "Mild", chilies: 1 },
  { id: "medium", label: "Medium", chilies: 2 },
  { id: "hot", label: "Bring the heat", chilies: 3 },
];

function SpiceCard({ opt, selected, onPick }: { opt: (typeof SPICE)[number]; selected: boolean; onPick: () => void }) {
  const reduce = useReducedMotion();
  const cold = opt.id === "none";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onPick}
      className={clsx(
        "relative flex min-h-32 flex-col items-center justify-center gap-2 rounded-[22px] border-[2.5px] border-ink p-3 transition-shadow",
        selected
          ? (cold ? "bg-blue-soft" : "bg-orange-soft") + " shadow-[5px_5px_0_#242424]"
          : "bg-white shadow-[3px_3px_0_#242424] hover:shadow-[5px_5px_0_#242424]",
      )}
    >
      <span className="relative flex h-12 items-end" aria-hidden>
        {Array.from({ length: opt.chilies }, (_, i) => (
          <motion.span
            key={i}
            className={clsx("text-3xl", cold && "grayscale-[40%]")}
            animate={selected && !reduce ? { y: [0, -10, 0] } : { y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            🌶️
          </motion.span>
        ))}
        {cold && <span className="absolute -right-3 -top-1 text-xl">🧊</span>}
        <AnimatePresence>
          {selected && opt.id === "hot" && !reduce && (
            <motion.span
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl"
              initial={{ opacity: 0, y: 8, scale: 0.4 }}
              animate={{ opacity: [0, 1, 1, 0], y: -6, scale: 1.2 }}
              transition={{ duration: 1 }}
            >
              🔥
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="font-display text-sm font-bold sm:text-base">{opt.label}</span>
    </button>
  );
}

function VeggieCard({ veg, selected, onPick }: { veg: boolean; selected: boolean; onPick: () => void }) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onPick}
      className={clsx(
        "flex min-h-24 items-center gap-4 rounded-[22px] border-[2.5px] border-ink p-4 text-left transition-shadow",
        selected
          ? (veg ? "bg-grass-soft" : "bg-lemon-soft") + " shadow-[5px_5px_0_#242424]"
          : "bg-white shadow-[3px_3px_0_#242424] hover:shadow-[5px_5px_0_#242424]",
      )}
    >
      <motion.span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-3xl"
        animate={selected && !reduce ? (veg ? { rotate: [0, -14, 14, -8, 0], y: [0, -6, 0] } : { scale: [1, 1.12, 1] }) : {}}
        transition={{ duration: 0.6 }}
        aria-hidden
      >
        {veg ? "🥕" : "🍽️"}
      </motion.span>
      <span>
        <span className="block font-display text-lg font-bold">{veg ? "Vegetarian" : "No restrictions"}</span>
        <span className="text-sm text-ink-soft">{veg ? "We'll pick places with real veggie options." : "Happy to eat whatever's good."}</span>
      </span>
    </button>
  );
}

export function DietaryStep({ next }: { next: string }) {
  const { state, finish } = useStep(next);
  const [spice, setSpice] = useState<SpiceLevel | null>(state.dietary.spice);
  const [veg, setVeg] = useState<boolean | null>(state.dietary.vegetarian);
  const ready = spice !== null && veg !== null;

  return (
    <FlowShell step="dietary" aside={<HeldTableAside caption="We pick restaurants that work for everyone at the table, so nobody has to ask." />}>
      <FlowHeading kicker="Last one" title="What's on your plate?" sub="Helps us choose a restaurant the whole table will enjoy." />
      <div className="flex flex-col gap-6">
        <Panel>
          <h2 className="text-2xl">How spicy?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Spice preference">
            {SPICE.map((o) => (
              <SpiceCard key={o.id} opt={o} selected={spice === o.id} onPick={() => setSpice(o.id)} />
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-2xl">Any restrictions?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Vegetarian">
            <VeggieCard veg={false} selected={veg === false} onPick={() => setVeg(false)} />
            <VeggieCard veg selected={veg === true} onPick={() => setVeg(true)} />
          </div>
          <p className="mt-4 text-sm text-ink-soft">Allergies? Tell the restaurant when you arrive. You&apos;re responsible for your own dietary choices.</p>
        </Panel>
      </div>
      <div className="mt-6 flex justify-end">
        <Button arrow disabled={!ready} onClick={() => ready && finish({ dietary: { spice, vegetarian: veg } })}>
          Finish
        </Button>
      </div>
    </FlowShell>
  );
}
