import { OG_SIZE, ogCardAr } from "@/lib/og";

export const alt = "نتويتشر، أعمال مختارة";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCardAr({
    eyebrow: "نتويتشر · أعمالنا",
    title: "أعمال تُرى.",
    meta: "مواقع · محتوى · حملات · برمجيات",
  });
}
