"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { CatFace } from "@/components/dinner/CatFace";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { CAT_ORDER, CATS } from "@/components/dinner/cats";
import { ChoiceCard } from "@/components/flow/Fields";
import { FlowShell } from "@/components/flow/FlowShell";
import { Button } from "@/components/ui/Button";
import { OPTIONAL_QUESTIONS, QUESTIONS, type Question } from "@/lib/data";
import { useStep } from "./useStep";

const PER_CAT = QUESTIONS.length / CAT_ORDER.length;
const COLORS = ["#FFD84D", "#CFE0FF", "#D3F0D8", "#FFD2BF", "#E4D9FF"];

type Phase = { kind: "core"; i: number } | { kind: "offer" } | { kind: "optional"; i: number };

function TableProgress({ answered }: { answered: number }) {
  const seated = CAT_ORDER.slice(0, Math.floor(answered / PER_CAT));
  const latest = seated.at(-1);
  return (
    <div className="sticky top-36 overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-cream-deep shadow-[5px_5px_0_#242424]">
      <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-white px-4 py-3">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-orange">Building your table</p>
          <p className="font-display text-lg font-bold">
            {seated.length} of {CAT_ORDER.length} guests seated
          </p>
        </div>
        <span className="rounded-full border-2 border-ink bg-lemon px-2.5 py-0.5 font-display text-xs font-bold tabular-nums">
          {answered}/{QUESTIONS.length}
        </span>
      </div>
      <DinnerScene present={seated} seatLabel="Your seat" bubbles={false} />
      <div className="min-h-12 border-t-[2.5px] border-ink bg-white px-4 py-3 text-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={seated.length} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-ink-soft">
            {latest ? (
              <>
                <span className="font-display font-bold text-ink">{CATS[latest].label}</span> pulled up a chair.{" "}
                {seated.length < CAT_ORDER.length ? `Every ${PER_CAT} answers, another guest arrives.` : "The table is ready for you."}
              </>
            ) : (
              `Every ${PER_CAT} answers, another guest sits down.`
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MobileProgress({ answered }: { answered: number }) {
  const n = Math.floor(answered / PER_CAT);
  return (
    <div className="mb-5 flex items-center gap-3 lg:hidden">
      <div className="flex gap-1" aria-hidden>
        {CAT_ORDER.map((id, i) => (
          <span key={id} className={clsx("h-8 w-8 rounded-full", i >= n && "opacity-25 grayscale")}>
            <CatFace id={id} className="h-8 w-8" />
          </span>
        ))}
      </div>
      <span className="font-display text-sm font-bold text-ink-soft">{n} of 5 seated</span>
    </div>
  );
}

function QuestionCard({
  q,
  label,
  value,
  onPick,
  onBack,
  onNext,
  nextLabel,
}: {
  q: Question;
  label: string;
  value: string | undefined;
  onPick: (id: string) => void;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  const reduce = useReducedMotion();
  const [flash, setFlash] = useState(0);
  return (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <p className="font-display text-sm font-bold uppercase tracking-widest text-purple">
        {label} · {q.dimension}
      </p>
      <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{q.prompt}</h1>
      <div className="relative mt-6">
        {!reduce && flash > 0 && (
          <motion.span
            key={flash}
            className="pointer-events-none absolute -inset-3 rounded-[32px] bg-lemon"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden
          />
        )}
        <div className="relative grid gap-3" role="radiogroup" aria-label={q.prompt}>
          {q.options.map((o, i) => (
            <ChoiceCard
              key={o.id}
              art={o.art}
              label={o.label}
              selected={value === o.id}
              color={COLORS[i % COLORS.length]}
              tilt={i % 2 ? 0.5 : -0.5}
              onClick={() => {
                if (value !== o.id) setFlash((f) => f + 1);
                onPick(o.id);
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        {onBack ? (
          <button type="button" onClick={onBack} className="min-h-11 font-display text-sm font-bold underline decoration-2 underline-offset-4">
            ← Back
          </button>
        ) : (
          <span />
        )}
        <Button arrow disabled={!value} onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </motion.div>
  );
}

export function QuestionnaireStep({ next }: { next: string }) {
  const { state, update, finish } = useStep(next);
  const firstOpen = QUESTIONS.findIndex((q) => !state.answers[q.id]);
  const [phase, setPhase] = useState<Phase>(firstOpen === -1 ? { kind: "offer" } : { kind: "core", i: firstOpen });
  const answered = QUESTIONS.filter((q) => state.answers[q.id]).length;

  const pick = (id: string, v: string) => update((s) => ({ answers: { ...s.answers, [id]: v } }));
  const pickOptional = (id: string, v: string) => update((s) => ({ optionalAnswers: { ...s.optionalAnswers, [id]: v } }));

  return (
    <FlowShell step="questionnaire" aside={<TableProgress answered={answered} />}>
      <MobileProgress answered={answered} />
      <AnimatePresence mode="wait" initial={false}>
        {phase.kind === "core" && (
          <QuestionCard
            key={QUESTIONS[phase.i].id}
            q={QUESTIONS[phase.i]}
            label={`Question ${phase.i + 1} of ${QUESTIONS.length}`}
            value={state.answers[QUESTIONS[phase.i].id]}
            onPick={(v) => pick(QUESTIONS[phase.i].id, v)}
            onBack={phase.i > 0 ? () => setPhase({ kind: "core", i: phase.i - 1 }) : undefined}
            onNext={() => setPhase(phase.i + 1 < QUESTIONS.length ? { kind: "core", i: phase.i + 1 } : { kind: "offer" })}
            nextLabel={phase.i + 1 < QUESTIONS.length ? "Next" : "Finish"}
          />
        )}

        {phase.kind === "offer" && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mt-4">
              <CatFace id="calico" className="h-28 w-28" />
              <motion.span
                className="absolute -right-6 bottom-0 text-5xl"
                animate={{ rotate: [0, -12, 8, 0], x: [0, -4, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                aria-hidden
              >
                🔍
              </motion.span>
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl">Want even better tables?</h1>
            <p className="mt-2 max-w-md text-lg text-ink-soft">Answer a few more whenever you want. They&apos;re optional and never block a booking.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button arrow onClick={() => setPhase({ kind: "optional", i: 0 })}>
                Keep going
              </Button>
              <Button variant="paper" onClick={() => finish({})}>
                I&apos;m good for now
              </Button>
            </div>
          </motion.div>
        )}

        {phase.kind === "optional" && (
          <QuestionCard
            key={OPTIONAL_QUESTIONS[phase.i].id}
            q={OPTIONAL_QUESTIONS[phase.i]}
            label={`Bonus ${phase.i + 1} of ${OPTIONAL_QUESTIONS.length}`}
            value={state.optionalAnswers[OPTIONAL_QUESTIONS[phase.i].id]}
            onPick={(v) => pickOptional(OPTIONAL_QUESTIONS[phase.i].id, v)}
            onBack={() => setPhase(phase.i > 0 ? { kind: "optional", i: phase.i - 1 } : { kind: "offer" })}
            onNext={() => (phase.i + 1 < OPTIONAL_QUESTIONS.length ? setPhase({ kind: "optional", i: phase.i + 1 }) : finish({}))}
            nextLabel={phase.i + 1 < OPTIONAL_QUESTIONS.length ? "Next" : "Done"}
          />
        )}
      </AnimatePresence>
    </FlowShell>
  );
}
