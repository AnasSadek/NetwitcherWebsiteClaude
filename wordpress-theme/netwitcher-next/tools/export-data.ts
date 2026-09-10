// Exports the Next.js content modules to JSON for the WordPress theme.
// Run: node tools/export-data.mjs (bundles this file with esbuild first).
import { site, defaultWhatsappText } from "../../../lib/site";
import { services } from "../../../lib/services";
import { cases } from "../../../lib/cases";
import { blogPosts } from "../../../lib/blog";
import { PORTFOLIO_CATEGORIES, portfolioProjects } from "../../../lib/portfolio";
import { media } from "../../../lib/media";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.env.NW_DATA_OUT ?? join(process.cwd(), "data");
mkdirSync(out, { recursive: true });
const w = (name: string, data: unknown) => writeFileSync(join(out, name), JSON.stringify(data, null, 1) + "\n");
w("site.json", { ...site, defaultWhatsappText });
w("services.json", services);
w("cases.json", cases);
w("blog.json", blogPosts);
w("portfolio.json", { categories: PORTFOLIO_CATEGORIES, projects: portfolioProjects });
w("media.json", media);
console.log("exported", Object.keys({ site, services, cases, blogPosts, portfolioProjects, media }).join(", "));
