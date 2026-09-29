"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { BudgetId, Dinner, LocationId, ThemeId } from "./data";
import { USER_COLOR } from "./data";

export type DinnerStage =
  | "none"
  | "matching"
  | "confirmed"
  | "revealed"
  | "room"
  | "dinner"
  | "post"
  | "done";

export type ArrivalStatus = "not-here" | "on-my-way" | "here" | "late";

export type SpiceLevel = "none" | "mild" | "medium" | "hot";

export type Booking = {
  dinnerId: string;
  themes: ThemeId[];
  areas: LocationId[];
  budget: BudgetId;
  plan: "single" | "pass";
  paid: number;
};

export type SeatHold = { dinnerId: string; heldUntil: number };

export type DemoState = {
  account: { email: string } | null;
  hold: SeatHold | null;
  waitlist: string[];
  createdTables: Dinner[];
  profile: {
    firstName: string;
    age: string;
    gender: string;
    occupation: string;
    company: string;
    neighborhood: string;
    languages: string;
    bio: string;
    color: string;
  };
  verified: { phone: boolean; adult: boolean; linkedin: boolean; terms: boolean };
  intents: string[];
  answers: Record<string, string>;
  optionalAnswers: Record<string, string>;
  dietary: { spice: SpiceLevel | null; vegetarian: boolean | null };
  onboarded: boolean;
  booking: Booking | null;
  stage: DinnerStage;
  arrival: ArrivalStatus;
  credits: number;
  hasPass: boolean;
  rating: number;
  wouldReturn: boolean | null;
  sentConnections: string[];
  neverMatch: string[];
  reports: { personId: string; reason: string }[];
  dinnersAttended: number;
  stamps: LocationId[];
};

export const INITIAL_STATE: DemoState = {
  account: null,
  hold: null,
  waitlist: [],
  createdTables: [],
  profile: {
    firstName: "",
    age: "",
    gender: "",
    occupation: "",
    company: "",
    neighborhood: "",
    languages: "English",
    bio: "",
    color: USER_COLOR,
  },
  verified: { phone: false, adult: false, linkedin: false, terms: false },
  intents: [],
  answers: {},
  optionalAnswers: {},
  dietary: { spice: null, vegetarian: null },
  onboarded: false,
  booking: null,
  stage: "none",
  arrival: "not-here",
  credits: 0,
  hasPass: false,
  rating: 0,
  wouldReturn: null,
  sentConnections: [],
  neverMatch: [],
  reports: [],
  dinnersAttended: 0,
  stamps: [],
};

const STORAGE_KEY = "gatherly-demo-v2";

type Ctx = {
  state: DemoState;
  hydrated: boolean;
  update: (patch: Partial<DemoState> | ((s: DemoState) => Partial<DemoState>)) => void;
  reset: () => void;
};

const DemoContext = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // localStorage is only readable after mount; hydrating here avoids an SSR mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState({ ...INITIAL_STATE, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback<Ctx["update"]>((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const value = useMemo(() => ({ state, hydrated, update, reset }), [state, hydrated, update, reset]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
