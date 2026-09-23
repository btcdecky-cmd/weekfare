# Weekfare

A one-week travel document studio. It regenerates a **boarding pass**, a **seven-night hotel invoice**, and a **payment receipt** as a matching set.

The live documents are editable itinerary records. They are **not** official airline tickets, hotel tax invoices, or bank statements.

## What’s in the studio

- **Boarding pass** — outbound and return, with PNR, seat, gate, and barcode
- **Hotel invoice** — seven-night folio, line items, paid-in-full stamp
- **Payment receipt** — airfare + hotel + service fee, settled total
- **Studio originals** — Canva and Figma designs generated for this project and attached as images (no external design links required)

Default sample week: Lagos (LOS) → Dubai (DXB), 26 Sep – 3 Oct 2026, Palmette Residence, Aether Air.

## Use it

1. Open the studio
2. Edit passenger, flights, hotel, and fares
3. Click **Regenerate** to issue new confirmation, folio, receipt, and auth numbers
4. Switch tabs to review ticket / invoice / receipt
5. **Print** the current document
6. Open **Studio originals** to see the attached Canva and Figma artwork

## Design sources (attached)

| Source | Location |
| --- | --- |
| Canva | `public/designs/canva/` |
| Figma | `public/designs/figma/` |

Figma file: *Weekfare Trip Documents* (boarding pass, hotel invoice, payment receipt frames). Canva generated a document pack, a boarding-pass postcard, and a travel-records report; those pages were exported as PNG and copied into the app.

## Stack

React 19, TanStack Start, Tailwind CSS v4, Zustand, date-fns.

## Local development

```sh
npm install
npm run dev
```

```sh
npm run build
npm run typecheck
```

## License

Personal itinerary sample app. Use only for mockups and personal records.
