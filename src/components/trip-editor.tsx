import type { ReactNode } from "react";
import { nightsOf, useTrip, type FlightLeg, type Trip } from "@/lib/trip";

export function TripEditor() {
  const trip = useTrip((s) => s.trip);
  const setTrip = useTrip((s) => s.setTrip);
  const setOutbound = useTrip((s) => s.setOutbound);
  const setInbound = useTrip((s) => s.setInbound);
  const nights = nightsOf(trip);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <Section title="Passenger">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Given name"
            value={trip.givenName}
            onChange={(v) => setTrip({ givenName: v })}
          />
          <Field
            label="Family name"
            value={trip.familyName}
            onChange={(v) => setTrip({ familyName: v })}
          />
        </div>
      </Section>

      <Section title={`Outbound · ${trip.outbound.fromCode}–${trip.outbound.toCode}`}>
        <FlightFields leg={trip.outbound} onChange={setOutbound} />
      </Section>

      <Section title={`Return · ${trip.inbound.fromCode}–${trip.inbound.toCode}`}>
        <FlightFields leg={trip.inbound} onChange={setInbound} />
      </Section>

      <Section title={`Hotel · ${nights} nights`}>
        <Field
          label="Property"
          value={trip.hotelName}
          onChange={(v) => setTrip({ hotelName: v })}
        />
        <Field
          label="City"
          value={trip.hotelCity}
          onChange={(v) => setTrip({ hotelCity: v })}
        />
        <Field
          label="Address"
          value={trip.hotelAddress}
          onChange={(v) => setTrip({ hotelAddress: v })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Room" value={trip.room} onChange={(v) => setTrip({ room: v })} />
          <Field
            label="Room type"
            value={trip.roomType}
            onChange={(v) => setTrip({ roomType: v })}
          />
          <Field
            label="Check-in"
            type="date"
            value={trip.checkIn}
            onChange={(v) => setTrip({ checkIn: v })}
          />
          <Field
            label="Check-out"
            type="date"
            value={trip.checkOut}
            onChange={(v) => setTrip({ checkOut: v })}
          />
          <Field
            label="Nightly rate USD"
            type="number"
            value={String(trip.nightlyRate)}
            onChange={(v) => setTrip({ nightlyRate: Number(v) || 0 })}
          />
          <Field
            label="Card last 4"
            value={trip.cardLast4}
            onChange={(v) => setTrip({ cardLast4: v.replace(/\D/g, "").slice(0, 4) })}
          />
        </div>
      </Section>

      <Section title="Fares">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Roundtrip airfare"
            type="number"
            value={String(trip.flightFare)}
            onChange={(v) => setTrip({ flightFare: Number(v) || 0 })}
          />
          <Field
            label="Service fee"
            type="number"
            value={String(trip.serviceFee)}
            onChange={(v) => setTrip({ serviceFee: Number(v) || 0 })}
          />
        </div>
      </Section>
    </form>
  );
}

function FlightFields({
  leg,
  onChange,
}: {
  leg: FlightLeg;
  onChange: (patch: Partial<FlightLeg>) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Flight" value={leg.number} onChange={(v) => onChange({ number: v })} />
        <Field label="Seat" value={leg.seat} onChange={(v) => onChange({ seat: v })} />
        <Field label="From" value={leg.fromCode} onChange={(v) => onChange({ fromCode: v.toUpperCase() })} />
        <Field label="To" value={leg.toCode} onChange={(v) => onChange({ toCode: v.toUpperCase() })} />
        <Field label="Date" type="date" value={leg.date} onChange={(v) => onChange({ date: v })} />
        <Field label="Depart" type="time" value={leg.depart} onChange={(v) => onChange({ depart: v })} />
        <Field label="Arrive" type="time" value={leg.arrive} onChange={(v) => onChange({ arrive: v })} />
        <Field label="Gate" value={leg.gate} onChange={(v) => onChange({ gate: v })} />
      </div>
      <Field
        label="Origin airport"
        value={leg.fromAirport}
        onChange={(v) => onChange({ fromAirport: v })}
      />
      <Field
        label="Destination airport"
        value={leg.toAirport}
        onChange={(v) => onChange({ toAirport: v })}
      />
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-bg-elevated p-4">
      <h2 className="mb-3 text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "date" | "time" | "number";
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium tracking-[0.08em] text-muted">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-border bg-bg-subtle px-3 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent/40 focus:ring-2 focus:ring-accent/25"
      />
    </label>
  );
}

export type { Trip };
