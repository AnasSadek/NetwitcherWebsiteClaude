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
  ProjectTestimonial,
  ScreenChapters,
  ScreensShowcase,
  SocialGallery,
  VideoShowcase,
  WebsiteShowcase,
} from "@/components/portfolio/ProjectSections";
import { adjacentProjects, getCategory, getProject, portfolioProjects, projectKind } from "@/lib/portfolio";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.client}: ${p.title}`;
  const description = p.description;
  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${p.slug}` },
    openGraph: {
      type: "article",
      title: `${title} | Netwitcher`,
      description,
      url: `/portfolio/${p.slug}`,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const t = getDict("de");
  const kind = projectKind(project);
  const { prev, next } = adjacentProjects(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.client}: ${project.title}`,
    description: project.description,
    url: `${site.url}/portfolio/${project.slug}`,
    dateCreated: String(project.year),
    genre: project.categories.map((c) => getCategory(c).label),
    creator: { "@type": "Organization", name: site.name, url: site.url },
    ...(project.client !== site.name ? { sourceOrganization: { "@type": "Organization", name: project.client } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <ProjectHeader project={project} locale="de" />

        {/* Auftaktbild: die Komposition des Projekts, gross */}
        <div className="mx-auto mt-12 max-w-[1500px] px-5 sm:px-8 md:mt-16">
          <Reveal>
            <ProjectVisual project={project} priority sizes="(min-width: 1500px) 1400px, 100vw" locale="de" />
          </Reveal>
        </div>

        <div className="mt-6 md:mt-10">
          {project.story?.length ? <ProjectStory story={project.story} locale="de" /> : null}
          {kind === "website" && project.website ? <WebsiteShowcase project={project} locale="de" /> : null}
          {project.videos?.length ? <VideoShowcase project={project} locale="de" /> : null}
          {project.features ? <ProjectFeatures project={project} locale="de" /> : null}
          {project.gallery?.length ? (
            <FeaturedGallery project={project} locale="de" />
          ) : project.screenSections?.length ? (
            <ScreenChapters project={project} locale="de" />
          ) : project.screens?.length && !project.hideScreensShowcase ? (
            <ScreensShowcase project={project} locale="de" />
          ) : null}
          {project.images?.length ? <ImageGallery project={project} locale="de" /> : null}
          {project.socialPosts?.length ? <SocialGallery project={project} locale="de" /> : null}
          {project.posters?.length ? <PosterGallery project={project} locale="de" /> : null}
          {project.results?.length ? <ProjectResults project={project} locale="de" /> : null}
          {project.testimonial ? <ProjectTestimonial project={project} /> : null}
          <ProjectLinks project={project} locale="de" />
          {project.servicesSection ? <ProjectServices project={project} /> : null}
          {project.reelsSection ? <ProjectReels project={project} locale="de" /> : null}
          {project.clientsSection ? <ProjectClients project={project} locale="de" /> : null}
          {project.brandStatement ? <ProjectBrandStatement project={project} /> : null}
        </div>

        {project.hideNextProject ? null : <NextProject next={next} prev={prev} locale="de" />}
      </article>
      <PortfolioCTA service={project.categories[0] ? t.portfolio.ctaTopics[project.categories[0]] : undefined} locale="de" />
    </>
  );
}
