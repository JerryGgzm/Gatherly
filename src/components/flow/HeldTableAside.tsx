"use client";

import { DinnerScene } from "@/components/dinner/DinnerScene";
import { CAT_ORDER, tableCats, type CatId } from "@/components/dinner/cats";
import { findDinner, holdActive, useNow } from "@/lib/booking";
import { dinnerStub } from "@/lib/data";
import { useDemo } from "@/lib/store";

/** The held dinner's table (same cats as in /explore), or the full cast when nothing is held. */
export function HeldTableAside({ present, caption }: { present?: CatId[]; caption?: string }) {
  const { state } = useDemo();
  const now = useNow();
  const dinner = state.hold ? findDinner(state, state.hold.dinnerId) : undefined;
  const held = !!dinner && holdActive(state.hold, now);
  const cats = present ?? (dinner ? tableCats(dinner.id, dinner.seatsTaken) : CAT_ORDER);

  return (
    <div className="sticky top-36 overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-cream-deep shadow-[5px_5px_0_#242424]">
      <div className="border-b-[2.5px] border-ink bg-white px-4 py-3">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-orange">
          {dinner ? (held ? "Held for you" : "Your table") : "Tonight could be you"}
        </p>
        <p className="font-display text-lg font-bold">{dinner ? dinnerStub(dinner) : "Six seats · 7:00 PM"}</p>
      </div>
      <DinnerScene present={cats} seatLabel={held ? "Held for you" : "Your seat"} />
      <p className="border-t-[2.5px] border-ink bg-white px-4 py-3 text-sm text-ink-soft">
        {caption ?? "Who's really coming stays a surprise until dinner. The cats are just keeping the seats warm."}
      </p>
    </div>
  );
}
