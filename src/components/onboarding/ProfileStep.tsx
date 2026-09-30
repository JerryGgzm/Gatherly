"use client";

import { useState } from "react";
import { CatFace } from "@/components/dinner/CatFace";
import { Chip } from "@/components/explore/FilterBar";
import { TextArea, TextField } from "@/components/flow/Fields";
import { FlowHeading, FlowShell, Panel } from "@/components/flow/FlowShell";
import { Button } from "@/components/ui/Button";
import { LOCATIONS } from "@/lib/data";
import type { DemoState } from "@/lib/store";
import { useStep } from "./useStep";

const GENDERS = ["Woman", "Man", "Non-binary", "Prefer not to say"];
const BIO_MAX = 140;

type Profile = DemoState["profile"];

function Preview({ p }: { p: Profile }) {
  return (
    <div className="sticky top-36 flex flex-col gap-4">
      <div className="rounded-[28px] border-[2.5px] border-ink bg-white p-5 shadow-[5px_5px_0_#242424]">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-purple">Before dinner</p>
        <p className="mt-1 text-sm text-ink-soft">Your table sees only a hint, never your name or photo.</p>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink/40 bg-cream px-4 py-3">
          <CatFace id={null} className="h-10 w-10" />
          <span className="font-display text-lg font-bold">{p.occupation || "Your background"}</span>
        </div>
      </div>
      <div className="rounded-[28px] border-[2.5px] border-ink bg-white p-5 shadow-[5px_5px_0_#242424]" style={{ rotate: "1deg" }}>
        <p className="font-display text-xs font-bold uppercase tracking-widest text-grass">After you meet</p>
        <p className="mt-1 text-sm text-ink-soft">Only people you both want to meet again see this.</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-ink bg-orange font-display text-xl font-bold text-white">
            {(p.firstName.trim()[0] ?? "?").toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold">{p.firstName || "First name"}</p>
            <p className="truncate text-sm text-ink-soft">{[p.occupation, p.neighborhood].filter(Boolean).join(" · ") || "Occupation · Neighborhood"}</p>
          </div>
        </div>
        {p.bio && <p className="mt-3 rounded-2xl bg-cream px-3 py-2 text-sm">“{p.bio}”</p>}
      </div>
    </div>
  );
}

export function ProfileStep({ next }: { next: string }) {
  const { state, finish } = useStep(next);
  const [p, setP] = useState<Profile>(state.profile);
  const [tried, setTried] = useState(false);
  const set = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));

  const age = Number(p.age);
  const errors = {
    firstName: !p.firstName.trim() && "Your first name, please.",
    age: (!p.age && "How old are you?") || ((age < 18 || age > 99) && "Gatherly is 18+."),
    occupation: !p.occupation.trim() && "A word or two is plenty.",
    neighborhood: !p.neighborhood.trim() && "Where in Seattle are you?",
  };
  const valid = Object.values(errors).every((e) => !e);
  const err = (k: keyof typeof errors) => (tried && errors[k]) || null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (valid) finish({ profile: { ...p, firstName: p.firstName.trim(), bio: p.bio.trim() } });
  };

  return (
    <FlowShell step="profile" aside={<Preview p={p} />}>
      <FlowHeading kicker="About you" title="The basics." sub="Just enough to build a good table. First names only." />
      <Panel>
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
            <TextField
              label="First name"
              autoComplete="given-name"
              value={p.firstName}
              onChange={(e) => set({ firstName: e.target.value })}
              error={err("firstName")}
            />
            <TextField
              label="Age"
              inputMode="numeric"
              value={p.age}
              onChange={(e) => set({ age: e.target.value.replace(/\D/g, "").slice(0, 2) })}
              error={err("age")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-display text-sm font-bold">Gender</span>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Chip key={g} on={p.gender === g} onClick={() => set({ gender: p.gender === g ? "" : g })}>
                  {g}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="What you do"
              placeholder="Designer, grad student…"
              value={p.occupation}
              onChange={(e) => set({ occupation: e.target.value })}
              error={err("occupation")}
            />
            <TextField
              label="Company or school"
              hint="Optional. Never shown before dinner."
              value={p.company}
              onChange={(e) => set({ company: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TextField
              label="Neighborhood"
              placeholder="Fremont, Capitol Hill…"
              value={p.neighborhood}
              onChange={(e) => set({ neighborhood: e.target.value })}
              error={err("neighborhood")}
            />
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => set({ neighborhood: l.name })}
                  className="min-h-9 rounded-full border-2 border-dashed border-ink/40 px-3 font-display text-xs font-bold hover:border-ink hover:bg-lemon-soft"
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <TextField
            label="Languages"
            value={p.languages}
            onChange={(e) => set({ languages: e.target.value })}
            hint="Comma-separated, e.g. English, Mandarin"
          />
          <TextArea
            label="Short bio"
            rows={3}
            maxLength={BIO_MAX}
            placeholder="Something that would start a good conversation."
            value={p.bio}
            onChange={(e) => set({ bio: e.target.value })}
            hint={`Optional · ${BIO_MAX - p.bio.length} characters left`}
          />
          <p className="rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">📷 You can add a profile photo later. It stays hidden until after dinner.</p>
          <div className="flex justify-end">
            <Button type="submit" arrow>
              Continue
            </Button>
          </div>
        </form>
      </Panel>
    </FlowShell>
  );
}
