import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService } from "@/lib/site";
import { ServicePage } from "@/components/sections/service-page";

const service = getService("business-intelligence");

export const metadata: Metadata = {
  title: service?.title,
  description: service?.summary,
};

export default function Page() {
  if (!service) notFound();
  return <ServicePage service={service} />;
}
