"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { FlowHeading, FlowShell, Panel } from "@/components/flow/FlowShell";
import { HeldTableAside } from "@/components/flow/HeldTableAside";
import { Button } from "@/components/ui/Button";
import type { IdentityResult } from "@/lib/store";
import { StripeIdentityModal, type DemoOutcome } from "./StripeIdentity";
import { useStep } from "./useStep";

const TERMS = [
  "Meeting new people offline has normal social risks, and I'll use my own judgment.",
  "I'm responsible for my own food allergies and dietary choices.",
  "Food is paid at the restaurant and split evenly. The $15 booking fee is separate from the bill.",
  "I'll follow the community guidelines, and I understand reports can lead to suspension.",
];

function Check({ on, onToggle, children }: { on: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={onToggle}
      className={clsx(
        "flex min-h-14 w-full items-center gap-3 rounded-2xl border-[2.5px] border-ink px-4 py-3 text-left font-display font-semibold transition-shadow",
        on ? "bg-grass-soft shadow-[3px_3px_0_#242424]" : "bg-white hover:bg-lemon-soft",
      )}
    >
      <span
        className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-sm", on ? "bg-grass text-white" : "bg-white")}
        aria-hidden
      >
        {on && "✓"}
      </span>
      {children}
    </button>
  );
}

function Row({ icon, title, sub, done, children }: { icon: string; title: string; sub: string; done: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b-2 border-dashed border-ink/20 py-5 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream text-xl" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold">{title}</p>
          <p className="text-sm text-ink-soft">{sub}</p>
        </div>
        {done && <span className="rounded-full border-2 border-ink bg-grass px-2.5 py-0.5 font-display text-xs font-bold text-white">Verified</span>}
      </div>
      {children}
    </div>
  );
}

function IdCheck({ result, pending, onStart }: { result: IdentityResult | null; pending: boolean; onStart: () => void }) {
  if (pending) {
    return (
      <p className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 font-display text-sm font-bold" role="status">
        <motion.span className="inline-block" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} aria-hidden>
          ⏳
        </motion.span>
        Waiting for Stripe&apos;s result. Usually under a minute.
      </p>
    );
  }
  if (result?.status === "verified") {
    return (
      <span className="self-start rounded-full border-2 border-ink bg-grass-soft px-3 py-1 font-display text-sm font-bold">
        ✓ ID and selfie matched{result.over18 ? " · 18+" : ""}
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {result?.status === "requires_input" && (
        <p className="rounded-2xl border-2 border-ink bg-orange-soft px-4 py-3 text-sm" role="alert">
          <strong className="font-display">That didn&apos;t go through.</strong> {result.error} Nothing is lost, just try again.
        </p>
      )}
      <ol className="grid gap-2 text-sm sm:grid-cols-3">
        {["🪪 Photo of your driver's license", "🤳 A quick selfie", "✅ Result in about a minute"].map((t, i) => (
          <li key={t} className="flex items-center gap-2 rounded-2xl bg-cream px-3 py-2 font-display font-semibold">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-xs">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>
      <Button variant="dark" className="self-start" onClick={onStart}>
        {result ? "Try again" : "Verify with Stripe"}
      </Button>
      <p className="text-xs text-ink-soft">Handled by Stripe Identity. We get the result and your 18+ status, never the photos.</p>
    </div>
  );
}

export function VerifyStep({ next }: { next: string }) {
  const { state, finish } = useStep(next);
  const [terms, setTerms] = useState(state.verified.terms);
  const [identity, setIdentity] = useState<IdentityResult | null>(state.verified.identity ?? null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const idOk = identity?.status === "verified" && identity.over18;
  const ready = state.verified.phone && idOk && terms;

  // Stands in for the backend receiving `identity.verification_session.verified` / `.requires_input`.
  const onSubmitted = (outcome: DemoOutcome) => {
    setOpen(false);
    setPending(true);
    const sessionId = `vs_demo_${Math.random().toString(36).slice(2, 10)}`;
    setTimeout(() => {
      setPending(false);
      setIdentity(
        outcome === "verified"
          ? { sessionId, status: "verified", over18: true }
          : { sessionId, status: "requires_input", over18: false, error: "Stripe couldn't read your license. Try again in better light." },
      );
    }, 1800);
  };

  return (
    <FlowShell
      step="verify"
      aside={<HeldTableAside caption="Everyone at your table passed the same checks: a real phone number and a government ID matched to a selfie." />}
    >
      <FlowHeading kicker="Safety first" title="Quick checks." sub="Every guest is a verified real person. It takes about two minutes." />
      <Panel>
        <Row icon="📱" title="Phone" sub="Checked when you signed up." done={state.verified.phone} />
        <Row
          icon="🪪"
          title="ID check"
          sub="Your driver's license plus a selfie, so everyone at the table is who they say. Also confirms you're 18+."
          done={!!idOk}
        >
          <IdCheck result={identity} pending={pending} onStart={() => setOpen(true)} />
        </Row>
        <Row icon="🤝" title="House rules" sub="The short version of our Terms." done={terms}>
          <ul className="flex flex-col gap-1.5 rounded-2xl bg-cream px-4 py-3 text-sm">
            {TERMS.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden>•</span>
                {t}
              </li>
            ))}
          </ul>
          <Check on={terms} onToggle={() => setTerms((v) => !v)}>
            I agree to the Terms and community guidelines
          </Check>
        </Row>
      </Panel>
      <div className="mt-6 flex justify-end">
        <Button arrow disabled={!ready} onClick={() => finish({ verified: { phone: state.verified.phone, adult: !!idOk, identity, terms } })}>
          Continue
        </Button>
      </div>
      <StripeIdentityModal open={open} onClose={() => setOpen(false)} onSubmitted={onSubmitted} />
    </FlowShell>
  );
}
