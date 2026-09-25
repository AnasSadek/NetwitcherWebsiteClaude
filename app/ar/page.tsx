import type { Metadata } from "next";
import { Hero } from "@/components/mascot/Hero";
import { Universe } from "@/components/home/Universe";
import { Journey } from "@/components/home/Journey";
import { Showcase } from "@/components/home/Showcase";
import { Finale } from "@/components/home/Finale";

export const metadata: Metadata = {
  title: "نتويتشر، وكالة رقمية في برلين: محتوى وإعلانات ومواقع وبرمجيات",
  description:
    "نتويتشر تصنع السحر لعلامتك التجارية: تصوير وفيديو من استوديونا الخاص في برلين، سوشيال ميديا وإعلانات، مواقع ومتاجر إلكترونية وبرمجيات. Magic in Every Click.",
  alternates: { canonical: "/ar" },
};

/**
 * Startseite (Arabisch). Gleiche Struktur/Komponenten wie die deutsche
 * Startseite, nur mit locale="ar" durchgereicht — siehe app/(de)/page.tsx.
 */
export default function HomePageAr() {
  return (
    <>
      <Hero locale="ar" />
      <Universe locale="ar" />
      <Journey locale="ar" />
      <Showcase locale="ar" />
      <Finale locale="ar" />
    </>
  );
}
