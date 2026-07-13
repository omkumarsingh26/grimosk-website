import {
  LineChart,
  Compass,
  BrainCircuit,
  Users,
  type LucideIcon,
} from "lucide-react";

export const site = {
  name: "GRIMOSK",
  tagline: "From Insight to Execution.",
  description:
    "Grimosk partners with businesses to solve complex challenges through research, strategy, technology, compliance, and talent — we don't just advise, we execute.",
  email: "om@grimosk.com",
  phone: "+91 XXXXX XXXXX", // TODO: replace with real number
  location: "India",
} as const;

export type Accent = {
  /** tailwind color family name */
  name: string;
  gradient: string;
  text: string;
  bgSoft: string;
  border: string;
  glow: string;
  ring: string;
  dot: string;
};

export type Service = {
  slug: string;
  number: string;
  title: string;
  short: string;
  audience: string;
  summary: string;
  icon: LucideIcon;
  accent: Accent;
  image: string;
  offerings: string[];
};

export const services: Service[] = [
  {
    slug: "financial-intelligence",
    number: "01",
    title: "Financial Intelligence",
    short: "Financial Intelligence",
    audience: "For investors, startups, family offices, funds, and corporates.",
    summary:
      "Decision-grade financial analysis — from models and valuations to due diligence — built to the standard institutional capital expects.",
    icon: LineChart,
    accent: {
      name: "indigo",
      gradient: "from-indigo-500 to-sky-400",
      text: "text-indigo-300",
      bgSoft: "bg-indigo-500/10",
      border: "border-indigo-400/30",
      glow: "bg-indigo-500/20",
      ring: "ring-indigo-400/40",
      dot: "bg-indigo-400",
    },
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
    offerings: [
      "Financial Modeling",
      "Valuation Analysis",
      "Investment Research",
      "Equity Research",
      "Industry Research Reports",
      "Due Diligence Support",
      "Company Profiling",
      "Market Outlook Reports",
      "Portfolio Analytics",
      "Economic & Sector Analysis",
    ],
  },
  {
    slug: "business-intelligence",
    number: "02",
    title: "Business Intelligence & Strategic Research",
    short: "Business Intelligence",
    audience: "For startups, SMEs, consultants, and enterprises.",
    summary:
      "Market truth and strategic clarity — sizing, competitors, and landscape studies that turn ambiguity into a defensible plan.",
    icon: Compass,
    accent: {
      name: "emerald",
      gradient: "from-emerald-500 to-teal-400",
      text: "text-emerald-300",
      bgSoft: "bg-emerald-500/10",
      border: "border-emerald-400/30",
      glow: "bg-emerald-500/20",
      ring: "ring-emerald-400/40",
      dot: "bg-emerald-400",
    },
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80",
    offerings: [
      "Market Research",
      "Competitor Analysis",
      "Market Sizing (TAM/SAM/SOM)",
      "Industry Landscape Studies",
      "Strategic Intelligence Reports",
      "Customer Research",
      "Business Plan Development",
      "Feasibility Studies",
      "Lead Intelligence Research",
      "M&A Target Screening",
    ],
  },
  {
    slug: "data-analytics-ai",
    number: "03",
    title: "Data Analytics & AI Solutions",
    short: "Data Analytics & AI",
    audience: "For data-driven teams ready to scale.",
    summary:
      "Dashboards, forecasting, and AI research agents that compress the distance between raw data and the decision it should drive.",
    icon: BrainCircuit,
    accent: {
      name: "violet",
      gradient: "from-violet-500 to-fuchsia-400",
      text: "text-violet-300",
      bgSoft: "bg-violet-500/10",
      border: "border-violet-400/30",
      glow: "bg-violet-500/20",
      ring: "ring-violet-400/40",
      dot: "bg-violet-400",
    },
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    offerings: [
      "Business Dashboards",
      "Data Visualization",
      "Forecasting Models",
      "Predictive Analytics",
      "AI Research Agents",
      "Process Automation",
      "AI Workflow Design",
      "Custom Analytics Solutions",
      "Reporting Automation",
      "Decision Support Systems",
    ],
  },
  {
    slug: "analyst-as-a-service",
    number: "04",
    title: "Analyst-as-a-Service",
    short: "Analyst-as-a-Service",
    audience: "For teams that need analyst horsepower, on tap.",
    summary:
      "Dedicated research analysts as a monthly subscription — embedded capacity for modeling, decks, and competitive monitoring without the headcount.",
    icon: Users,
    accent: {
      name: "amber",
      gradient: "from-amber-500 to-rose-400",
      text: "text-amber-300",
      bgSoft: "bg-amber-500/10",
      border: "border-amber-400/30",
      glow: "bg-amber-500/20",
      ring: "ring-amber-400/40",
      dot: "bg-amber-400",
    },
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
    offerings: [
      "Dedicated Research Analysts",
      "Virtual Financial Analysts",
      "Excel & PowerPoint Support",
      "Data Collection & Validation",
      "Competitive Intelligence Monitoring",
      "Weekly/Monthly Research Reports",
      "Presentation Development",
      "Research Outsourcing",
      "Management Reporting Support",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const nav = [
  { label: "Home", href: "/" },
  ...services.map((s) => ({ label: s.short, href: `/services/${s.slug}` })),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const primaryNav = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
