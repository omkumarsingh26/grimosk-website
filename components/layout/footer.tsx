import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10 bg-[var(--background)]">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <span className="grid place-items-center h-7 w-7 rounded-lg bg-gradient-to-br from-[#0f2a52] to-[#2e5aac]">
                <span className="h-3 w-3 rounded-sm bg-[var(--background)] rotate-45" />
              </span>
              <span className="text-sm font-semibold tracking-[0.2em] text-foreground">
                {site.name}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/60">
              {site.description}
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors press"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-foreground/60">
              Services
            </h4>
            <ul className="mt-4 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-foreground/60">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-foreground/60">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-foreground/60" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-foreground/60" />
                <span>{site.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-foreground/60" />
                <span>{site.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground/35">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-foreground/35">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
