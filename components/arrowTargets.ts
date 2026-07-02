import type { AccentColor } from "@/lib/services";

/** Klick-Ziele der fünf Logo-Pfeile (siehe docs/04-arrow-animation-plan.md). */
export const ARROW_TARGETS: {
  color: AccentColor;
  label: string;
  href: string;
}[] = [
  { color: "mint", label: "Webdesign & E-Commerce", href: "/leistungen/webdesign-ecommerce" },
  { color: "violet", label: "Strategie & Digital Marketing", href: "/leistungen/performance-marketing" },
  { color: "pink", label: "Content Creation", href: "/studio" },
  { color: "sun", label: "Studio & Fotografie", href: "/leistungen/foto-videoproduktion" },
  { color: "sky", label: "Social Media & Ads", href: "/leistungen/social-media-management" },
];
