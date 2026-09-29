"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { Button } from "@/components/ui/Button";
import {
  BUDGETS,
  LOCATIONS,
  NIGHTS,
  SEATS_PER_TABLE,
  THEMES,
  dinnerStub,
  locationById,
  nightKey,
  nightLabel,
  type BudgetId,
  type Dinner,
  type LocationId,
  type Night,
  type ThemeId,
} from "@/lib/data";
import type { TableSpec } from "@/lib/booking";
import { Chip } from "./FilterBar";
import { MAX_THEMES } from "./filters";

/** `lockNight`: opened from a specific night's card, so only that night can be used. */
export type StartDraft = { night: Night | null; lockNight: boolean; area: LocationId | null; themes: ThemeId[]; budget: BudgetId | null };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-display text-sm font-bold uppercase tracking-widest text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function StartTableDrawer({
  draft,
  findOpen,
  onClose,
  onStart,
  onJoin,
}: {
  draft: StartDraft | null;
  /** An existing table with open seats for this spec; if there is one, a new table can't be started. */
  findOpen: (spec: TableSpec) => Dinner | undefined;
  onClose: () => void;
  onStart: (spec: TableSpec) => void;
  onJoin: (dinner: Dinner) => void;
}) {
  const [form, setForm] = useState<StartDraft | null>(draft);
  const [prev, setPrev] = useState(draft);
  if (draft !== prev) {
    setPrev(draft);
    setForm(draft);
  }

  useEffect(() => {
    if (!draft) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, onClose]);

  const set = (patch: Partial<StartDraft>) => setForm((f) => f && { ...f, ...patch });

  const missing = form
    ? [!form.night && "a night", !form.area && "an area", form.themes.length === 0 && "a vibe", !form.budget && "a budget"].filter(Boolean)
    : [];
  const spec: TableSpec | null = form && missing.length === 0 ? { night: form.night!, area: form.area!, themes: form.themes, budget: form.budget! } : null;
  const existing = spec ? findOpen(spec) : undefined;
  const ready = !!spec && !existing;

  const submit = () => {
    if (spec && !existing) onStart(spec);
  };

  return (
    <AnimatePresence>
      {draft && form && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[60] bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Start a table"
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[88vh] max-w-4xl overflow-y-auto rounded-t-[32px] border-[2.5px] border-b-0 border-ink bg-cream p-5 pb-10 shadow-[0_-4px_0_#242424] sm:p-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-ink/30" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-widest text-orange">Start a table</p>
                <h2 className="mt-1 text-3xl sm:text-4xl">Be the first to sit down.</h2>
                <p className="mt-1 max-w-md text-ink-soft">Set the night and the vibe. We&apos;ll fill the other five seats with people worth meeting.</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink bg-white font-display text-lg font-bold shadow-[2px_2px_0_#242424]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_300px]">
              <div className="flex flex-col gap-6">
                <Field label="Night">
                  {form.lockNight && form.night ? (
                    <span className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-white px-4 font-display text-sm font-bold shadow-[3px_3px_0_#242424]">
                      🔒 {nightLabel(form.night)} · 7:00 PM
                    </span>
                  ) : (
                    NIGHTS.map((n) => (
                      <Chip
                        key={nightKey(n)}
                        on={!!form.night && nightKey(form.night) === nightKey(n)}
                        color={n.weekday === "THU" ? "#CFE0FF" : "#FFD2BF"}
                        onClick={() => set({ night: n })}
                      >
                        {nightLabel(n)}
                      </Chip>
                    ))
                  )}
                </Field>
                <Field label="Area">
                  {LOCATIONS.map((l) => (
                    <Chip key={l.id} on={form.area === l.id} color={`${l.accent}55`} onClick={() => set({ area: l.id })}>
                      <span className="h-3 w-3 rounded-full border-2 border-ink" style={{ background: l.accent }} aria-hidden />
                      {l.short}
                    </Chip>
                  ))}
                </Field>
                <Field label={`Vibes · up to ${MAX_THEMES}`}>
                  {THEMES.map((t) => {
                    const on = form.themes.includes(t.id);
                    const blocked = !on && form.themes.length >= MAX_THEMES;
                    return (
                      <Chip
                        key={t.id}
                        on={on}
                        color={`${t.color}66`}
                        className={blocked ? "opacity-50" : undefined}
                        onClick={() =>
                          !blocked &&
                          setForm(
                            (f) =>
                              f && {
                                ...f,
                                themes: f.themes.includes(t.id)
                                  ? f.themes.filter((x) => x !== t.id)
                                  : f.themes.length < MAX_THEMES
                                    ? [...f.themes, t.id]
                                    : f.themes,
                              },
                          )
                        }
                      >
                        <span aria-hidden>{t.icon}</span>
                        {t.label}
                      </Chip>
                    );
                  })}
                </Field>
                <Field label="Budget per person">
                  {BUDGETS.map((b) => (
                    <Chip key={b.id} on={form.budget === b.id} color={`${b.color}88`} onClick={() => set({ budget: b.id })}>
                      <span className="font-bold">{b.sign}</span>
                      {b.label}
                      <span className="text-ink-soft">{b.range}</span>
                    </Chip>
                  ))}
                </Field>
              </div>

              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-[24px] border-[2.5px] border-ink bg-cream-deep shadow-[4px_4px_0_#242424]">
                  <div className="border-b-[2.5px] border-ink bg-white px-4 py-2.5 font-display font-bold">
                    {form.night ? nightLabel(form.night) : "Pick a night"} · {form.area ? locationById(form.area).short : "Pick an area"}
                  </div>
                  <div className="pb-5">
                    <DinnerScene present={[]} seatLabel="First seat" bubbles={false} />
                  </div>
                </div>
                <p className="text-sm text-ink-soft">Everyone starts at 7:00 PM. If the table doesn&apos;t fill by the day before, you get a full refund.</p>
                <Button onClick={submit} arrow={!!ready} disabled={!ready} className="w-full">
                  Take the first seat
                </Button>
                {existing && (
                  <div className="rounded-[20px] border-[2.5px] border-ink bg-lemon-soft p-4" role="status">
                    <p className="font-display font-bold">There&apos;s already a table like this.</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {dinnerStub(existing)} still has {SEATS_PER_TABLE - existing.seatsTaken} open seat{SEATS_PER_TABLE - existing.seatsTaken === 1 ? "" : "s"}
                      . Join it instead, or change the area, vibe or budget.
                    </p>
                    <Button size="sm" className="mt-3" onClick={() => onJoin(existing)} arrow>
                      Take a seat there
                    </Button>
                  </div>
                )}
                {!spec && <p className="-mt-2 text-center font-display text-xs font-semibold text-ink-soft">Pick {missing.join(", ")} to continue</p>}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
