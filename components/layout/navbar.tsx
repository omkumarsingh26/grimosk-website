"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { services, site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 md:px-6 h-14 transition-all duration-300",
            scrolled ? "glass-strong" : "border border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/grimosk-logo.png"
              alt={site.name}
              width={858}
              height={169}
              priority
              className="h-8 w-auto md:h-9 transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem href="/" label="Home" active={pathname === "/"} />
            <ServicesMenu pathname={pathname} />
            <NavItem href="/about" label="About" active={pathname === "/about"} />
            <NavItem
              href="/careers"
              label="Careers"
              active={pathname === "/careers"}
            />
            <NavItem
              href="/contact"
              label="Contact"
              active={pathname === "/contact"}
            />
          </div>

          {/* CTA + theme + mobile toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-foreground text-[var(--background)] text-sm font-medium px-4 py-2 hover:bg-foreground/90 transition-colors press"
            >
              Book a call
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden grid place-items-center h-10 w-10 rounded-full glass text-foreground"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden container mx-auto px-4 mt-2"
          >
            <div className="glass-strong rounded-2xl p-3 flex flex-col">
              {[...links.slice(0, 1)].map((l) => (
                <MobileLink key={l.href} href={l.href} label={l.label} />
              ))}
              <p className="px-3 pt-3 pb-1 text-xs uppercase tracking-widest text-foreground/60">
                Services
              </p>
              {services.map((s) => (
                <MobileLink
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  label={s.short}
                />
              ))}
              <div className="my-2 h-px bg-foreground/10" />
              <MobileLink href="/about" label="About" />
              <MobileLink href="/careers" label="Careers" />
              <MobileLink href="/contact" label="Contact" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3.5 py-2 rounded-full text-[15px] font-semibold transition-colors",
        active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

function ServicesMenu({ pathname }: { pathname: string }) {
  const [hover, setHover] = useState(false);
  const active = pathname.startsWith("/services");

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        href="/#services"
        className={cn(
          "px-3.5 py-2 rounded-full text-[15px] font-semibold transition-colors",
          active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
        )}
      >
        Services
      </Link>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[320px]"
          >
            <div className="glass-strong rounded-2xl p-2">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="flex items-start gap-3 rounded-xl p-3 hover:bg-foreground/[0.05] transition-colors press"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid place-items-center h-8 w-8 rounded-lg",
                        s.accent.bgSoft
                      )}
                    >
                      <Icon className={cn("h-4 w-4", s.accent.text)} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-foreground">
                        {s.short}
                      </span>
                      <span className="block text-xs text-foreground/60 truncate">
                        {s.offerings.length} services
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2.5 rounded-xl text-base font-semibold text-foreground/80 hover:bg-foreground/[0.05] hover:text-foreground transition-colors"
    >
      {label}
    </Link>
  );
}
