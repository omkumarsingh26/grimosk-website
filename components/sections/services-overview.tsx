import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { services } from "@/lib/site";
import { Reveal } from "@/components/anim/reveal";
import { TiltCard } from "@/components/anim/tilt-card";
import { SectionHeading } from "@/components/sections/section-heading";

export function ServicesOverview() {
  return (
    <section id="services" className="container mx-auto px-4 md:px-6 py-24 scroll-mt-24">
      <SectionHeading
        eyebrow="What We Do"
        title={
          <>
            From insight
            <br className="hidden sm:block" /> to execution.
          </>
        }
        description="Research, strategy, technology, compliance, and talent — under one roof, so you're not juggling five different partners to get one thing done."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.slug} delay={i * 0.08}>
              <TiltCard intensity={6} className="h-full">
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-foreground/[0.02] p-8 transition-colors hover:bg-foreground/[0.04]",
                    "border-foreground/10"
                  )}
                >
                  {/* accent glow */}
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-40 transition-opacity group-hover:opacity-70",
                      s.accent.glow
                    )}
                  />

                  <div className="relative flex items-center justify-between">
                    <span
                      className={cn(
                        "grid place-items-center h-12 w-12 rounded-2xl",
                        s.accent.bgSoft,
                        "border",
                        s.accent.border
                      )}
                    >
                      <Icon className={cn("h-6 w-6", s.accent.text)} />
                    </span>
                    <span className="font-mono text-sm text-foreground/30">
                      {s.number}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-xl font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-foreground/65">
                    {s.summary}
                  </p>

                  <div className="relative mt-6 flex flex-wrap gap-2">
                    {s.offerings.slice(0, 4).map((o) => (
                      <span
                        key={o}
                        className="rounded-full border border-foreground/10 px-3 py-1 text-xs text-foreground/70"
                      >
                        {o}
                      </span>
                    ))}
                    <span className="rounded-full px-3 py-1 text-xs text-foreground/35">
                      +{s.offerings.length - 4} more
                    </span>
                  </div>

                  <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-foreground">
                    Explore {s.short}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
