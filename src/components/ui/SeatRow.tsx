import clsx from "clsx";
import { PERSONAS } from "@/lib/data";

export function SeatRow({ taken, total = 6, className }: { taken: number; total?: number; className?: string }) {
  return (
    <div className={clsx("flex items-center gap-1", className)} aria-label={`${taken} of ${total} seats taken`}>
      {Array.from({ length: total }, (_, i) => {
        const filled = i < taken;
        return (
          <span
            key={i}
            className={clsx("h-5 w-5 rounded-full border-2 border-ink", filled ? "shadow-[1.5px_1.5px_0_#242424]" : "border-dashed bg-white")}
            style={filled ? { background: PERSONAS[i % PERSONAS.length].color } : undefined}
          />
        );
      })}
    </div>
  );
}
