import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Netwitcher, ausgewählte Arbeiten";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Netwitcher · Portfolio",
    title: "Arbeit, die man sieht.",
    meta: "Websites · Content · Kampagnen · Software",
  });
}
