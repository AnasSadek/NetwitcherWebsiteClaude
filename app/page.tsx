import type { Metadata } from "next";
import { Hero } from "@/components/mascot/Hero";
import { Universe } from "@/components/home/Universe";
import { Journey } from "@/components/home/Journey";
import { Showcase } from "@/components/home/Showcase";
import { Finale } from "@/components/home/Finale";

export const metadata: Metadata = {
  title: "Netwitcher, Digital Agency Berlin: Content, Ads, Web & Software",
  description:
    "Netwitcher macht Magie aus deiner Marke: Foto & Video aus dem eigenen Studio Berlin, Social Media & Ads, Websites, Shops und Software. Magic in Every Click.",
};

/**
 * Startseite. WITCH, der Kamera-Kopf, empfängt — danach:
 * Universum (Leistungen) → Weg (Prozess) → Studio (Beweis) → Finale (CTA).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Universe />
      <Journey />
      <Showcase />
      <Finale />
    </>
  );
}
