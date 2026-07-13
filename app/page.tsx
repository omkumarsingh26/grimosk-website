import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AetherHero } from "@/components/sections/aether-hero";
import { CapabilityMarquee } from "@/components/sections/marquee";
import { ServicesOverview } from "@/components/sections/services-overview";
import { Engine3D } from "@/components/sections/engine-3d";
import { Process } from "@/components/sections/process";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <AetherHero
        badge="GRIMOSK · Business Growth & Execution Partner"
        title1="Building Businesses."
        title2="Driving Growth."
        description="Helping businesses solve problems, unlock opportunities, and achieve sustainable growth through strategy and execution. We don't just advise — we execute."
        actions={
          <>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-foreground/90 transition-colors press"
            >
              Explore our services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground/[0.05] transition-colors press"
            >
              Book a discovery call
            </Link>
          </>
        }
      />

      <CapabilityMarquee />
      <ServicesOverview />
      <Engine3D />
      <Process />
      <CTA />
    </>
  );
}
