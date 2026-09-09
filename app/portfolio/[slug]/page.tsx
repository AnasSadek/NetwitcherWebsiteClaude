import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
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

/** Thema für den Anfrage-Dialog, passend zur Projektkategorie. */
const CTA_TOPIC: Record<string, string> = {
  web: "Website",
  ecommerce: "Shop",
  "social-video": "Social Media",
  photo: "Fotoshooting",
  design: "Branding",
  software: "Software",
  ai: "Software",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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
        <ProjectHeader project={project} />

        {/* Auftaktbild: die Komposition des Projekts, gross */}
        <div className="mx-auto mt-12 max-w-[1500px] px-5 sm:px-8 md:mt-16">
          <Reveal>
            <ProjectVisual project={project} priority sizes="(min-width: 1500px) 1400px, 100vw" />
          </Reveal>
        </div>

        <div className="mt-6 md:mt-10">
          {project.story?.length ? <ProjectStory story={project.story} /> : null}
          {kind === "website" && project.website ? <WebsiteShowcase project={project} /> : null}
          {project.videos?.length ? <VideoShowcase project={project} /> : null}
          {project.screens?.length ? <ScreensShowcase project={project} /> : null}
          {project.images?.length ? <ImageGallery project={project} /> : null}
          {project.socialPosts?.length ? <SocialGallery project={project} /> : null}
          {project.posters?.length ? <PosterGallery project={project} /> : null}
          {project.results?.length ? <ProjectResults project={project} /> : null}
          {project.testimonial ? <ProjectTestimonial project={project} /> : null}
          <ProjectLinks project={project} />
        </div>

        <NextProject next={next} prev={prev} />
      </article>
      <PortfolioCTA service={CTA_TOPIC[project.categories[0]]} />
    </>
  );
}
