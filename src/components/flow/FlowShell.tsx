"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { SeatHoldBanner } from "@/components/booking/SeatHoldBanner";
import { missingSteps, type OnboardingStep } from "@/lib/booking";
import { useDemo } from "@/lib/store";

export type FlowStep = "account" | OnboardingStep;

const STEPS: { id: FlowStep; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "verify", label: "Verify" },
  { id: "profile", label: "Profile" },
  { id: "intent", label: "Intent" },
  { id: "questionnaire", label: "Questions" },
  { id: "dietary", label: "Dietary" },
];

function Stepper({ current }: { current: FlowStep }) {
  const { state } = useDemo();
  const missing = missingSteps(state);
  const done = (id: FlowStep) => (id === "account" ? state.signedIn : !missing.includes(id));
  return (
    <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto" aria-label="Signup progress">
      {STEPS.map((s, i) => {
        const active = s.id === current;
        const ok = done(s.id) && !active;
        return (
          <li key={s.id} className="flex shrink-0 items-center gap-1">
            {i > 0 && <span className={clsx("h-0.5 w-4 rounded-full sm:w-8", ok || active ? "bg-ink" : "bg-ink/20")} aria-hidden />}
            <span
              className={clsx(
                "flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 font-display text-xs font-bold",
                active ? "border-ink bg-orange text-white shadow-[2px_2px_0_#242424]" : ok ? "border-ink bg-grass-soft" : "border-ink/25 text-ink-soft",
              )}
              aria-current={active ? "step" : undefined}
            >
              {ok ? "✓" : i + 1}
              <span className={clsx(!active && "hidden sm:inline")}>{s.label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Frame for every signup / onboarding / booking page: seat-hold banner, step progress, and a form column with an optional aside. */
export function FlowShell({ step, aside, children, className }: { step?: FlowStep; aside?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <>
      <SeatHoldBanner />
      <div className="dotted-bg flex-1">
        <div className={clsx("mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10", className)}>
          {step && (
            <div className="mb-6 sm:mb-8">
              <Stepper current={step} />
            </div>
          )}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={clsx("grid items-start gap-8", aside && "lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12")}
          >
            <div className="min-w-0">{children}</div>
            {aside && <aside className="hidden lg:block">{aside}</aside>}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export function FlowHeading({ kicker, title, sub }: { kicker?: string; title: string; sub?: React.ReactNode }) {
  return (
    <div className="mb-6">
      {kicker && <p className="font-display text-sm font-bold uppercase tracking-widest text-orange">{kicker}</p>}
      <h1 className="mt-1 text-4xl sm:text-5xl">{title}</h1>
      {sub && <p className="mt-2 max-w-lg text-lg text-ink-soft">{sub}</p>}
    </div>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("rounded-[28px] border-[2.5px] border-ink bg-white p-5 shadow-[5px_5px_0_#242424] sm:p-7", className)}>{children}</div>;
}
