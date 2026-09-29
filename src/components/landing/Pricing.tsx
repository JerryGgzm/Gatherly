import { Button } from "@/components/ui/Button";
import { GatherlyPass } from "@/components/ui/GatherlyPass";

export function Pricing() {
  return (
    <section id="pricing" className="border-b-[2.5px] border-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-grass">Pricing</p>
        <h2 className="mt-1 text-4xl sm:text-5xl">Simple. Like dinner should be.</h2>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">Your booking fee covers the matching and the reservation. The food bill is split at the table.</p>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative -rotate-1 rounded-[28px] border-[2.5px] border-ink bg-[#FFFDF7] p-6 shadow-[5px_5px_0_#242424] sm:p-8">
            <span className="absolute -top-4 left-6 rotate-[-4deg] rounded-full border-2 border-ink bg-lemon px-3 py-1 font-display text-sm font-bold">One seat</span>
            <div className="flex items-end gap-2">
              <span className="font-display text-6xl font-bold">$15</span>
              <span className="pb-2 font-display text-lg text-ink-soft">/ dinner</span>
            </div>
            <ul className="mt-5 space-y-2 text-lg">
              <li>🪑 One seat at a curated table of six</li>
              <li>🍝 Restaurant picked &amp; reserved for you</li>
              <li>
                🎟️ <strong>+$5 credit</strong> every time you show up
              </li>
            </ul>
            <div className="mt-5 rounded-2xl border-2 border-dashed border-ink/40 bg-grass-soft p-3 font-display text-sm">
              Dinner #1: $15 → show up → earn $5 → Dinner #2: <strong>$10</strong>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -top-4 right-6 z-10 rotate-[4deg] rounded-full border-2 border-ink bg-orange px-3 py-1 font-display text-sm font-bold text-white">
              Best for regulars
            </span>
            <GatherlyPass className="mx-auto max-w-md rotate-1" />
            <div className="mt-6 text-center">
              <Button href="/pass" variant="dark" arrow>
                Get the Gatherly Pass
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center font-display text-sm text-ink-soft">Platform fee ≠ food cost. Restaurant bills are split among guests (AA).</p>
      </div>
    </section>
  );
}
