"use client";

import { DinnerScene } from "@/components/dinner/DinnerScene";
import { Button } from "@/components/ui/Button";

/** Nothing matches the filters at all: offer to start that table, or loosen the filters. */
export function EmptyTables({ onStart, onClear }: { onStart?: () => void; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border-[2.5px] border-dashed border-ink bg-white/70 px-4 pb-8 pt-2 text-center">
      <div className="w-full max-w-md">
        <DinnerScene present={[]} seatLabel="First seat" onSeatClick={onStart} />
      </div>
      <h2 className="mt-4 text-3xl">No tables here yet.</h2>
      <p className="mt-2 max-w-sm text-ink-soft">Nothing matches these filters. Loosen one, or start a table on a night that has none open.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onStart && (
          <Button onClick={onStart} arrow>
            Start a table
          </Button>
        )}
        <Button variant={onStart ? "paper" : "primary"} onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}
