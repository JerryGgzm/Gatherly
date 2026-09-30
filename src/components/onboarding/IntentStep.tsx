"use client";

import { useState } from "react";
import { ChoiceCard } from "@/components/flow/Fields";
import { FlowHeading, FlowShell } from "@/components/flow/FlowShell";
import { HeldTableAside } from "@/components/flow/HeldTableAside";
import { Button } from "@/components/ui/Button";
import { SOCIAL_INTENTS } from "@/lib/data";
import { useStep } from "./useStep";

const COLORS = ["#FFD84D", "#CFE0FF", "#D3F0D8", "#FFD2BF", "#E4D9FF", "#FFDBE8", "#FFF0B3", "#E4D9FF"];

export function IntentStep({ next }: { next: string }) {
  const { state, finish } = useStep(next);
  const [picked, setPicked] = useState<string[]>(state.intents);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <FlowShell step="intent" aside={<HeldTableAside caption="We seat people who want similar things from the night. It matters more than anything else." />}>
      <FlowHeading kicker="Your why" title="What are you hoping for?" sub="Pick as many as you like." />
      <div className="grid gap-4 sm:grid-cols-2" role="group" aria-label="Social intent">
        {SOCIAL_INTENTS.map((it, i) => (
          <ChoiceCard
            key={it.id}
            multi
            art={it.icon}
            label={it.label}
            sub={it.id === "romantic" ? "Just a signal. Gatherly is never a dating app." : undefined}
            selected={picked.includes(it.id)}
            color={COLORS[i % COLORS.length]}
            tilt={i % 2 ? 0.6 : -0.6}
            onClick={() => toggle(it.id)}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <span className="font-display text-sm font-bold text-ink-soft">{picked.length ? `${picked.length} picked` : "Pick at least one"}</span>
        <Button arrow disabled={!picked.length} onClick={() => finish({ intents: picked })}>
          Continue
        </Button>
      </div>
    </FlowShell>
  );
}
