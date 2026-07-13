"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { Circle } from "lucide-react";
import { AetherCanvas, type ParticleConfig } from "@/components/aether/aether-canvas";

// Navy/blue field on near-black navy (dark theme).
const darkConfig: ParticleConfig = {
  count: 11000,
  speed: 0.3,
  connectionDistance: 20000,
  mouseRadius: 200,
  colors: {
    particle: "rgba(108, 148, 219, 0.7)",
    connection: "rgba(90, 130, 205, OPACITY)",
    mouseConnection: "rgba(255, 255, 255, OPACITY)",
  },
  size: { min: 0.6, max: 2.4 },
  maxParticles: 180,
};

// Deeper navy blue on off-white (light theme) so the field stays visible.
const lightConfig: ParticleConfig = {
  ...darkConfig,
  colors: {
    particle: "rgba(30, 78, 156, 0.5)",
    connection: "rgba(30, 78, 156, OPACITY)",
    mouseConnection: "rgba(16, 26, 46, OPACITY)",
  },
};

type AetherHeroProps = {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AetherHero({
  badge = "GRIMOSK · Research & Intelligence",
  title1 = "Intelligence for",
  title2 = "Decisive Capital",
  description = "Financial intelligence, strategic research, and AI-powered analytics — delivered by senior analysts so you can move on conviction, not guesswork.",
  actions,
}: AetherHeroProps) {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Default to the dark field until the theme is resolved on the client.
  const isLight = mounted && resolvedTheme === "light";
  const config = isLight ? lightConfig : darkConfig;
  const canvasBg = isLight ? "rgb(250, 250, 250)" : "rgb(3, 3, 3)";

  const fadeUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : 0.1 + i * 0.08,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <AetherCanvas config={config} backgroundColor={canvasBg} />

      {/* Fade the field into the page bg so the headline stays legible (theme-aware) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/80" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-1 backdrop-blur-sm md:mb-12"
          >
            <Circle className="h-2 w-2 fill-[#2e5aac]/80 text-[#2e5aac]/80" />
            <span className="font-mono text-xs tracking-wide text-foreground/70">{badge}</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 text-4xl font-medium tracking-[-0.03em] text-foreground sm:text-6xl md:mb-8 md:text-8xl"
          >
            <span>{title1}</span>
            <br />
            <span className="italic text-accent">{title2}</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mx-auto mb-8 max-w-xl px-4 text-base leading-relaxed text-foreground/70 sm:text-lg md:text-xl"
          >
            {description}
          </motion.p>

          {actions && (
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
