import { useState } from "react";
import { Printer, RefreshCw, RotateCcw } from "lucide-react";
import { BoardingPass } from "@/components/boarding-pass";
import { HotelInvoice } from "@/components/hotel-invoice";
import { PaymentReceipt } from "@/components/payment-receipt";
import { StudioOriginals } from "@/components/studio-originals";
import { TripEditor } from "@/components/trip-editor";
import { money, nightsOf, tripTotals, useTrip } from "@/lib/trip";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "ticket", label: "Boarding pass" },
  { id: "hotel", label: "Hotel invoice" },
  { id: "receipt", label: "Payment receipt" },
  { id: "originals", label: "Studio originals" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Studio() {
  const trip = useTrip((s) => s.trip);
  const flash = useTrip((s) => s.flash);
  const regenerate = useTrip((s) => s.regenerate);
  const resetWeek = useTrip((s) => s.resetWeek);
  const [tab, setTab] = useState<TabId>("ticket");
  const [editing, setEditing] = useState(false);
  const totals = tripTotals(trip);
  const nights = nightsOf(trip);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="no-print border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
                One-week document studio
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Weekfare
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Boarding pass, hotel folio, and payment receipt for a seven-night stay.
                Edit the week, regenerate confirmation numbers, then print.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => regenerate()}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-transform duration-150 active:scale-[0.98]"
              >
                <RefreshCw className="size-4" strokeWidth={1.75} />
                Regenerate
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-bg-elevated px-4 text-sm font-medium text-fg transition-colors duration-150 hover:bg-bg-subtle"
              >
                <Printer className="size-4" strokeWidth={1.75} />
                Print
              </button>
              <button
                type="button"
                onClick={() => resetWeek()}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg"
              >
                <RotateCcw className="size-4" strokeWidth={1.75} />
                Reset week
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Nights" value={`${nights}`} />
            <Stat
              label="Route"
              value={`${trip.outbound.fromCode}–${trip.outbound.toCode}`}
            />
            <Stat label="Hotel" value={money(totals.hotel.total)} />
            <Stat label="Week total" value={money(totals.total)} />
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[20rem_1fr] lg:px-8 lg:py-8">
        <aside className="no-print">
          <button
            type="button"
            className="mb-4 flex h-11 w-full items-center justify-between rounded-md border border-border bg-bg-elevated px-4 text-sm font-medium lg:hidden"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Hide trip details" : "Edit trip details"}
          </button>
          <div className={cn("lg:block", editing ? "block" : "hidden")}>
            <TripEditor />
          </div>
        </aside>

        <div>
          <div
            className="no-print mb-5 flex gap-1 overflow-x-auto rounded-lg bg-bg-elevated p-1"
            role="tablist"
            aria-label="Documents"
          >
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "h-10 shrink-0 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                  tab === item.id
                    ? "bg-accent text-accent-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            key={flash}
            className="flex flex-col gap-6 motion-safe:animate-[fadeY_400ms_cubic-bezier(0.22,1,0.36,1)]"
          >
            {tab === "ticket" && (
              <>
                <BoardingPass trip={trip} leg={trip.outbound} direction="Outbound" />
                <BoardingPass trip={trip} leg={trip.inbound} direction="Return" />
              </>
            )}
            {tab === "hotel" && <HotelInvoice trip={trip} />}
            {tab === "receipt" && <PaymentReceipt trip={trip} />}
            {tab === "originals" && <StudioOriginals />}
          </div>

          <p className="no-print mt-6 text-xs leading-relaxed text-subtle">
            These are sample itinerary records for a one-week trip. They are not official airline
            tickets, hotel tax invoices, or bank statements.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeY {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-elevated px-4 py-3">
      <dt className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">{label}</dt>
      <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-fg">{value}</dd>
    </div>
  );
}
