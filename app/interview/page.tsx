import type { Metadata } from "next";
import { InterviewClient } from "@/components/sections/interview-client";

// Unlisted on purpose: not in the navbar, not indexed by search engines.
// Reachable only by whoever has this exact URL.
export const metadata: Metadata = {
  title: "Interview",
  robots: { index: false, follow: false },
};

export default function InterviewPage() {
  return <InterviewClient />;
}
