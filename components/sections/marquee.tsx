import { services } from "@/lib/site";

// Flatten every offering across all service lines into one ticker.
const items = Array.from(new Set(services.flatMap((s) => s.offerings)));

export function CapabilityMarquee() {
  const row = [...items, ...items];
  return (
    <section className="py-10 border-y border-foreground/10 overflow-hidden">
      <div className="relative flex">
        <div className="flex shrink-0 animate-marquee items-center gap-3 pr-3">
          {row.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="whitespace-nowrap rounded-full border border-foreground/10 bg-foreground/[0.02] px-4 py-2 text-sm text-foreground/70"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
