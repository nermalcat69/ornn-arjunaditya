import type { Metadata } from "next";
import Image from "next/image";
import { BondTypeCard } from "@/components/bond-type/BondTypeCard";

export const metadata: Metadata = {
  title: "Arjun Aditya",
  description:
    "Sustainable programmer and founder engineer who likes nature and designing.",
};

const links = [
  { label: "Main Site", href: "https://arjunaditya.xyz" },
  { label: "Archived Site", href: "https://archived.arjunaditya.xyz" },
  { label: "Twitter", href: "https://x.com/arjunaditya_" },
  { label: "GitHub", href: "https://github.com/nermalcat69" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nermalcat69/" },
  { label: "Email", href: "mailto:arjun@graycup.in" },
];

const entries = [
  {
    title: "Gray Farms",
    meta: "Initiative · 2026",
    href: "https://grayfarms.in",
    note: "A place where you can find Indian tea and coffee farms.",
  },
];

const projects = [
  {
    title: "Discord Channel Scraper",
    href: "https://github.com/nermalcat69/Discord-Channel-Scraper",
    img: "/images/projects/discord-channel-scraper.png",
    note: "Scrape messages and history from Discord channels.",
    extra: { label: "Watch demo", href: "https://youtu.be/XWrJsKjhkzQ" },
  },
  {
    title: "Razorpay AI Store",
    href: "https://github.com/nermalcat69/razorpay-ai-store",
    img: "/images/projects/razorpay-ai-store.png",
    note: "An AI-powered storefront wired to Razorpay payments.",
  },
  {
    title: "Indian Tender Scraper",
    href: "https://github.com/nermalcat69/indian-tender-scraper",
    img: "/images/projects/indian-tender-scraper.png",
    note: "Collects public procurement tenders from Indian government portals.",
  },
  {
    title: "macstats",
    href: "https://github.com/nermalcat69/macstats",
    img: "/images/projects/macstats.png",
    note: "A lightweight system stats monitor for macOS.",
  },
  {
    title: "Mini ComponentBug",
    href: "https://github.com/ColdranAI/Mini-ComponentBug",
    img: "/images/projects/mini-componentbug.png",
    note: "A small tool for reporting UI component bugs with context.",
    extra: {
      label: "Preview tweet",
      href: "https://x.com/arjunaditya_/status/1954599008401285623",
    },
  },
  {
    title: "nermalist",
    href: "https://github.com/chyawanprash/nermalist",
    img: "/images/projects/nermalist.png",
    note: "An encrypted notes app with compression and encryption in the .nermal format.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:grid md:grid-cols-[200px_1fr] md:gap-16">
      <aside className="mb-12 md:mb-0">
        <Image
          src="/img-2384.webp"
          alt="Arjun Aditya"
          width={600}
          height={800}
          sizes="(min-width: 768px) 200px, 40vw"
          className="mb-4 aspect-[3/4] w-full max-w-[200px] object-cover"
        />
        <h1 className="text-base font-medium text-neutral-900">Arjun Aditya</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Reactional Programmer who likes to build things. For Living I run Gray Cup, selling tea, coffee and building white label products for B2B.
          </p>
        <nav className="mt-6 flex flex-col gap-1.5 text-sm">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener"
              className="text-neutral-500 hover:text-neutral-900"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </aside>

      <main>
        <BondTypeCard />

        <h2 className="mb-4 mt-10 text-sm font-medium text-neutral-900">
          Portfolio for ORNN
        </h2>
        <p className="text-sm leading-relaxed text-neutral-700">
          I run Gray Cup, selling tea, coffee and building things in tech for fun. I started
          programming at 10 to make my own minecraft game.
        </p>
        <p className="text-sm leading-relaxed text-neutral-700 mt-2">
          I build things for myself but I worked with Zerops, a Czech cloud platform company, as a programming intern in 2024-2025, where i mainly focused on customer onboarding, repos to get started on a cloud platform and marketing.
          <br />
                    <br />

          Lowkey, I've been exploiting internet tools in my own favour especially for scraping and automating things with Bearer Tokens.
          ps: I don't have a resume, made this site just for ornn.
        </p>
        <p className="text-sm leading-relaxed text-neutral-700 mt-2">
          I feel like CVE Database is enough for most companies but finding exploits is my thing even though it takes days.
        </p>
                <p className="text-sm leading-relaxed text-neutral-700 mt-2">
I'm also a moderator at r/AskProgrammers (sort of chronically online on 4 reddit accounts)
        </p>

        <h2 className="mb-4 mt-10 text-sm font-medium text-neutral-900">
          Open Source Projects
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.title} className="flex flex-col">
              <a href={p.href} target="_blank" rel="noopener" className="group">
                <Image
                  src={p.img}
                  alt={p.title}
                  width={1200}
                  height={600}
                  sizes="(min-width: 640px) 300px, 90vw"
                  className="aspect-[2/1] w-full border border-neutral-200 object-cover"
                />
                <span className="mt-2 block text-sm font-medium text-neutral-900 group-hover:underline">
                  {p.title}
                </span>
              </a>
              <span className="mt-0.5 text-sm text-neutral-500">{p.note}</span>
              {p.extra && (
                <a
                  href={p.extra.href}
                  target="_blank"
                  rel="noopener"
                  className="mt-1 text-xs text-neutral-400 hover:text-neutral-900"
                >
                  {p.extra.label} →
                </a>
              )}
            </li>
          ))}
        </ul>

        <ul className="mt-10 flex flex-col divide-y divide-neutral-200">
          {entries.map((e) => (
            <li key={e.title} className="py-4">
              <a
                href={e.href}
                target="_blank"
                rel="noopener"
                className="group flex flex-col gap-0.5"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-sm font-medium text-neutral-900 group-hover:underline">
                    {e.title}
                  </span>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {e.meta}
                  </span>
                </span>
                <span className="text-sm text-neutral-500">{e.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
