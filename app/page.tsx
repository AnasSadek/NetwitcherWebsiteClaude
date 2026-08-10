import type { Metadata } from "next";
import { Film } from "@/components/film/Film";
import { ServiceBands } from "@/components/home/ServiceBands";

export const metadata: Metadata = {
  title: "Content Studio & Digital Agency Berlin, Netwitcher",
  description:
    "Netwitcher produziert Foto, Video, Reels und Social Content im eigenen Studio in Berlin und bringt ihn über Social Media, Meta Ads, TikTok Ads und Google Ads zu den richtigen Menschen.",
};

/**
 * Startseite — „From Nothing to Attention".
 *
 * Ein durchgehender Scroll-Film erzählt die Transformation:
 * Nichts → Aufmerksamkeit → Content → Distribution → Ziel → Handlung → Stern.
 * Text verkauft die Leistungen, Motion erzählt die Geschichte.
 * Danach: die Leistungsübersicht als echtes, scanbares DOM.
 */
export default function HomePage() {
  return (
    <>
      <Film />
      <ServiceBands />
    </>
  );
}
