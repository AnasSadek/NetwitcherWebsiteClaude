import { OG_SIZE, ogCard } from "@/lib/og";
import { getCategory, getProject, portfolioProjects } from "@/lib/portfolio";

export const alt = "Netwitcher Portfolio";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return ogCard({
    eyebrow: `Netwitcher · ${p?.client ?? "Portfolio"}`,
    title: p?.title ?? "Portfolio",
    meta: p ? `${p.categories.map((c) => getCategory(c).label).join(" · ")} · ${p.year}` : undefined,
    color: p?.color,
  });
}
