import type { Metadata } from "next";
import { Rocket, Users2, GraduationCap, Globe2 } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "@/components/anim/reveal";
import { JobApplicationForm } from "@/components/sections/job-application-form";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join ${site.name}. Apply for a role or internship across strategy, consulting, technology, and execution.`,
};

const perks = [
  {
    icon: Rocket,
    title: "Real ownership",
    body: "Small teams, high trust — you'll work directly on client outcomes, not busywork.",
  },
  {
    icon: Users2,
    title: "Cross-functional exposure",
    body: "Research, strategy, tech, compliance, talent — move across domains as you grow.",
  },
  {
    icon: GraduationCap,
    title: "Built for learning",
    body: "Internships and early-career roles designed to teach, not just task.",
  },
  {
    icon: Globe2,
    title: "Remote-friendly",
    body: "We hire for the work, not the zip code.",
  },
];

export default function CareersPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0f2a52]/20 via-[#2e5aac]/15 to-[#6690d1]/20 blur-3xl" />

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#1f4e9c]">
              <span className="h-2 w-2 rounded-full bg-[#2e5aac]" />
              Careers
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] text-foreground">
              Build businesses with <span className="text-accent">us</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-foreground/70">
              We&apos;re always looking for people who&apos;d rather execute
              than just advise. Tell us where you fit — job or internship —
              and we&apos;ll take it from there.
            </p>
          </Reveal>
        </div>

        {/* Perks */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={0.05 * i}>
                <div className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                  <span className="grid place-items-center h-10 w-10 shrink-0 rounded-xl bg-[#eaf1fb]">
                    <Icon className="h-5 w-5 text-[#0f2a52]" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {p.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-foreground/65">
                      {p.body}
                    </span>
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Application form */}
        <div className="mx-auto mt-20 max-w-2xl">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-foreground text-center">
              Apply now
            </h2>
            <p className="mt-3 text-center text-foreground/65">
              Open to both full-time roles and internships — select whichever
              applies below.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 block">
            <JobApplicationForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
