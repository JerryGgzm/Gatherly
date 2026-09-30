"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { track } from "./analytics";
import { DINNERS, NIGHTS, QUESTIONS, SEATS_PER_TABLE, nightKey, type BudgetId, type Dinner, type LocationId, type Night, type ThemeId } from "./data";
import { useDemo, type DemoState, type SeatHold } from "./store";

export const HOLD_MS = 30 * 60 * 1000;

export type OnboardingStep = "verify" | "profile" | "intent" | "questionnaire" | "dietary";

const STEP_DONE: Record<OnboardingStep, (s: DemoState) => boolean> = {
  verify: (s) => s.verified.phone && s.verified.identity?.status === "verified" && s.verified.identity.over18 && s.verified.terms,
  profile: (s) => s.profile.firstName.trim().length > 0,
  intent: (s) => s.intents.length > 0,
  questionnaire: (s) => QUESTIONS.every((q) => s.answers[q.id]),
  dietary: (s) => s.dietary.spice !== null && s.dietary.vegetarian !== null,
};

export const ONBOARDING_STEPS = Object.keys(STEP_DONE) as OnboardingStep[];

export const missingSteps = (s: DemoState) => ONBOARDING_STEPS.filter((step) => !STEP_DONE[step](s));

export const isOnboarded = (s: DemoState) => s.onboarded || missingSteps(s).length === 0;

const withNext = (path: string, next: string) => `${path}?next=${encodeURIComponent(next)}`;

/** After any auth or onboarding step: the first step still missing, else `next`. */
export function resumeUrl(s: DemoState, next: string) {
  if (!s.account) return withNext("/signup", next);
  if (!s.signedIn) return withNext("/login", next);
  const missing = missingSteps(s);
  return missing.length ? withNext(`/onboarding/${missing[0]}`, next) : next;
}

/** Where "Take a seat" leads: signup / login when signed out, the first missing onboarding step, or straight to booking. */
export const seatDestination = (s: DemoState, dinnerId: string) => resumeUrl(s, `/book/${dinnerId}`);

export const holdActive = (hold: SeatHold | null, now: number | null): hold is SeatHold => !!hold && now !== null && hold.heldUntil > now;

/** Seats still open. An active hold or the user's own booking takes one seat off the table. */
export function seatsLeft(d: Dinner, hold: SeatHold | null, now: number | null, bookedId?: string | null) {
  const held = (holdActive(hold, now) && hold.dinnerId === d.id) || bookedId === d.id ? 1 : 0;
  return Math.max(0, SEATS_PER_TABLE - d.seatsTaken - held);
}

export const bookedId = (s: DemoState) => s.booking?.dinnerId ?? null;

export const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

/** Wall-clock time, refreshed every `ms`. `null` until mounted so SSR and hydration agree. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, ms);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [ms]);
  return now;
}

const clock = () => Date.now();

const nightOrder = (d: Pick<Dinner, "month" | "day">) => NIGHTS.findIndex((n) => nightKey(n) === nightKey(d));

/** Seeded dinners plus any tables the user started, in night order. */
export function useDinners() {
  const { state } = useDemo();
  return useMemo(() => [...DINNERS, ...state.createdTables].sort((a, b) => nightOrder(a) - nightOrder(b)), [state.createdTables]);
}

export const findDinner = (s: DemoState, id: string) => DINNERS.find((d) => d.id === id) ?? s.createdTables.find((d) => d.id === id);

export type TableSpec = { night: Night; area: LocationId; themes: ThemeId[]; budget: BudgetId };

/**
 * An existing table that still has room for this spec: same night, area and budget, sharing at least one theme.
 * A new table may only be started when there is none (no such table, or every such table is full).
 */
export function openMatch(dinners: Dinner[], spec: TableSpec, hold: SeatHold | null, now: number | null) {
  const heldId = holdActive(hold, now) ? hold.dinnerId : null;
  return dinners.find(
    (d) =>
      nightKey(d) === nightKey(spec.night) &&
      d.location === spec.area &&
      d.budget === spec.budget &&
      d.themes.some((t) => spec.themes.includes(t)) &&
      (d.id === heldId || seatsLeft(d, hold, now) > 0),
  );
}

export function useStartTable() {
  const { state, update } = useDemo();
  const dinners = useDinners();
  return useCallback(
    (spec: TableSpec): Dinner | null => {
      if (spec.themes.length === 0 || openMatch(dinners, spec, state.hold, clock())) return null;
      const d: Dinner = {
        id: `new-${nightKey(spec.night).toLowerCase()}-${spec.area}-${clock().toString(36)}`,
        ...spec.night,
        location: spec.area,
        themes: spec.themes,
        budget: spec.budget,
        seatsTaken: 0,
        created: true,
      };
      update((s) => ({ createdTables: [...s.createdTables, d] }));
      track("explore_start_table", { night: nightKey(spec.night), area: spec.area, themes: spec.themes.join(","), budget: spec.budget });
      return d;
    },
    [dinners, state.hold, update],
  );
}

export function useTakeSeat() {
  const { state, update } = useDemo();
  const router = useRouter();

  /** Records the hold (if the user still has to sign up / onboard) and returns where to go next. */
  const reserve = useCallback(
    (d: Dinner) => {
      const dest = seatDestination(state, d.id);
      const needsHold = !isOnboarded(state) || !state.signedIn;
      const now = clock();
      if (needsHold && !(state.hold?.dinnerId === d.id && state.hold.heldUntil > now)) {
        update({ hold: { dinnerId: d.id, heldUntil: now + HOLD_MS } });
      }
      track("explore_take_seat", { dinner_id: d.id, logged_in: state.signedIn, onboarded: isOnboarded(state) });
      return dest;
    },
    [state, update],
  );

  const go = useCallback((d: Dinner) => router.push(reserve(d)), [reserve, router]);

  const toggleWaitlist = useCallback(
    (d: Dinner) => {
      const on = !state.waitlist.includes(d.id);
      update({ waitlist: on ? [...state.waitlist, d.id] : state.waitlist.filter((id) => id !== d.id) });
      track("explore_waitlist_toggle", { dinner_id: d.id, on });
    },
    [state.waitlist, update],
  );

  return { reserve, go, toggleWaitlist, destination: (d: Dinner) => seatDestination(state, d.id) };
}
