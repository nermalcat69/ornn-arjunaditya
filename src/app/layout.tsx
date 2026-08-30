import React from "react";
import type { Metadata } from "next";
import { Inter, Silkscreen } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontPixel = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arjun Aditya",
  description:
    "Sustainable programmer and founder engineer who likes nature and designing.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-neutral-50 font-sans antialiased ${fontSans.variable} ${fontPixel.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
