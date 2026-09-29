import clsx from "clsx";
import { CatFace } from "@/components/dinner/CatFace";
import { tableCats } from "@/components/dinner/cats";
import { SEATS_PER_TABLE } from "@/lib/data";

function EmptySeat() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
      <rect x={8} y={4} width={16} height={14} rx={4} fill="#FFFFFF" stroke="#242424" strokeWidth={2} strokeDasharray="3 2.4" />
      <rect x={6} y={18} width={20} height={5} rx={2.5} fill="#FFFFFF" stroke="#242424" strokeWidth={2} strokeDasharray="3 2.4" />
      <path d="M9 23 V29 M23 23 V29" stroke="#242424" strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

/** Six seats: cats for guests already in, a lemon ticket for a seat held for you, dashed chairs for open seats. */
export function SeatRow({
  dinnerId,
  taken,
  heldForYou = false,
  size = "md",
  className,
}: {
  dinnerId: string;
  taken: number;
  heldForYou?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const cats = tableCats(dinnerId, taken);
  const dim = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <div
      className={clsx("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${taken} of ${SEATS_PER_TABLE} seats taken${heldForYou ? ", one held for you" : ""}`}
    >
      {Array.from({ length: SEATS_PER_TABLE }, (_, i) => {
        if (i < taken) return <CatFace key={i} id={cats[i] ?? null} className={dim} />;
        if (i === taken && heldForYou)
          return (
            <span key={i} className={clsx(dim, "flex items-center justify-center rounded-full border-2 border-ink bg-lemon text-[10px] shadow-[1.5px_1.5px_0_#242424]")}>
              ★
            </span>
          );
        return (
          <span key={i} className={dim}>
            <EmptySeat />
          </span>
        );
      })}
    </div>
  );
}
