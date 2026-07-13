import { Search, PencilRuler, LineChart, Rocket } from "lucide-react";
import { Reveal } from "@/components/anim/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

const steps = [
  {
    icon: Search,
    title: "Scope",
    body: "We pin down the decision, the constraints, and what 'good' looks like before any work begins.",
  },
  {
    icon: PencilRuler,
    title: "Research & Build",
    body: "Analysts gather, validate, and model — combining primary sources, data, and AI agents.",
  },
  {
    icon: LineChart,
    title: "Synthesize",
    body: "Findings become a clear narrative: models, dashboards, and reports you can defend.",
  },
  {
    icon: Rocket,
    title: "Deliver & Iterate",
    body: "You get decision-ready output, plus the option to keep an analyst on retainer.",
  },
];

export function Process() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-24">
      <SectionHeading
        eyebrow="How we work"
        align="center"
        dotClass="bg-[#6690d1]"
        title="A repeatable path from question to conviction."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
                <span className="font-mono text-xs text-foreground/30">
                  0{i + 1}
                </span>
                <span className="mt-4 grid place-items-center h-11 w-11 rounded-xl bg-foreground/[0.04] border border-foreground/10">
                  <Icon className="h-5 w-5 text-foreground/80" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {s.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
