"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Stand-in for Stripe Identity's hosted flow (stripe.verifyIdentity / VerificationSession.url).
 * In production the backend creates a `document` session with `require_matching_selfie`,
 * and the verdict arrives via the `identity.verification_session.*` webhooks, not from this UI.
 */

type Step = "consent" | "document" | "selfie" | "submitting" | "submitted";
export type DemoOutcome = "verified" | "unreadable";

const STRIPE = "#635BFF";

function Card({ label, done, onClick }: { label: string; done: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors",
        done ? "border-[#635BFF] bg-[#F5F4FF] text-[#3C35C9]" : "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50",
      )}
    >
      {done ? (
        <>
          <svg viewBox="0 0 64 40" className="h-12 w-20" aria-hidden>
            <rect x="1" y="1" width="62" height="38" rx="5" fill="#fff" stroke="#635BFF" strokeWidth="2" />
            <rect x="7" y="8" width="16" height="20" rx="3" fill="#C9C6FF" />
            <rect x="28" y="10" width="28" height="4" rx="2" fill="#C9C6FF" />
            <rect x="28" y="18" width="20" height="4" rx="2" fill="#E2E0FF" />
            <rect x="28" y="26" width="24" height="4" rx="2" fill="#E2E0FF" />
          </svg>
          ✓ {label}
        </>
      ) : (
        <>
          <span className="text-2xl" aria-hidden>
            📷
          </span>
          {label}
        </>
      )}
    </button>
  );
}

export function StripeIdentityModal({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: (o: DemoOutcome) => void }) {
  const [step, setStep] = useState<Step>("consent");
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [flash, setFlash] = useState(0);
  const [outcome, setOutcome] = useState<DemoOutcome>("verified");
  const dialog = useRef<HTMLDivElement>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setStep("consent");
      setFront(false);
      setBack(false);
      setSelfie(false);
      setOutcome("verified");
    }
  }

  useEffect(() => {
    if (!open) return;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && step !== "submitting" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, onClose]);

  const submit = (o: DemoOutcome) => {
    setOutcome(o);
    setStep("submitting");
    setTimeout(() => setStep("submitted"), 1400);
  };

  const primary = "min-h-12 w-full rounded-lg px-4 text-base font-semibold text-white transition-opacity disabled:opacity-40";
  const stepNo = { consent: 0, document: 1, selfie: 2, submitting: 3, submitted: 3 }[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Verify your identity with Stripe"
            tabIndex={-1}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-2xl bg-white font-sans text-slate-800 shadow-2xl outline-none sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-white" style={{ background: STRIPE }}>
                  S
                </span>
                Stripe Identity
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">Demo</span>
              </span>
              {step !== "submitting" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex gap-1 px-5 pt-4" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < stepNo ? STRIPE : "#E2E8F0" }} />
              ))}
            </div>

            <div className="px-5 pb-6 pt-5">
              {step === "consent" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold">Gatherly.pub uses Stripe to verify your identity</h2>
                  <ul className="flex flex-col gap-2 text-sm text-slate-600">
                    <li>🪪 A photo of your driver&apos;s license, front and back</li>
                    <li>🤳 A selfie, matched to the photo on your license</li>
                    <li>⏱️ About 2 minutes</li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    Stripe processes your images to confirm they match. Gatherly.pub receives the result and whether you&apos;re 18+, not your photos.
                  </p>
                  <button type="button" className={primary} style={{ background: STRIPE }} onClick={() => setStep("document")}>
                    Agree and continue
                  </button>
                </div>
              )}

              {step === "document" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold">Upload your driver&apos;s license</h2>
                  <p className="text-sm text-slate-600">Make sure all four corners are visible and nothing is blurry.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Card label="Front" done={front} onClick={() => setFront(true)} />
                    <Card label="Back" done={back} onClick={() => setBack(true)} />
                  </div>
                  <button type="button" className={primary} style={{ background: STRIPE }} disabled={!front || !back} onClick={() => setStep("selfie")}>
                    Continue
                  </button>
                </div>
              )}

              {step === "selfie" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold">Take a selfie</h2>
                  <p className="text-sm text-slate-600">Center your face in the oval. Take off hats or sunglasses.</p>
                  <div className="relative mx-auto flex h-56 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-800">
                    <div
                      className={clsx(
                        "flex h-44 w-32 items-center justify-center rounded-[50%] border-4",
                        selfie ? "border-emerald-400" : "border-white/70 border-dashed",
                      )}
                    >
                      <span className={clsx("text-5xl", selfie && "font-bold text-emerald-400")} aria-hidden>
                        {selfie ? "✓" : "🙂"}
                      </span>
                    </div>
                    {flash > 0 && (
                      <motion.span
                        key={flash}
                        className="absolute inset-0 bg-white"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        aria-hidden
                      />
                    )}
                  </div>
                  {selfie ? (
                    <button type="button" className={primary} style={{ background: STRIPE }} onClick={() => submit("verified")}>
                      Submit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={primary}
                      style={{ background: STRIPE }}
                      onClick={() => {
                        setFlash((f) => f + 1);
                        setSelfie(true);
                      }}
                    >
                      Take selfie
                    </button>
                  )}
                  {selfie && (
                    <button type="button" onClick={() => submit("unreadable")} className="text-center text-xs text-slate-500 underline">
                      Demo: simulate a check that fails
                    </button>
                  )}
                </div>
              )}

              {(step === "submitting" || step === "submitted") && (
                <div className="flex flex-col items-center gap-4 py-6 text-center" role="status">
                  {step === "submitting" ? (
                    <>
                      <motion.span
                        className="h-10 w-10 rounded-full border-4 border-slate-200"
                        style={{ borderTopColor: STRIPE }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        aria-hidden
                      />
                      <p className="font-semibold">Uploading securely…</p>
                    </>
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white" style={{ background: STRIPE }} aria-hidden>
                        ✓
                      </span>
                      <h2 className="text-xl font-semibold">Thanks, you&apos;re all set</h2>
                      <p className="text-sm text-slate-600">We&apos;ll send the result to Gatherly.pub. You can head back now.</p>
                      <button type="button" className={primary} style={{ background: STRIPE }} onClick={() => onSubmitted(outcome)}>
                        Return to Gatherly.pub
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
