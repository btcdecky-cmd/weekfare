import { Barcode } from "@/components/barcode";
import {
  longDate,
  passengerLine,
  type FlightLeg,
  type Trip,
} from "@/lib/trip";
import { cn } from "@/lib/utils";

function Field({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <div className="text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm font-medium tracking-wide text-ink tabular-nums">
        {value}
      </div>
    </div>
  );
}

export function BoardingPass({
  trip,
  leg,
  direction,
}: {
  trip: Trip;
  leg: FlightLeg;
  direction: "Outbound" | "Return";
}) {
  return (
    <article
      className={cn(
        "print-sheet relative overflow-hidden rounded-xl bg-paper text-ink shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]",
      )}
    >
      <header className="flex items-center justify-between bg-ink px-5 py-3.5 text-paper">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-semibold tracking-[0.22em] uppercase">
            {trip.airline}
          </span>
          <span className="hidden text-[10px] tracking-[0.16em] text-paper/70 uppercase sm:inline">
            {direction}
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
          Boarding pass
        </span>
      </header>

      <div className="grid gap-0 md:grid-cols-[1fr_11rem]">
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Passenger" value={passengerLine(trip)} />
            <Field label="PNR" value={trip.pnr} />
            <Field label="Ticket" value={trip.ticketNumber} />
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <div className="font-display text-5xl leading-none font-semibold tracking-tight">
                {leg.fromCode}
              </div>
              <div className="mt-2 text-xs text-ink-muted">{leg.fromAirport}</div>
              <div className="text-xs text-ink-muted">{leg.fromCity}</div>
            </div>
            <div className="mb-6 flex min-w-16 flex-col items-center">
              <span className="font-mono text-[10px] tracking-[0.14em] text-ink-muted">
                {leg.number}
              </span>
              <span className="mt-1 block h-px w-full bg-ink" />
            </div>
            <div className="text-right">
              <div className="font-display text-5xl leading-none font-semibold tracking-tight">
                {leg.toCode}
              </div>
              <div className="mt-2 text-xs text-ink-muted">{leg.toAirport}</div>
              <div className="text-xs text-ink-muted">{leg.toCity}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-rule pt-4 sm:grid-cols-6">
            <Field label="Date" value={longDate(leg.date)} />
            <Field label="Depart" value={leg.depart} />
            <Field label="Arrive" value={leg.arrive} />
            <Field label="Gate" value={leg.gate} />
            <Field label="Seat" value={leg.seat} />
            <Field label="Seq" value={leg.seq} />
          </div>
        </div>

        <aside className="relative border-t border-dashed border-ink/25 bg-paper-2 px-4 py-5 md:border-t-0 md:border-l">
          <div className="text-center text-[10px] font-semibold tracking-[0.2em] text-ink uppercase">
            {trip.airline}
          </div>
          <div className="mt-3 text-center font-display text-2xl font-semibold tracking-tight">
            {leg.fromCode} {leg.toCode}
          </div>
          <div className="mt-1 text-center font-mono text-xs text-ink-muted">
            {leg.number} · {leg.seat}
          </div>
          <div className="mt-1 text-center text-xs text-ink-muted">
            {longDate(leg.date)} {leg.depart}
          </div>
          <Barcode value={`${trip.pnr}${leg.number}${leg.seat}`} className="mt-4 h-12" />
          <div className="mt-2 text-center font-mono text-[11px] tracking-[0.14em] text-ink">
            {trip.pnr}
          </div>
          <div className="mt-4 text-center text-[10px] tracking-[0.14em] text-ink-muted uppercase">
            Sample record
          </div>
        </aside>
      </div>
    </article>
  );
}
