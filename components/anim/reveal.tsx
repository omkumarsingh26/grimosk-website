"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** stagger index */
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Lightweight fade-up-on-scroll wrapper used across inner pages.
 * Animates once when the element enters the viewport.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  const reduce = useReducedMotion();

  // Reduced motion: render the content statically and fully visible —
  // never gate visibility behind a transition that may not fire.
  if (reduce) {
    const Tag = as;
    return <Tag className={cn(className)}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
      }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
