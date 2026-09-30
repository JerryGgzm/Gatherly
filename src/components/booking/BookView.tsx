"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CelebrationScene } from "@/components/dinner/CelebrationScene";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { tableCats } from "@/components/dinner/cats";
import { Chip } from "@/components/explore/FilterBar";
import { MAX_THEMES } from "@/components/explore/filters";
import { TextField } from "@/components/flow/Fields";
import { FlowHeading, FlowShell, Panel } from "@/components/flow/FlowShell";
import { Button } from "@/components/ui/Button";
import { GatherlyPass } from "@/components/ui/GatherlyPass";
import { track } from "@/lib/analytics";
import { findDinner, holdActive, resumeUrl, seatsLeft, useNow } from "@/lib/booking";
import { LOCATIONS, THEMES, budgetById, dinnerStub, locationById, nightKey, type Dinner, type LocationId, type ThemeId } from "@/lib/data";
import { useDemo, type Booking } from "@/lib/store";

const FEE = 15;
const PASS = 30;
const DEMO_CARD = "4242 4242 4242 4242";

const exploreLike = (d: Dinner) => `/explore?night=${nightKey(d)}&area=${d.location}&themes=${d.themes.join(",")}&budget=${d.budget}`;

function TableAside({ dinner }: { dinner: Dinner }) {
  const loc = locationById(dinner.location);
  return (
    <div className="sticky top-36 overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-cream-deep shadow-[5px_5px_0_#242424]">
      <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-white px-4 py-3">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest" style={{ color: loc.accent }}>
            Your table
          </p>
          <p className="font-display text-lg font-bold">{dinnerStub(dinner)}</p>
        </div>
        <span className="rounded-full bg-ink px-2.5 py-0.5 font-display text-xs font-bold text-cream">7:00 PM</span>
      </div>
      <DinnerScene present={tableCats(dinner.id, dinner.seatsTaken)} seatLabel="Your seat" />
      <p className="border-t-[2.5px] border-ink bg-white px-4 py-3 text-sm text-ink-soft">
        The restaurant stays a surprise until the day before. You&apos;ll know it&apos;s in {loc.name}, around {budgetById(dinner.budget).range} a person.
      </p>
    </div>
  );
}

function Notice({ tone, children }: { tone: "calm" | "warn"; children: React.ReactNode }) {
  return (
    <div className={clsx("mb-6 rounded-2xl border-[2.5px] border-ink px-4 py-3 text-sm", tone === "calm" ? "bg-lemon-soft" : "bg-orange-soft")} role="status">
      {children}
    </div>
  );
}

