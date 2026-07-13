import { Check } from "lucide-react";
import { Reveal } from "@/components/anim/reveal";
import { IntelligenceOrb } from "@/components/three/intelligence-orb";

const points = [
  "Primary + secondary research, synthesized by senior analysts",
  "Models and dashboards you can actually audit and reuse",
  "AI research agents that monitor markets while you sleep",
  "Every deliverable pressure-tested for decision-readiness",
];

export function Engine3D() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* 3D canvas */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative h-[360px] sm:h-[460px] w-full">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0f2a52]/10 via-transparent to-[#6690d1]/10" />
              <IntelligenceOrb />
            </div>
          </Reveal>

          {/* copy */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.02em] text-foreground">
                One engine behind every <span className="text-accent">decision</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-foreground/65">
                Data, models, and human judgment compounding into a single source
                of truth — rendered, quite literally, in real time.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {points.map((p, i) => (
                <Reveal as="li" key={p} delay={0.15 + i * 0.07}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid place-items-center h-5 w-5 shrink-0 rounded-full bg-[#2e5aac]/15">
                      <Check className="h-3 w-3 text-[#2e5aac]" />
                    </span>
                    <span className="text-sm text-foreground/65">{p}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
