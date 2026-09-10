# Netwitcher Next – experimental WordPress theme

**Status: feasibility experiment. Not deployed, not wired into the Next.js build.**
The production site stays the Next.js app in the repository root. This theme is a
1:1 port used only to benchmark "WordPress vs. Next.js/Vercel" (see
`docs/07-wordpress-feasibility.md`).

## Layout

| Path | Purpose | Next.js counterpart |
| --- | --- | --- |
| `functions.php`, `inc/*.php` | bootstrap, data loader, helpers, assets, SEO, CPT, seeding | `app/layout.tsx`, `lib/*`, `components/*` |
| `data/*.json` | content exported from `lib/*.ts` via `tools/export-data.ts` | `lib/site.ts`, `services.ts`, `cases.ts`, `blog.ts`, `portfolio.ts`, `media.ts` |
| `src/app.css` → `assets/css/app.css` | Tailwind v4 source (same `@theme` tokens as `app/globals.css`) | `app/globals.css` |
| `src/js/*.js` → `assets/js/*.js` | vanilla ES-module ports of the client components (esbuild) | Framer-Motion components |
| `header.php`, `footer.php` | shell | `components/Header.tsx`, `Footer.tsx`, `WhatsAppButton.tsx` |
| `front-page.php`, `parts/home/*` | start page | `app/page.tsx`, `components/home/*`, `components/mascot/*` |
| `templates/page-*.php` | page templates, assigned on seeding | `app/**/page.tsx` |
| `archive-portfolio.php`, `single-portfolio.php`, `parts/portfolio/*` | portfolio (custom post type `portfolio`) | `app/portfolio/*`, `components/portfolio/*` |
| `home.php`, `single.php` | blog index / post | `app/blog/*` |

## Conventions for porting a React component

1. **Markup and Tailwind classes are copied verbatim** from the TSX. Tailwind v4 scans
   `**/*.php` and `src/js/**/*.js`, so any class used in PHP/JS is generated. Do not
   invent new class names when a Next.js class exists.
2. `Link href="/x"` → `<a href="<?php echo esc_url(nw_url('/x')); ?>">`. `nw_url()` maps
   Next.js paths (incl. `?query` and `#hash`) to WordPress URLs.
3. Static files: `/media/x.avif` → `nw_media_url('/media/x.avif')`; theme files →
   `nw_asset('brand/star.svg')`.
4. Helpers (in `inc/helpers.php`) replace shared components:
   `nw_star($size,$class)` = `<BrandStar/>`, `nw_wordmark()` = `<BrandWordmark/>`,
   `nw_arrow($color,$size,$rotation,$class)` = `<Arrow/>`/inline arrow SVGs,
   `nw_button($href,$label,$variant,$class,$opts)` = `<ButtonLink/>`,
   `nw_arrow_link()` = `<ArrowLink/>`, `nw_reveal_open($class,$delay,$tag)` /
   `nw_reveal_close($tag)` = `<Reveal/>`, `nw_section_heading([...])` =
   `<SectionHeading/>`, `nw_picture($asset,$class,$sizes,$priority)` = `<Media/>`,
   `nw_service_icon($icon)`, `nw_service_card($service,$delay)`, `nw_case_card($case,$delay)`,
   `nw_final_cta($title,$text)` = `<FinalCTA/>`.
5. Data: `nw_site()`, `nw_services()`, `nw_leistungen_services()`, `nw_service($slug)`,
   `nw_cases()`, `nw_media($key)`, `nw_data('blog')`; portfolio via `nw_projects()`,
   `nw_project_data($post_id)`, `nw_portfolio_categories()`, `nw_categories_in_use()`,
   `nw_adjacent_projects($slug)`, `nw_project_kind($p)`, `nw_ratio_value($r)`.
6. Client behaviour goes into `src/js/<bundle>.js` (plain ES modules, no framework;
   `src/js/spring.js` provides a Framer-compatible spring). Discrete animations
   (enter/exit, keyframes) are CSS in `src/app.css` under `@layer components`,
   toggled by classes. Respect `prefers-reduced-motion` like the original.
7. Escape all output (`esc_html`, `esc_attr`, `esc_url`); content from `data/*.json`
   is trusted markup only where the Next.js source rendered it as JSX.
8. Build: `NW_NODE_BIN=<node_modules/.bin with tailwindcss+esbuild> node tools/build.mjs`.

## Local run (experiment)

WordPress + SQLite drop-in under PHP's built-in server; theme symlinked into
`wp-content/themes/netwitcher-next`; activation seeds all pages/posts/projects
(`inc/setup-content.php`).
