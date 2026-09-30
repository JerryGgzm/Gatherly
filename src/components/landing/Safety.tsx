const ITEMS = [
  { icon: "📱", title: "Phone verified", copy: "Every guest confirms a real phone number." },
  { icon: "🔞", title: "18+ only", copy: "Checked against their ID, not just a checkbox." },
  { icon: "🪪", title: "ID verified", copy: "Every guest matches a government ID to a selfie, via Stripe. Never shown to anyone." },
  { icon: "🏙️", title: "Public venues", copy: "Always a real restaurant. Never a private address." },
  { icon: "🛡️", title: "Report & block", copy: "Report anyone, anytime. Never get matched with them again." },
];

export function Safety() {
  return (
    <section className="border-b-[2.5px] border-ink bg-[#EEF3FF] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-blue">Safety</p>
        <h2 className="mt-1 max-w-2xl text-4xl sm:text-5xl">Strangers, not unknowns.</h2>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Everyone at the table has gone through the same checks. We keep an eye on things so dinner can just be dinner.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map((it) => (
            <div key={it.title} className="rounded-3xl border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_#242424]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-blue-soft text-2xl">{it.icon}</span>
              <h3 className="mt-4 text-xl">{it.title}</h3>
              <p className="mt-1 text-ink-soft">{it.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
