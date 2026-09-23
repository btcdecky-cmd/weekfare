import { format, parseISO } from "date-fns";
import { Barcode } from "@/components/barcode";
import { moneyPlain, passengerPlain, tripTotals, type Trip } from "@/lib/trip";

export function PaymentReceipt({ trip }: { trip: Trip }) {
  const totals = tripTotals(trip);
  const issued = format(parseISO(trip.issuedAt), "d MMM yyyy · HH:mm");

  return (
    <article className="print-sheet mx-auto max-w-md overflow-hidden rounded-xl bg-paper text-ink shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
      <header className="bg-ink px-6 py-6 text-paper">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.22em] uppercase">Weekfare</div>
            <div className="mt-1 font-display text-2xl font-semibold">Payment receipt</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs tracking-wide">{trip.receiptNumber}</div>
            <div className="mt-1 text-[10px] font-semibold tracking-[0.16em] uppercase">
              Settled
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        <p className="text-[11px] font-medium tracking-[0.12em] text-ink-muted uppercase">
          Issued {issued} WAT
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-[10px] tracking-[0.16em] text-ink-muted uppercase">Payer</dt>
            <dd className="mt-1 text-sm font-medium">{passengerPlain(trip)}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-[0.16em] text-ink-muted uppercase">PNR</dt>
            <dd className="mt-1 font-mono text-sm">{trip.pnr}</dd>
          </div>
        </dl>

        <div className="mt-6 h-px bg-rule" />

        <Line
          title={`${trip.airline} ${trip.outbound.number} / ${trip.inbound.number}`}
          detail={`${trip.outbound.fromCode} ↔ ${trip.outbound.toCode} roundtrip`}
          amount={moneyPlain(totals.flight)}
        />
        <Line
          title={trip.hotelName}
          detail={`${trip.roomType} · ${totals.hotel.nights} nights`}
          amount={moneyPlain(totals.hotel.total)}
        />
        <Line title="Service fee" detail="Document issuance" amount={moneyPlain(totals.service)} />

        <div className="mt-2 h-px bg-ink" />
        <div className="mt-4">
          <div className="text-[10px] font-medium tracking-[0.16em] text-ink-muted uppercase">
            Amount charged
          </div>
          <div className="mt-1 font-display text-3xl font-semibold tabular-nums">
            USD {moneyPlain(totals.total)}
          </div>
        </div>

        <p className="mt-4 text-sm text-ink-muted">
          Visa ending {trip.cardLast4}
          <span className="mx-2">·</span>
          Auth {trip.authCode}
        </p>

        <div className="mt-5 inline-flex rounded-sm bg-forest px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-forest-fg uppercase">
          Paid
        </div>

        <Barcode value={trip.receiptNumber + trip.pnr} className="mt-6 h-10" />
        <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
          Keep with boarding pass and hotel folio. Weekfare sample itinerary record — not a bank
          or card-network statement.
        </p>
      </div>
    </article>
  );
}

function Line({
  title,
  detail,
  amount,
}: {
  title: string;
  detail: string;
  amount: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-0.5 text-xs text-ink-muted">{detail}</div>
      </div>
      <div className="font-mono text-sm tabular-nums">{amount}</div>
    </div>
  );
}
