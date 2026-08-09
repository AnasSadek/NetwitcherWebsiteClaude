import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { ServiceBands } from "@/components/home/ServiceBands";
import { Story } from "@/components/story/Story";

export const metadata: Metadata = {
  title: "Content Creation & Digital Marketing Agentur Berlin – Netwitcher",
  description:
    "Content. Kampagnen. Conversion. Netwitcher ist die visuelle Digital Agency mit eigenem Content-Studio in Berlin: Produktfotografie, Reels, Video, Social Media, Ads und Webdesign.",
};

export default function HomePage() {
  return (
    <>
      {/* Cinematische Scroll-Story: From Attention to Conversion */}
      <Story />

      {/* Editoriale Leistungsübersicht: MACHEN / BEWEGEN / BAUEN */}
      <ServiceBands />

      <FinalCTA
        title="Bereit für den nächsten Schritt?"
        text="Erzähl uns kurz, was du vorhast – wir zeigen dir den direktesten Weg von Aufmerksamkeit zu Anfragen."
      />
    </>
  );
}
