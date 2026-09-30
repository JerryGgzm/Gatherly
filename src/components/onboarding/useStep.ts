"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { missingSteps, resumeUrl } from "@/lib/booking";
import { useDemo, type DemoState } from "@/lib/store";

/** Guards an onboarding step (signed-in only) and moves on to the next missing step, or `next` when everything is done. */
export function useStep(next: string) {
  const router = useRouter();
  const { state, hydrated, update } = useDemo();

  useEffect(() => {
    if (hydrated && !state.signedIn) router.replace(resumeUrl(state, next));
  }, [hydrated, state, next, router]);

  const finish = (patch: Partial<DemoState>) => {
    const after = { ...state, ...patch };
    const done = missingSteps(after).length === 0;
    update(done ? { ...patch, onboarded: true } : patch);
    if (done && !state.onboarded) track("onboarding_complete", { next });
    router.push(resumeUrl({ ...after, onboarded: done }, next));
  };

  return { state, hydrated, update, finish };
}
