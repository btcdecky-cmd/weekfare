import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { create } from "zustand";

export type FlightLeg = {
  number: string;
  fromCode: string;
  fromCity: string;
  fromAirport: string;
  toCode: string;
  toCity: string;
  toAirport: string;
  date: string;
  depart: string;
  arrive: string;
  arriveDate: string;
  gate: string;
  seat: string;
  cabin: string;
  seq: string;
};

export type Trip = {
  givenName: string;
  familyName: string;
  airline: string;
  pnr: string;
  ticketNumber: string;
  outbound: FlightLeg;
  inbound: FlightLeg;
  hotelName: string;
  hotelCity: string;
  hotelAddress: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  folio: string;
  nightlyRate: number;
  tourismPerNight: number;
  muniPerNight: number;
  vatRate: number;
  flightFare: number;
  serviceFee: number;
  receiptNumber: string;
  authCode: string;
  cardLast4: string;
  issuedAt: string;
};

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function pick(pool: string, n: number) {
  let out = "";
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < n; i++) out += pool[bytes[i]! % pool.length];
  return out;
}

function digits(n: number) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => String(b % 10)).join("");
}

export const defaultTrip = (): Trip => ({
  givenName: "Zedek",
  familyName: "Adebayo",
  airline: "Aether Air",
  pnr: "WF4829",
  ticketNumber: "2054829173641",
  outbound: {
    number: "AE 318",
    fromCode: "LOS",
    fromCity: "Lagos",
    fromAirport: "Murtala Muhammed",
    toCode: "DXB",
    toCity: "Dubai",
    toAirport: "Dubai International",
    date: "2026-09-26",
    depart: "08:40",
    arrive: "18:55",
    arriveDate: "2026-09-26",
    gate: "C7",
    seat: "14A",
    cabin: "Economy",
    seq: "043",
  },
  inbound: {
    number: "AE 319",
    fromCode: "DXB",
    fromCity: "Dubai",
    fromAirport: "Dubai International",
    toCode: "LOS",
    toCity: "Lagos",
    toAirport: "Murtala Muhammed",
    date: "2026-10-03",
    depart: "21:30",
    arrive: "04:10",
    arriveDate: "2026-10-04",
    gate: "B12",
    seat: "14A",
    cabin: "Economy",
    seq: "118",
  },
  hotelName: "Palmette Residence",
  hotelCity: "Downtown Dubai",
  hotelAddress: "Sheikh Mohammed Bin Rashid Blvd, Downtown Dubai, UAE",
  room: "1804",
  roomType: "Deluxe King",
  checkIn: "2026-09-26",
  checkOut: "2026-10-03",
  checkInTime: "15:00",
  checkOutTime: "12:00",
  folio: "INV-77421",
  nightlyRate: 350,
  tourismPerNight: 10,
  muniPerNight: 8,
  vatRate: 0.05,
  flightFare: 1184,
  serviceFee: 48,
  receiptNumber: "RCP-90318",
  authCode: "442891",
  cardLast4: "4242",
  issuedAt: "2026-09-23T14:22:00+01:00",
});

export function passengerLine(trip: Trip) {
  return `${trip.familyName.toUpperCase()} / ${trip.givenName.toUpperCase()}`;
}

export function passengerPlain(trip: Trip) {
  return `${trip.givenName} ${trip.familyName}`.trim();
}

export function nightsOf(trip: Trip) {
  const n = differenceInCalendarDays(parseISO(trip.checkOut), parseISO(trip.checkIn));
  return Math.max(1, n);
}

export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function moneyPlain(n: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function longDate(iso: string) {
  return format(parseISO(iso), "d MMM yyyy").toUpperCase();
}

export function shortDate(iso: string) {
  return format(parseISO(iso), "d MMM yyyy");
}

export function hotelTotals(trip: Trip) {
  const nights = nightsOf(trip);
  const room = trip.nightlyRate * nights;
  const tourism = trip.tourismPerNight * nights;
  const muni = trip.muniPerNight * nights;
  const vat = Math.round(room * trip.vatRate * 100) / 100;
  const total = Math.round((room + tourism + muni + vat) * 100) / 100;
  return { nights, room, tourism, muni, vat, total };
}

export function tripTotals(trip: Trip) {
  const hotel = hotelTotals(trip);
  const total =
    Math.round((trip.flightFare + hotel.total + trip.serviceFee) * 100) / 100;
  return { hotel, flight: trip.flightFare, service: trip.serviceFee, total };
}

export function regenerateRefs(trip: Trip): Trip {
  return {
    ...trip,
    pnr: pick(ALPHA, 6),
    ticketNumber: `205${digits(10)}`,
    folio: `INV-${digits(5)}`,
    receiptNumber: `RCP-${digits(5)}`,
    authCode: digits(6),
    issuedAt: new Date().toISOString(),
    outbound: { ...trip.outbound, seq: digits(3).padStart(3, "0") },
    inbound: { ...trip.inbound, seq: digits(3).padStart(3, "0") },
  };
}

type Store = {
  trip: Trip;
  flash: number;
  setTrip: (patch: Partial<Trip>) => void;
  setOutbound: (patch: Partial<FlightLeg>) => void;
  setInbound: (patch: Partial<FlightLeg>) => void;
  regenerate: () => void;
  resetWeek: () => void;
};

export const useTrip = create<Store>()((set) => ({
  trip: defaultTrip(),
  flash: 0,
  setTrip: (patch) => set((s) => ({ trip: { ...s.trip, ...patch } })),
  setOutbound: (patch) =>
    set((s) => ({ trip: { ...s.trip, outbound: { ...s.trip.outbound, ...patch } } })),
  setInbound: (patch) =>
    set((s) => ({ trip: { ...s.trip, inbound: { ...s.trip.inbound, ...patch } } })),
  regenerate: () =>
    set((s) => ({ trip: regenerateRefs(s.trip), flash: s.flash + 1 })),
  resetWeek: () => set({ trip: defaultTrip(), flash: 0 }),
}));

