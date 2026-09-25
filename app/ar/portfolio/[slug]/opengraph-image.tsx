import { OG_SIZE, ogCardAr } from "@/lib/og";
import { getCategoryAr, getProjectAr, portfolioProjectsAr } from "@/lib/portfolio.ar";

export const alt = "أعمال نتويتشر";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return portfolioProjectsAr.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProjectAr(slug);
  return ogCardAr({
    eyebrow: `نتويتشر · ${p?.client ?? "أعمالنا"}`,
    title: p?.title ?? "أعمالنا",
    meta: p ? `${p.categories.map((c) => getCategoryAr(c).label).join(" · ")} · ${p.year}` : undefined,
    color: p?.color,
  });
}
