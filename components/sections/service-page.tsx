import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { services, type Service } from "@/lib/site";
import { Reveal } from "@/components/anim/reveal";
import { TiltCard } from "@/components/anim/tilt-card";
import { CTA } from "@/components/sections/cta";

const outcomes = [
  {
    title: "Decision-ready output",
    body: "Every deliverable is built to be presented to an investment committee or board — clear, sourced, and defensible.",
  },
  {
    title: "Senior analyst ownership",
    body: "An experienced analyst owns your engagement end-to-end. No hand-offs, no junior guesswork.",
  },
  {
    title: "Flexible engagement",
    body: "Run it as a one-off project or a monthly retainer. Scale capacity up or down as your pipeline moves.",
  },
];

export function ServicePage({ service }: { service: Service }) {
  const Icon = service.icon;
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div
          className={cn(
            "pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full blur-3xl opacity-50",
            service.accent.glow
          )}
        />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid place-items-center h-12 w-12 rounded-2xl border",
                      service.accent.bgSoft,
                      service.accent.border
                    )}
                  >
                    <Icon className={cn("h-6 w-6", service.accent.text)} />
                  </span>
                  <span className="font-mono text-sm text-foreground/30">
                    Service line {service.number}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] text-foreground">
                  {service.title}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <span
                  className={cn(
                    "mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                    service.accent.border,
                    service.accent.text
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", service.accent.dot)} />
                  {service.audience}
                </span>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
                  {service.summary}
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-9 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-foreground/90 transition-colors press"
                  >
                    Talk to an analyst
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/#services"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/[0.05] transition-colors press"
                  >
                    All services
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* image */}
            <Reveal delay={0.1}>
              <TiltCard intensity={7}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-foreground/10">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/30 to-transparent" />
                  <div
                    className={cn(
                      "absolute inset-0 mix-blend-overlay opacity-40 bg-gradient-to-br",
                      service.accent.gradient
                    )}
                  />
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OFFERINGS */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-foreground">
            What&apos;s included
          </h2>
          <p className="mt-3 max-w-xl text-foreground/65">
            {service.offerings.length} core offerings under {service.short}. Mix
            and match into a scope that fits your decision.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {service.offerings.map((o, i) => (
            <Reveal key={o} delay={(i % 3) * 0.06}>
              <div className="group flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 transition-colors hover:bg-foreground/[0.04]">
                <span
                  className={cn(
                    "grid place-items-center h-8 w-8 shrink-0 rounded-lg",
                    service.accent.bgSoft
                  )}
                >
                  <Check className={cn("h-4 w-4", service.accent.text)} />
                </span>
                <span className="text-sm font-medium text-foreground/85">{o}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="border-y border-foreground/10 bg-foreground/[0.015]">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-foreground">
              What you can expect
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {outcomes.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-foreground/10 p-7">
                  <span className="font-mono text-xs text-foreground/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {o.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {o.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-foreground">
            Explore other service lines
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {others.map((s, i) => {
            const OIcon = s.icon;
            return (
              <Reveal key={s.slug} delay={i * 0.08}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 transition-colors hover:bg-foreground/[0.04]"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid place-items-center h-10 w-10 rounded-xl",
                        s.accent.bgSoft
                      )}
                    >
                      <OIcon className={cn("h-5 w-5", s.accent.text)} />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {s.short}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTA title={`Ready to put ${service.short} to work?`} />
    </>
  );
}
