import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "@/components/anim/reveal";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell GRIMOSK what you're trying to decide. We'll scope the research, model, or analyst capacity to get you there.",
};

const details = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone}` },
  { icon: MapPin, label: "Offices", value: site.location },
  { icon: Clock, label: "Response time", value: "Within 1 business day" },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0f2a52]/20 via-[#2e5aac]/15 to-[#6690d1]/20 blur-3xl" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: intro + details */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#1f4e9c]">
                <span className="h-2 w-2 rounded-full bg-[#2e5aac]" />
                Contact
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] text-foreground">
                Let&apos;s scope your <span className="text-accent">next decision</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-foreground/70">
                Whether it&apos;s a valuation, a market map, a dashboard, or a
                dedicated analyst — tell us the question and we&apos;ll propose a
                scope, timeline, and price.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {details.map((d, i) => {
                const Icon = d.icon;
                const content = (
                  <div className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-foreground/[0.04]">
                      <Icon className="h-4 w-4 text-foreground/70" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-widest text-foreground/60">
                        {d.label}
                      </span>
                      <span className="mt-1 block text-sm text-foreground/85">
                        {d.value}
                      </span>
                    </span>
                  </div>
                );
                return (
                  <Reveal key={d.label} delay={0.15 + i * 0.06}>
                    {d.href ? (
                      <a href={d.href} className="block hover:opacity-90 transition-opacity">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Right: form */}
          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
