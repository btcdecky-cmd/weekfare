import { CANVA_ORIGINALS, FIGMA_ORIGINALS, type StudioAsset } from "@/lib/designs";

export function StudioOriginals() {
  return (
    <div className="flex flex-col gap-10">
      <Gallery
        kicker="Canva"
        title="Generated originals"
        copy="Boarding pass, hotel folio, and payment pages generated in Canva, then attached here — no external link required."
        items={CANVA_ORIGINALS}
      />
      <Gallery
        kicker="Figma"
        title="Drawn originals"
        copy="Ticket, seven-night invoice, and receipt frames drawn in Figma and exported into the studio."
        items={FIGMA_ORIGINALS}
      />
    </div>
  );
}

function Gallery({
  kicker,
  title,
  copy,
  items,
}: {
  kicker: string;
  title: string;
  copy: string;
  items: StudioAsset[];
}) {
  return (
    <section>
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-fg">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.src}
            className="overflow-hidden rounded-xl border border-border bg-bg-elevated"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full bg-paper object-cover"
              crossOrigin="anonymous"
            />
            <figcaption className="px-4 py-3">
              <div className="text-sm font-medium text-fg">{item.title}</div>
              <div className="mt-0.5 text-xs text-muted">{item.caption}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
