import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/anim/reveal";

type CTAProps = {
  title?: string;
  description?: string;
};

export function CTA({
  title = "Turn questions into decisions.",
  description = "Tell us what you're trying to decide. We'll scope the research, the model, or the analyst capacity to get you there.",
}: CTAProps) {
  return (
    <section className="container mx-auto px-4 md:px-6 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 px-6 py-16 md:px-16 md:py-20 text-center">
          {/* glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0f2a52]/30 via-[#2e5aac]/20 to-[#6690d1]/30 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl md:text-5xl font-medium tracking-[-0.02em] text-foreground">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base md:text-lg text-foreground/65">
              {description}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-foreground/90 transition-colors press"
              >
                Book a discovery call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/[0.05] transition-colors press"
              >
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
