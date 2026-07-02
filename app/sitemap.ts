import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { leistungenServices } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "/leistungen",
    "/studio",
    "/projekte",
    "/ueber-uns",
    "/produkte/fekrahub",
    "/blog",
    "/kontakt",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = leistungenServices.map((s) => ({
    url: `${site.url}${s.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const posts = blogPosts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...posts];
}
