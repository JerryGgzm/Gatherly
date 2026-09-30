"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { resumeUrl } from "@/lib/booking";
import { useDemo, type DemoState } from "@/lib/store";
import { TextField } from "./Fields";
import { FlowHeading, FlowShell, Panel } from "./FlowShell";
import { HeldTableAside } from "./HeldTableAside";

const DEMO_CODE = "246810";

const digitsOf = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^1(?=\d{10})/, "")
    .slice(0, 10);

function formatPhone(v: string) {
  const d = digitsOf(v);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function PasswordField({
  value,
  onChange,
  error,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      label="Password"
      type={show ? "text" : "password"}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="At least 8 characters"
      error={error}
      trailing={
        <button type="button" onClick={() => setShow((s) => !s)} className="min-h-9 rounded-full px-3 font-display text-xs font-bold hover:bg-lemon-soft">
          {show ? "Hide" : "Show"}
        </button>
      }
    />
  );
}

/** Signed-in visitors skip straight to wherever they left off. */
function useSkipIfSignedIn(next: string) {
  const { state, hydrated } = useDemo();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && state.signedIn) router.replace(resumeUrl(state, next));
  }, [hydrated, state, next, router]);
}

export function SignupView({ next }: { next: string }) {
  useSkipIfSignedIn(next);
  const router = useRouter();
  const { state, update } = useDemo();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"details" | "code">("details");
  const [code, setCode] = useState("");
  const [tried, setTried] = useState(false);

  const digits = digitsOf(phone);
  const taken = !!state.account && state.account.phone === digits;
  const phoneError = tried && digits.length !== 10 ? "Enter a 10-digit US number." : taken ? "There's already an account with this number." : null;
  const passwordError = tried && password.length < 8 ? "Use at least 8 characters." : null;

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (digits.length !== 10 || password.length < 8 || taken) return;
    setStage("code");
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    const patch: Partial<DemoState> = {
      account: { phone: digits },
      signedIn: true,
      verified: { ...state.verified, phone: true },
    };
    update(patch);
    track("signup_complete", { next });
    router.push(resumeUrl({ ...state, ...patch }, next));
  };

  return (
    <FlowShell step="account" aside={<HeldTableAside />}>
      <AnimatePresence mode="wait" initial={false}>
        {stage === "details" ? (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <FlowHeading
              kicker="Take a seat"
              title="Let's save your spot."
              sub="A phone number keeps every table real. We never share it with your tablemates."
            />
            <Panel>
              <form onSubmit={sendCode} className="flex flex-col gap-5" noValidate>
                <TextField
                  label="Phone number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(206) 555-0123"
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(e.target.value)}
                  error={phoneError}
                  hint="US numbers only for now. We'll text you a code."
                />
                <PasswordField value={password} onChange={setPassword} error={passwordError} autoComplete="new-password" />
                <Button type="submit" arrow className="w-full">
                  Text me a code
                </Button>
                {taken && (
                  <Link
                    href={`/login?next=${encodeURIComponent(next)}`}
                    className="text-center font-display text-sm font-bold underline decoration-2 underline-offset-4"
                  >
                    Log in instead →
                  </Link>
                )}
              </form>
            </Panel>
            <p className="mt-5 text-center text-ink-soft">
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="font-display font-bold text-ink underline decoration-2 underline-offset-4 hover:text-orange"
              >
                Log in
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <FlowHeading kicker="Phone check" title="Check your texts." sub={`We sent a 6-digit code to ${formatPhone(phone)}.`} />
            <Panel>
              <form onSubmit={verify} className="flex flex-col gap-5">
                <TextField
                  label="6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  hint={
                    <>
                      Demo: any 6 digits work.{" "}
                      <button type="button" className="font-bold text-ink underline" onClick={() => setCode(DEMO_CODE)}>
                        Fill {DEMO_CODE}
                      </button>
                    </>
                  }
                />
                <Button type="submit" arrow className="w-full" disabled={code.length !== 6}>
                  Verify & continue
                </Button>
                <div className="flex justify-between font-display text-sm font-bold">
                  <button type="button" onClick={() => setStage("details")} className="min-h-11 underline decoration-2 underline-offset-4">
                    ← Change number
                  </button>
                  <button type="button" onClick={() => setCode("")} className="min-h-11 text-ink-soft underline decoration-2 underline-offset-4">
                    Resend code
                  </button>
                </div>
              </form>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </FlowShell>
  );
}

export function LoginView({ next }: { next: string }) {
  useSkipIfSignedIn(next);
  const router = useRouter();
  const { state, update } = useDemo();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = digitsOf(phone);
    if (!state.account || state.account.phone !== digits || password.length < 8) {
      setError("That didn't go through. Check the number and password, or sign up.");
      return;
    }
    update({ signedIn: true });
    router.push(resumeUrl({ ...state, signedIn: true }, next));
  };

  return (
    <FlowShell aside={<HeldTableAside />}>
      <FlowHeading kicker="Welcome back" title="Pull up a chair." sub="Log in and we'll pick up right where you left off." />
      <Panel>
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <TextField
            label="Phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(206) 555-0123"
            value={formatPhone(phone)}
            onChange={(e) => {
              setPhone(e.target.value);
              setError(null);
            }}
          />
          <PasswordField
            value={password}
            onChange={(v) => {
              setPassword(v);
              setError(null);
            }}
            autoComplete="current-password"
          />
          {error && (
            <p className="rounded-2xl border-2 border-ink bg-lemon-soft px-4 py-3 text-sm font-semibold" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" arrow className="w-full">
            Log in
          </Button>
        </form>
      </Panel>
      <p className="mt-5 text-center text-ink-soft">
        New here?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-display font-bold text-ink underline decoration-2 underline-offset-4 hover:text-orange"
        >
          Create an account
        </Link>
      </p>
    </FlowShell>
  );
}
