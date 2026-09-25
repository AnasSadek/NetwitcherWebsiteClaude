import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { getDict } from "@/lib/i18n/dictionary";
import { FeaturedGallery } from "@/components/portfolio/FeaturedGallery";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { ProjectBrandStatement } from "@/components/portfolio/ProjectBrandStatement";
import { ProjectClients } from "@/components/portfolio/ProjectClients";
import { ProjectFeatures } from "@/components/portfolio/ProjectFeatures";
import { ProjectReels } from "@/components/portfolio/ProjectReels";
import { ProjectServices } from "@/components/portfolio/ProjectServices";
import { ProjectVisual } from "@/components/portfolio/ProjectVisual";
import {
  ImageGallery,
  NextProject,
  PosterGallery,
  ProjectHeader,
  ProjectLinks,
  ProjectResults,
  ProjectStory,
  ScreenChapters,
  ScreensShowcase,
  SocialGallery,
  VideoShowcase,
  WebsiteShowcase,
} from "@/components/portfolio/ProjectSections";
import { ProjectTestimonial } from "@/components/portfolio/ProjectSections";
import { projectKind } from "@/lib/portfolio";
import { adjacentProjectsAr, getCategoryAr, getProjectAr, portfolioProjectsAr } from "@/lib/portfolio.ar";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return portfolioProjectsAr.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectAr(slug);
  if (!p) return {};
  const title = `${p.client}: ${p.title}`;
  const description = p.description;
  return {
    title,
    description,
    alternates: { canonical: `/ar/portfolio/${p.slug}` },
    openGraph: {
      type: "article",
      title: `${title} | نتويتشر`,
      description,
      url: `/ar/portfolio/${p.slug}`,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProjectPageAr({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectAr(slug);
  if (!project) notFound();

  const t = getDict("ar");
  const kind = projectKind(project);
  const { prev, next } = adjacentProjectsAr(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.client}: ${project.title}`,
    description: project.description,
    url: `${site.url}/ar/portfolio/${project.slug}`,
    dateCreated: String(project.year),
    genre: project.categories.map((c) => getCategoryAr(c).label),
    creator: { "@type": "Organization", name: site.name, url: site.url },
    ...(project.client !== site.name ? { sourceOrganization: { "@type": "Organization", name: project.client } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <ProjectHeader project={project} locale="ar" />

        {/* Auftaktbild: die Komposition des Projekts, gross */}
        <div className="mx-auto mt-12 max-w-[1500px] px-5 sm:px-8 md:mt-16">
          <Reveal>
            <ProjectVisual project={project} priority sizes="(min-width: 1500px) 1400px, 100vw" locale="ar" />
          </Reveal>
        </div>

        <div className="mt-6 md:mt-10">
          {project.story?.length ? <ProjectStory story={project.story} locale="ar" /> : null}
          {kind === "website" && project.website ? <WebsiteShowcase project={project} locale="ar" /> : null}
          {project.videos?.length ? <VideoShowcase project={project} locale="ar" /> : null}
          {project.features ? <ProjectFeatures project={project} locale="ar" /> : null}
          {project.gallery?.length ? (
            <FeaturedGallery project={project} locale="ar" />
          ) : project.screenSections?.length ? (
            <ScreenChapters project={project} locale="ar" />
          ) : project.screens?.length && !project.hideScreensShowcase ? (
            <ScreensShowcase project={project} locale="ar" />
          ) : null}
          {project.images?.length ? <ImageGallery project={project} locale="ar" /> : null}
          {project.socialPosts?.length ? <SocialGallery project={project} locale="ar" /> : null}
          {project.posters?.length ? <PosterGallery project={project} locale="ar" /> : null}
          {project.results?.length ? <ProjectResults project={project} locale="ar" /> : null}
          {project.testimonial ? <ProjectTestimonial project={project} /> : null}
          <ProjectLinks project={project} locale="ar" />
          {project.servicesSection ? <ProjectServices project={project} /> : null}
          {project.reelsSection ? <ProjectReels project={project} locale="ar" /> : null}
          {project.clientsSection ? <ProjectClients project={project} locale="ar" /> : null}
          {project.brandStatement ? <ProjectBrandStatement project={project} /> : null}
        </div>

        {project.hideNextProject ? null : <NextProject next={next} prev={prev} locale="ar" />}
      </article>
      <PortfolioCTA service={project.categories[0] ? t.portfolio.ctaTopics[project.categories[0]] : undefined} locale="ar" />
    </>
  );
}
