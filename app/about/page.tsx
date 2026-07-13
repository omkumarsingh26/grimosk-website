import type { Metadata } from "next";
import Image from "next/image";
import { Telescope, ShieldCheck, Gauge, Handshake } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "@/components/anim/reveal";
import { TiltCard } from "@/components/anim/tilt-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "GRIMOSK is a research and intelligence partner combining senior analysts, rigorous method, and modern AI tooling.",
};

const values = [
  {
    icon: Telescope,
    title: "Decision-first",
    body: "We start from the choice you're trying to make, not the data we happen to have. Every output ladders up to it.",
  },
  {
    icon: ShieldCheck,
    title: "Defensible rigor",
    body: "Sourced, auditable, and stress-tested. Our work holds up in front of boards, committees, and counterparties.",
  },
  {
    icon: Gauge,
    title: "Speed without shortcuts",
    body: "AI agents and reusable models compress timelines — senior review keeps the quality bar where it belongs.",
  },
  {
    icon: Handshake,
    title: "Embedded partnership",
    body: "We work like an extension of your team, from a one-off model to a standing analyst on retainer.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="pointer-events-none absolute -top-24 right-[-5%] h-80 w-80 rounded-full bg-[#2e5aac]/15 blur-3xl" />
        <div className="container relative mx-auto px-4 md:px-6">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#1f4e9c]">
              <span className="h-2 w-2 rounded-full bg-[#2e5aac]" />
              About {site.name}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] text-foreground">
              A research partner built for{" "}
              <span className="text-accent">decisive capital</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">
              {site.name} exists for the moments where being right matters — a
              valuation, a market entry, an acquisition, a board decision. We
              pair senior analysts with modern data and AI tooling to deliver
              intelligence you can act on with conviction.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STORY + IMAGE */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our approach"
              title="Human judgment, amplified by machines."
              description="The best research has always been about judgment. We keep humans at the center and use AI to do what it does best — gather, validate, and monitor at scale — so our analysts spend their time on the thinking that actually moves a decision."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Senior analysts", "Ex-banking, consulting, and equity research."],
                ["AI-native workflow", "Research agents and automation baked in."],
                ["Sector-agnostic", "A method that adapts to any industry or market."],
                ["Flexible model", "Projects or monthly analyst capacity."],
              ].map(([t, b]) => (
                <Reveal key={t}>
                  <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                    <div className="text-sm font-semibold text-foreground">{t}</div>
                    <div className="mt-1 text-sm text-foreground/65">{b}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <TiltCard intensity={7}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-foreground/10">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="The GRIMOSK analyst team at work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/20 to-transparent" />
                <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-gradient-to-br from-[#0f2a52] to-[#6690d1]" />
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <SectionHeading
          align="center"
          title="Four principles behind every engagement."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-foreground/[0.04] border border-foreground/10">
                    <Icon className="h-5 w-5 text-foreground/80" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTA title="Let's build your intelligence advantage." />
    </>
  );
}