function Done({ dinner, booking }: { dinner: Dinner; booking: Booking }) {
  const loc = locationById(dinner.location);
  return (
    <FlowShell>
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-grass">Booked</p>
            <h1 className="mt-1 text-5xl sm:text-6xl">You&apos;re in.</h1>
            <p className="mt-2 text-lg text-ink-soft">Your seat is saved.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="w-2/3 shrink-0 overflow-hidden rounded-[22px] border-[2.5px] border-ink shadow-[4px_4px_0_#242424] sm:w-1/2"
          >
            <CelebrationScene />
          </motion.div>
        </div>
        <Panel className="mt-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["When", `${dinner.dayLabel}, ${dinner.month.charAt(0)}${dinner.month.slice(1).toLowerCase()} ${dinner.day} · 7:00 PM`],
              ["Where", `Somewhere in ${loc.name}`],
              ["Vibe", booking.themes.map((t) => THEMES.find((x) => x.id === t)!.label).join(", ")],
              ["Paid", booking.plan === "pass" ? "Gatherly Pass" : booking.paid === 0 ? "Covered by credit" : `$${booking.paid}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">{k}</dt>
                <dd className="font-display text-lg font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
            The restaurant stays a surprise until the day before, around {budgetById(dinner.budget).range} a person.
          </p>
        </Panel>
        <Panel className="mt-6">
          <h2 className="text-2xl">What happens next</h2>
          <ol className="mt-4 space-y-3">
            {[
              ["🧩", "We finish building your table", "Five more people, matched on your answers."],
              ["📬", "The day before", "We text you the restaurant and your table's hints."],
              ["🍽️", "7:00 PM", "Show up, say hi, split the bill. Earn $5 credit for showing up."],
            ].map(([icon, t, s]) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lemon-soft text-lg">{icon}</span>
                <span>
                  <span className="block font-display font-bold">{t}</span>
                  <span className="text-sm text-ink-soft">{s}</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/explore" variant="paper">
            Back to tables
          </Button>
        </div>
      </div>
    </FlowShell>
  );
}

export function BookView({ id }: { id: string }) {
  const router = useRouter();
  const { state, hydrated, update } = useDemo();
  const now = useNow();
  const dinner = findDinner(state, id);
  const path = `/book/${id}`;
  const gate = resumeUrl(state, path);
  const booked = state.booking?.dinnerId === id ? state.booking : null;

  useEffect(() => {
    if (hydrated && dinner && !booked && gate !== path) router.replace(gate);
  }, [hydrated, dinner, booked, gate, path, router]);

  if (!hydrated || (dinner && !booked && gate !== path)) return <div className="dotted-bg flex-1" />;

  if (!dinner) {
    return (
      <FlowShell>
        <FlowHeading title="This table isn't here." sub="It may have been a table you started in another browser." />
        <Button href="/explore" arrow>
          Pick a night
        </Button>
      </FlowShell>
    );
  }

  if (booked) return <Done dinner={dinner} booking={booked} />;
  return <CheckoutForm key={id} dinner={dinner} now={now} state={state} update={update} />;
}

function CheckoutForm({
  dinner,
  now,
  state,
  update,
}: {
  dinner: Dinner;
  now: number | null;
  state: ReturnType<typeof useDemo>["state"];
  update: ReturnType<typeof useDemo>["update"];
}) {
  const loc = locationById(dinner.location);
  const budget = budgetById(dinner.budget);
  const [areas, setAreas] = useState<LocationId[]>([dinner.location]);
  const [themes, setThemes] = useState<ThemeId[]>(dinner.themes.slice(0, MAX_THEMES));
  const [plan, setPlan] = useState<Booking["plan"]>(state.hasPass ? "pass" : "single");
  const [card, setCard] = useState({ number: DEMO_CARD, exp: "12/28", cvc: "123" });
  const [paying, setPaying] = useState(false);

  const mine = state.hold?.dinnerId === dinner.id;
  const heldForYou = mine && holdActive(state.hold, now);
  const open = heldForYou || seatsLeft(dinner, state.hold, now) > 0;
  const holdEnded = mine && now !== null && !heldForYou;
  const other = state.booking && state.booking.dinnerId !== dinner.id ? findDinner(state, state.booking.dinnerId) : undefined;

  const credit = Math.min(state.credits, FEE);
  const single = FEE - credit;
  const total = state.hasPass ? 0 : plan === "pass" ? PASS : single;
  const needsCard = total > 0;
  const cardOk = card.number.replace(/\D/g, "").length === 16 && /^\d\d\/\d\d$/.test(card.exp) && /^\d{3,4}$/.test(card.cvc);
  const ready = open && themes.length > 0 && (!needsCard || cardOk) && !paying;

  const toggleArea = (a: LocationId) => a !== dinner.location && setAreas((x) => (x.includes(a) ? x.filter((y) => y !== a) : [...x, a]));
  const toggleTheme = (t: ThemeId) => setThemes((x) => (x.includes(t) ? (x.length > 1 ? x.filter((y) => y !== t) : x) : x.length < MAX_THEMES ? [...x, t] : x));

  const pay = () => {
    if (!ready) return;
    setPaying(true);
    setTimeout(() => {
      const passNow = plan === "pass" || state.hasPass;
      update((s) => ({
        booking: { dinnerId: dinner.id, themes, areas, budget: dinner.budget, plan: passNow ? "pass" : "single", paid: total },
        stage: "matching",
        hold: null,
        hasPass: passNow,
        credits: passNow ? s.credits : s.credits - credit,
      }));
      track("book_confirm", { dinner_id: dinner.id, plan, paid: total, held: heldForYou });
    }, 900);
  };

  if (!open) {
    return (
      <FlowShell aside={<TableAside dinner={dinner} />}>
        <FlowHeading
          kicker={dinnerStub(dinner)}
          title="This table filled up."
          sub="Your hold ended and the last seat went to someone else. Your answers are saved, so the next one takes a click."
        />
        <Panel>
          <p className="text-ink-soft">Here are tables like this one, same night and neighborhood first.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={exploreLike(dinner)} arrow>
              See similar tables
            </Button>
            <Button href="/explore" variant="paper">
              All nights
            </Button>
          </div>
        </Panel>
      </FlowShell>
    );
  }

  return (
    <FlowShell aside={<TableAside dinner={dinner} />}>
      <FlowHeading kicker="Almost there" title="Save your seat." sub={`${dinnerStub(dinner)} · 7:00 PM`} />

      {holdEnded && (
        <Notice tone="calm">
          <strong className="font-display">Good news: the seat is still free.</strong> Your hold ended, but nobody took it. Book now and it&apos;s yours.
        </Notice>
      )}
      {other && (
        <Notice tone="warn">
          You&apos;re already booked for <strong className="font-display">{dinnerStub(other)}</strong>. Booking this one replaces it.
        </Notice>
      )}

      <div className="flex flex-col gap-6">
        <Panel>
          <h2 className="text-2xl">Your table</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Night", `${dinner.dayLabel} · ${dinner.month.charAt(0)}${dinner.month.slice(1).toLowerCase()} ${dinner.day}`],
              ["Area", loc.name],
              ["Budget", `${budget.label} · ${budget.range}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border-2 border-ink bg-cream px-3 py-2">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">🔒 {k}</p>
                <p className="font-display font-bold">{v}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-display text-lg font-bold">Vibes you&apos;re up for</h3>
          <p className="text-sm text-ink-soft">Up to {MAX_THEMES}. Helps us seat you with people who&apos;ll want the same conversation.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <Chip key={t.id} on={themes.includes(t.id)} color={t.color} onClick={() => toggleTheme(t.id)}>
                {t.icon} {t.label}
              </Chip>
            ))}
          </div>

          <h3 className="mt-6 font-display text-lg font-bold">Also happy in</h3>
          <p className="text-sm text-ink-soft">If this table has to move, we&apos;ll look here first. Optional.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LOCATIONS.map((l) => (
              <Chip key={l.id} on={areas.includes(l.id)} color={l.accent} onClick={() => toggleArea(l.id)}>
                {l.id === dinner.location ? "🔒 " : ""}
                {l.name}
              </Chip>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-2xl">Booking fee</h2>
          {state.hasPass ? (
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <GatherlyPass name={state.profile.firstName} active className="w-full max-w-xs" />
              <p className="font-display text-lg font-bold">Covered by your Pass. Nothing to pay.</p>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Plan">
                {(
                  [
                    ["single", "One seat", single === 0 ? "Free" : `$${single}`, credit ? `$${FEE} − $${credit} credit` : "This dinner only"],
                    ["pass", "Gatherly Pass", `$${PASS}/mo`, "Unlimited dinners this month"],
                  ] as const
                ).map(([id, label, price, sub]) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={plan === id}
                    onClick={() => setPlan(id)}
                    className={clsx(
                      "flex flex-col items-start rounded-[22px] border-[2.5px] border-ink p-4 text-left transition-shadow",
                      plan === id
                        ? (id === "pass" ? "bg-ink text-cream" : "bg-lemon-soft") + " shadow-[5px_5px_0_#242424]"
                        : "bg-white shadow-[3px_3px_0_#242424] hover:shadow-[5px_5px_0_#242424]",
                    )}
                  >
                    <span className="font-display text-sm font-bold uppercase tracking-widest opacity-70">{label}</span>
                    <span className="font-display text-3xl font-bold">{price}</span>
                    <span className="text-sm opacity-80">{sub}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence initial={false}>
                {needsCard && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_110px_90px]">
                      <TextField
                        label="Card number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={card.number}
                        onChange={(e) =>
                          setCard((c) => ({
                            ...c,
                            number: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16)
                              .replace(/(\d{4})(?=\d)/g, "$1 "),
                          }))
                        }
                      />
                      <TextField
                        label="Expiry"
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                        value={card.exp}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setCard((c) => ({ ...c, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                        }}
                      />
                      <TextField
                        label="CVC"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={card.cvc}
                        onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      />
                    </div>
                    <p className="mt-2 text-xs text-ink-soft">Demo only. No card is charged.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          <p className="mt-5 rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
            🧾 Platform fee ≠ food cost. The restaurant bill is split at the table. If your table doesn&apos;t fill by the day before, you get a full refund.
          </p>
        </Panel>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-between gap-4 border-t-[2.5px] border-ink bg-cream px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">Due today</p>
          <p className="font-display text-2xl font-bold">${total}</p>
        </div>
        <Button arrow disabled={!ready} onClick={pay}>
          {paying ? "Saving your seat…" : total ? `Pay $${total} & book` : "Book my seat"}
        </Button>
      </div>
      <p className="mt-3 text-right text-xs text-ink-soft">
        Changed your mind?{" "}
        <Link href="/explore" className="font-bold underline">
          Back to tables
        </Link>
      </p>
    </FlowShell>
  );
}
