import { cn } from "@/lib/utils";
import { Reveal } from "@/components/anim/reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  dotClass?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  dotClass = "bg-[#2e5aac]",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className={cn(
              "inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#1f4e9c]",
              align === "center" && "justify-center"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", dotClass)} />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] text-foreground">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-foreground/70">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
