"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";

// The interview portal is a focused, unlisted flow — no site nav or the
// large marketing footer around it. Everything else keeps normal chrome.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/interview");

  if (bare) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <CinematicFooter />
    </>
  );
}
