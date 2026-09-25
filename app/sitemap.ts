import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { blogPostsAr } from "@/lib/blog.ar";
import { portfolioProjects } from "@/lib/portfolio";
import { portfolioProjectsAr } from "@/lib/portfolio.ar";
import { leistungenServices } from "@/lib/services";
import { leistungenServicesAr } from "@/lib/services.ar";
import { site } from "@/lib/site";

/** Jeder Eintrag bekommt via alternates.languages einen hreflang-Verweis
 *  auf die jeweils andere Sprachversion derselben Seite — beide Bäume
 *  teilen exakt dieselben Pfadsegmente (siehe lib/i18n/locale.ts), das
 *  Mapping ist daher ein reiner Präfix. */
function entry(dePath: string, opts: { lastModified?: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }) {
  const arPath = dePath === "" ? "/ar" : `/ar${dePath}`;
  return {
    url: `${site.url}${dePath}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: { de: `${site.url}${dePath}`, ar: `${site.url}${arPath}` } },
  };
}

function entryAr(arPath: string, dePath: string, opts: { lastModified?: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }) {
  return {
    url: `${site.url}/ar${arPath}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: { de: `${site.url}${dePath}`, ar: `${site.url}/ar${arPath}` } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/leistungen",
    "/studio",
    "/portfolio",
    "/projekte",
    "/ueber-uns",
    "/produkte/fekrahub",
    "/blog",
    "/kontakt",
  ];
  const staticPages = staticPaths.map((path) =>
    entry(path, { lastModified: now, changeFrequency: "monthly", priority: path === "" ? 1 : 0.8 })
  );
  const staticPagesAr = staticPaths.map((path) =>
    entryAr(path, path, { lastModified: now, changeFrequency: "monthly", priority: path === "" ? 1 : 0.8 })
  );

  const servicePages = leistungenServices.map((s) =>
    entry(s.href, { lastModified: now, changeFrequency: "monthly", priority: 0.9 })
  );
  const servicePagesAr = leistungenServicesAr.map((s) =>
    entryAr(s.href, s.href, { lastModified: now, changeFrequency: "monthly", priority: 0.9 })
  );

  const posts = blogPosts.map((p) =>
    entry(`/blog/${p.slug}`, { lastModified: new Date(p.date), changeFrequency: "yearly", priority: 0.6 })
  );
  const postsAr = blogPostsAr.map((p) =>
    entryAr(`/blog/${p.slug}`, `/blog/${p.slug}`, { lastModified: new Date(p.date), changeFrequency: "yearly", priority: 0.6 })
  );

  const projects = portfolioProjects.map((p) =>
    entry(`/portfolio/${p.slug}`, { lastModified: now, changeFrequency: "monthly", priority: 0.8 })
  );
  const projectsAr = portfolioProjectsAr.map((p) =>
    entryAr(`/portfolio/${p.slug}`, `/portfolio/${p.slug}`, { lastModified: now, changeFrequency: "monthly", priority: 0.8 })
  );

  return [
    ...staticPages,
    ...servicePages,
    ...projects,
    ...posts,
    ...staticPagesAr,
    ...servicePagesAr,
    ...projectsAr,
    ...postsAr,
  ];
}
