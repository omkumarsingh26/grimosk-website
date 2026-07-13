"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Three.js needs the browser — load the Canvas client-side only.
const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
    </div>
  ),
});

export function IntelligenceOrb({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <Scene />
    </div>
  );
}
