"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ParticleConfig {
  /** Higher = FEWER particles. Particle count = (area / count), capped. */
  count: number;
  speed: number;
  /** Squared pixel distance under which two particles connect. */
  connectionDistance: number;
  mouseRadius: number;
  colors: {
    particle: string;
    /** Use the literal token `OPACITY` where the alpha should be interpolated. */
    connection: string;
    mouseConnection: string;
  };
  size: { min: number; max: number };
  /** Hard cap on particle count for performance. Defaults to 200. */
  maxParticles?: number;
}

class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;

  constructor(
    x: number,
    y: number,
    directionX: number,
    directionY: number,
    size: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(
    ctx: CanvasRenderingContext2D,
    mouse: { x: number | null; y: number | null; radius: number },
    w: number,
    h: number
  ) {
    if (this.x > w || this.x < 0) this.directionX = -this.directionX;
    if (this.y > h || this.y < 0) this.directionY = -this.directionY;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size && distance > 0) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * 5;
        this.y -= (dy / distance) * force * 5;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw(ctx);
  }
}

interface AetherCanvasProps {
  config: ParticleConfig;
  /** Solid color used to clear each frame (no trails). */
  backgroundColor: string;
  className?: string;
}

/**
 * Interactive particle field, adapted from the "Aether" engine.
 * Sized to its parent (not the window), crisp on HiDPI, and static under
 * `prefers-reduced-motion` (one painted frame, no loop, no pointer tracking).
 */
export function AetherCanvas({ config, backgroundColor, className }: AetherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxParticles = config.maxParticles ?? 200;
    const mouse = { x: null as number | null, y: null as number | null, radius: config.mouseRadius };

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let rafId = 0;

    const sizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      particles = [];
      const n = Math.min(Math.floor((w * h) / config.count), maxParticles);
      for (let i = 0; i < n; i++) {
        const size = Math.random() * (config.size.max - config.size.min) + config.size.min;
        const x = Math.random() * (w - size * 2) + size;
        const y = Math.random() * (h - size * 2) + size;
        const dirX = Math.random() * config.speed - config.speed / 2;
        const dirY = Math.random() * config.speed - config.speed / 2;
        particles.push(new Particle(x, y, dirX, dirY, size, config.colors.particle));
      }
    };

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dxp = particles[a].x - particles[b].x;
          const dyp = particles[a].y - particles[b].y;
          const distance = dxp * dxp + dyp * dyp;
          if (distance < config.connectionDistance) {
            const opacity = (1 - distance / 20000).toFixed(3);
            const near =
              mouse.x !== null &&
              Math.hypot(particles[a].x - mouse.x, particles[a].y - (mouse.y ?? 0)) < mouse.radius;
            ctx.strokeStyle = (near ? config.colors.mouseConnection : config.colors.connection).replace(
              "OPACITY",
              opacity
            );
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const paint = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
      for (const p of particles) p.update(ctx, mouse, w, h);
      connect();
    };

    // Reduced motion: render a single static frame, no loop, no pointer tracking.
    if (reduce) {
      sizeCanvas();
      init();
      mouse.x = null;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
      for (const p of particles) p.draw(ctx);
      connect();
      return;
    }

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      paint();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const ro = new ResizeObserver(() => {
      sizeCanvas();
      init();
    });
    ro.observe(parent);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseLeave);

    sizeCanvas();
    init();
    animate();

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [config, backgroundColor, reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
