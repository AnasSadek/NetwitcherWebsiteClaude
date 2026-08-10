import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Studio } from "@/components/home/Studio";
import { Formats } from "@/components/home/Formats";
import { Launch } from "@/components/home/Launch";
import { ServiceBands } from "@/components/home/ServiceBands";
import { Conversion } from "@/components/home/Conversion";

export const metadata: Metadata = {
  title: "Content Studio & Digital Agency Berlin – Netwitcher",
  description:
    "Netwitcher produziert Produktfotografie, Reels, Werbevideos und Social Content im eigenen Studio in Berlin – und bringt sie über Social Ads, Google Ads und Websites bis zur Anfrage.",
};

/**
 * Startseite — „Directed Momentum".
 *
 * Kapitelfolge: CAPTURE → CRAFT → LAUNCH → CONVERT.
 * Redaktionell komponiert, fotografiegeführt; Bewegung nur dort, wo sie
 * etwas erzählt (Hero-Reveal, Format-Reframing, Marken-Zusammenlauf).
 */
export default function HomePage() {
  return (
    <>
      {/* 01 · Das Studio arbeitet bereits */}
      <Hero />

      {/* 02 · Content Studio Berlin — Produktion */}
      <Studio />

      {/* 03 · Ein Shooting, viele Formate */}
      <Formats />

      {/* 04 + 05 · Distribution → digitales Ziel */}
      <Launch />

      {/* 06 · Der Rest des Systems */}
      <ServiceBands />

      {/* 07 · Conversion */}
      <Conversion />
    </>
  );
}
