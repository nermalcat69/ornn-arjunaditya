import type { Metadata } from "next";
import Image from "next/image";
import { BondTypeCard } from "@/components/bond-type/BondTypeCard";

export const metadata: Metadata = {
  title: "Arjun Aditya",
  description:
    "Sustainable programmer and founder engineer who likes nature and designing.",
};

const links = [
  { label: "About", href: "https://arjunaditya.xyz" },
  { label: "Archive", href: "https://archived.arjunaditya.xyz" },
  { label: "Twitter", href: "https://x.com/ColdranAI" },
  { label: "GitHub", href: "https://github.com/ColdranAI" },
  { label: "Call me", href: "https://cal.com/arjunaditya/30min" },
  { label: "Email", href: "mailto:hey@arjunaditya.xyz" },
];

const entries = [
  {
    title: "Gray Farms",
    meta: "Initiative · 2026",
    href: "https://grayfarms.in",
    note: "A place where you can find Indian tea and coffee farms.",
  },
  {
    title: "Embracing Open Source as a Company",
    meta: "Writing · 2026",
    href: "https://arjunaditya.xyz",
    note: "On letterpress, tech, and the power of going slow.",
  },
  {
    title: "Gray Cup Enterprises Private Limited",
    meta: "Company · 2025",
    href: "https://graycup.in",
    note: "High quality tea, coffee, matcha and tech, online and offline across India.",
  },
  {
    title: "Coldran",
    meta: "Project · 2025",
    href: "https://app.coldran.com",
    note: "Helping teams collaborate with their customers.",
  },
  {
    title: "Zerops Internship",
    meta: "Work · 2024",
    href: "https://zerops.io",
    note: "Programming intern at a Czech cloud platform company.",
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
          Sustainable programmer & founder engineer who likes nature and
          designing.
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
          I run Gray Cup, selling tea, coffee and tech across India. I started
          programming at 10 and dropped out of high school to build things. This
          is an ultramarathon, not a sprint.
        </p>

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
