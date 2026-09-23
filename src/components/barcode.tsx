import { cn } from "@/lib/utils";

export function Barcode({ value, className }: { value: string; className?: string }) {
  const seed = value.replace(/\s+/g, "") || "WEEKFARE";
  const bars: number[] = [];
  for (let i = 0; i < seed.length * 6; i++) {
    bars.push(1 + ((seed.charCodeAt(i % seed.length) * 13 + i * 7) % 3));
  }
  return (
    <div
      className={cn("flex h-11 w-full items-stretch gap-px overflow-hidden", className)}
      aria-hidden="true"
    >
      {bars.map((w, i) => (
        <span
          key={i}
          className={i % 4 === 1 ? "bg-transparent" : "bg-ink"}
          style={{ width: w, minWidth: w }}
        />
      ))}
    </div>
  );
}
