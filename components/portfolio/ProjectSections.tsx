import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import type { MediaImage, MediaVideo, PortfolioProject } from "@/lib/portfolio";
import { getCategory } from "@/lib/portfolio";
import { BoxiTitle } from "./BoxiTitle";
import { BrowserFrame, PhoneFrame } from "./Frames";
import { SmartImage } from "./SmartImage";
import { VideoPlayer } from "./VideoPlayer";

/* Gemeinsame Bausteine der Case-Study-Seite. Jeder Abschnitt rendert nur,
   wenn das Projekt die passenden Daten hat – die Seite baut sich selbst. */

export function SectionTitle({ kicker, title, id }: { kicker?: string; title: string; id: string }) {
  return (
    <Reveal>
      <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
        <h2 id={id} className="font-boxi text-2xl leading-none text-white md:text-4xl">
          {title}
        </h2>
        {kicker && (
          <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">{kicker}</p>
        )}
      </div>
    </Reveal>
  );
}

const Wrap = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <section aria-labelledby={id} className="py-14 md:py-20">
    <div className="mx-auto max-w-[1500px] px-5 sm:px-8">{children}</div>
  </section>
);

/* ------------------------------ Kopf ---------------------------------- */

export function ProjectHeader({ project }: { project: PortfolioProject }) {
  const hex = ARROW_COLORS[project.color];
  return (
    <header className="relative overflow-hidden pt-28 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[80vh]"
        style={{ background: `radial-gradient(60% 50% at 30% 0%, ${hex}30, transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <nav aria-label="Brotkrumen" className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
            <Link href="/portfolio" className="transition-colors hover:text-white">
              Portfolio
            </Link>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="text-white/80">{project.client}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-8">
              <p className="flex items-center gap-2.5 font-heading text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hex }} />
                {project.client}
                <span className="text-white/25">·</span>
                <span className="text-white/45">{project.year}</span>
              </p>
              <div className="mt-5">
                <BoxiTitle as="h1" lines={[project.title]} max="5.5rem" min="1.375rem" className="text-white" />
              </div>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p className="text-base leading-relaxed text-white/70 md:text-lg">{project.description}</p>
              {project.placeholder && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  Vorschau · Inhalte folgen
                </p>
              )}
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 md:grid-cols-4">
            <div>
              <dt className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Leistungen</dt>
              <dd className="mt-2 text-sm font-semibold text-white/85">{project.services.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Bereich</dt>
              <dd className="mt-2 text-sm font-semibold text-white/85">
                {project.categories.map((c) => getCategory(c).label).join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Jahr</dt>
              <dd className="mt-2 text-sm font-semibold text-white/85">{project.year}</dd>
            </div>
            <div className="flex items-end md:justify-end">
              {project.website?.url ? (
                <a
                  href={project.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-ink transition-colors hover:bg-paper-2"
                >
                  Website besuchen
                  <svg width="10" height="10" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
                  </svg>
                </a>
              ) : project.links?.[0] ? (
                <Link
                  href={project.links[0].href}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-ink transition-colors hover:bg-paper-2"
                >
                  {project.links[0].label}
                  <svg width="10" height="10" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    <path d={ARROW_PATH} fill="currentColor" transform="rotate(90 50 50)" />
                  </svg>
                </Link>
              ) : null}
            </div>
          </dl>
        </Reveal>
      </div>
    </header>
  );
}

/* ------------------------------ Story --------------------------------- */

export function ProjectStory({ story }: { story: NonNullable<PortfolioProject["story"]> }) {
  return (
    <Wrap id="story">
      <h2 id="story" className="sr-only">
        Über das Projekt
      </h2>
      <div className="grid gap-10 md:grid-cols-12">
        {story.map((s, i) => (
          <Reveal key={s.heading} delay={i * 0.08} className="md:col-span-6 lg:col-span-5 lg:odd:col-start-2">
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              {String(i + 1).padStart(2, "0")} · {s.heading}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/80 md:text-xl">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </Wrap>
  );
}

/* ------------------------------ Website ------------------------------- */

export function WebsiteShowcase({ project }: { project: PortfolioProject }) {
  const w = project.website!;
  const m = project.client.charAt(0);
  return (
    <Wrap id="website">
      <SectionTitle id="website" title="DIE WEBSITE." kicker={w.url?.replace(/^https?:\/\//, "")} />
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-9">
          <BrowserFrame image={w.desktop ?? project.cover} color={project.color} url={w.url} sizes="(min-width: 1500px) 1100px, 100vw" monogram={m} />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto w-[56%] max-w-[260px] lg:col-span-3 lg:mt-12 lg:w-full lg:max-w-none">
          <PhoneFrame image={w.mobile ?? { alt: `${project.client}, mobile Ansicht` }} color={project.color} sizes="(min-width: 1024px) 22vw, 56vw" monogram={m} />
        </Reveal>
      </div>
      {w.url && (
        <Reveal>
          <div className="mt-8 flex justify-center">
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border-2 border-white/15 px-6 py-3 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              Website besuchen
              <svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                <path d={ARROW_PATH} fill={ARROW_COLORS[project.color]} transform="rotate(90 50 50)" />
              </svg>
            </a>
          </div>
        </Reveal>
      )}
    </Wrap>
  );
}

/* ------------------------------ Video --------------------------------- */

export function VideoShowcase({ project }: { project: PortfolioProject }) {
  const videos = project.videos ?? [];
  const reels = videos.filter((v) => (v.ratio ?? "9/16") === "9/16" || v.ratio === "4/5");
  const wide = videos.filter((v) => !reels.includes(v));
  const m = project.client.charAt(0);
  return (
    <Wrap id="video">
      <SectionTitle id="video" title={reels.length ? "REELS & VIDEOS." : "VIDEO."} kicker="Tippen zum Abspielen" />
      {reels.length > 0 && (
        <div className="-mx-5 sm:-mx-8">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 md:gap-6">
            {reels.map((v, i) => (
              <li key={v.title + i} className="w-[72%] shrink-0 snap-center sm:w-[44%] md:w-[30%] lg:w-[22%] xl:w-[19%]">
                <VideoPlayer video={v} color={project.color} monogram={m} rounded="rounded-2xl md:rounded-3xl" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {wide.length > 0 && (
        <div className={`grid gap-6 ${reels.length ? "mt-10" : ""} ${wide.length > 1 ? "md:grid-cols-2" : ""}`}>
          {wide.map((v, i) => (
            <Reveal key={v.title + i}>
              <VideoPlayer video={v} color={project.color} monogram={m} sizes="(min-width: 1500px) 1400px, 100vw" rounded="rounded-2xl md:rounded-3xl" />
            </Reveal>
          ))}
        </div>
      )}
    </Wrap>
  );
}

/* ------------------------------ Galerien ------------------------------ */

function Masonry({ items, color, monogram, sizes }: { items: MediaImage[]; color: PortfolioProject["color"]; monogram: string; sizes: string }) {
  return (
    <div className="columns-2 gap-4 md:columns-3 md:gap-6 [&>*]:mb-4 md:[&>*]:mb-6">
      {items.map((img, i) => (
        <Reveal key={i} delay={Math.min(i * 0.05, 0.25)} className="break-inside-avoid">
          <figure>
            <SmartImage image={img} color={color} sizes={sizes} monogram={monogram} rounded="rounded-xl md:rounded-2xl" />
            {img.caption && <figcaption className="mt-2 text-xs text-white/45">{img.caption}</figcaption>}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function ImageGallery({ project }: { project: PortfolioProject }) {
  return (
    <Wrap id="bilder">
      <SectionTitle id="bilder" title="BILDER." kicker={`${project.images!.length} Motive`} />
      <Masonry items={project.images!} color={project.color} monogram={project.client.charAt(0)} sizes="(min-width: 768px) 33vw, 50vw" />
    </Wrap>
  );
}

export function PosterGallery({ project }: { project: PortfolioProject }) {
  return (
    <Wrap id="print">
      <SectionTitle id="print" title="POSTER & PRINT." />
      <Masonry items={project.posters!} color={project.color} monogram={project.client.charAt(0)} sizes="(min-width: 768px) 33vw, 50vw" />
    </Wrap>
  );
}

export function SocialGallery({ project }: { project: PortfolioProject }) {
  const m = project.client.charAt(0);
  return (
    <Wrap id="social">
      <SectionTitle id="social" title="SOCIAL MEDIA." kicker="Feed-Auswahl" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {project.socialPosts!.map((img, i) => (
          <Reveal as="li" key={i} delay={Math.min(i * 0.05, 0.25)}>
            <SmartImage image={img} color={project.color} ratio={img.ratio ?? "4/5"} sizes="(min-width: 1024px) 25vw, 50vw" monogram={m} rounded="rounded-xl md:rounded-2xl" label="Post folgt" />
          </Reveal>
        ))}
      </ul>
    </Wrap>
  );
}

/* ------------------------------ Software ------------------------------ */

export function ScreensShowcase({ project }: { project: PortfolioProject }) {
  const screens = project.screens!;
  const m = project.client.charAt(0);
  const wide = screens.filter((s) => s.ratio !== "9/16");
  const phones = screens.filter((s) => s.ratio === "9/16");
  return (
    <Wrap id="produkt">
      <SectionTitle id="produkt" title="DAS PRODUKT." kicker={project.tech?.length ? project.tech.join(" · ") : undefined} />
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        {wide.map((s, i) => (
          <Reveal key={i} delay={0.05} className={i === 0 ? "md:col-span-12" : "md:col-span-6"}>
            <figure>
              <div className="overflow-hidden rounded-2xl border border-white/10 md:rounded-3xl">
                <SmartImage
                  image={s}
                  color={project.color}
                  ratio="16/10"
                  sizes={i === 0 ? "(min-width: 1500px) 1400px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                  monogram={m}
                  label={s.caption ? `${s.caption} · Screenshot folgt` : "Screenshot folgt"}
                  rounded="rounded-none"
                />
              </div>
              {s.caption && (
                <figcaption className="mt-3 font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{s.caption}</figcaption>
              )}
            </figure>
          </Reveal>
        ))}
        {phones.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 md:col-span-12 md:gap-10">
            {phones.map((s, i) => (
              <Reveal key={i} delay={i * 0.08} className="w-[58%] max-w-[260px] sm:w-[40%] md:w-[24%]">
                <figure>
                  <PhoneFrame image={s} color={project.color} sizes="(min-width: 768px) 24vw, 58vw" monogram={m} label={s.caption ? `${s.caption} · folgt` : undefined} />
                  {s.caption && (
                    <figcaption className="mt-3 text-center font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{s.caption}</figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Wrap>
  );
}

/* ------------------------------ Ergebnisse ---------------------------- */

export function ProjectResults({ project }: { project: PortfolioProject }) {
  const hex = ARROW_COLORS[project.color];
  return (
    <Wrap id="ergebnisse">
      <SectionTitle id="ergebnisse" title="ERGEBNIS." />
      <dl className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {project.results!.map((r, i) => (
          <Reveal key={r.label} delay={i * 0.06} className="bg-void-2 p-7 md:p-9">
            <dd className="font-boxi text-4xl leading-none md:text-5xl" style={{ color: hex }}>
              {r.value}
            </dd>
            <dt className="mt-3 text-sm text-white/60">{r.label}</dt>
          </Reveal>
        ))}
      </dl>
    </Wrap>
  );
}

export function ProjectTestimonial({ project }: { project: PortfolioProject }) {
  const t = project.testimonial!;
  return (
    <Wrap id="stimme">
      <Reveal>
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-heading text-2xl font-bold leading-snug text-white md:text-3xl">
            „{t.quote}"
          </blockquote>
          <figcaption className="mt-6 text-sm text-white/55">
            <span className="font-semibold text-white/80">{t.name}</span>
            {t.role && <> · {t.role}</>}
          </figcaption>
        </figure>
      </Reveal>
    </Wrap>
  );
}

export function ProjectLinks({ project }: { project: PortfolioProject }) {
  const hex = ARROW_COLORS[project.color];
  const links = [
    ...(project.website?.url ? [{ label: "Website besuchen", href: project.website.url }] : []),
    ...(project.links ?? []),
  ];
  if (!links.length) return null;
  return (
    <Wrap>
      <Reveal>
        <ul className="flex flex-wrap justify-center gap-3">
          {links.map((l) => {
            const ext = l.href.startsWith("http");
            const cls =
              "group inline-flex items-center gap-2.5 rounded-full border-2 border-white/15 px-6 py-3 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:border-white/50 hover:bg-white/5";
            const arrow = (
              <svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                <path d={ARROW_PATH} fill={hex} transform="rotate(90 50 50)" />
              </svg>
            );
            return (
              <li key={l.href}>
                {ext ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {l.label} {arrow}
                  </a>
                ) : (
                  <Link href={l.href} className={cls}>
                    {l.label} {arrow}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Wrap>
  );
}

/* ------------------------------ Nächstes Projekt ---------------------- */

export function NextProject({ next, prev }: { next: PortfolioProject; prev: PortfolioProject }) {
  const hex = ARROW_COLORS[next.color];
  return (
    <section className="py-14 md:py-20" aria-labelledby="next">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p id="next" className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">
              Nächstes Projekt
            </p>
            <div className="flex items-center gap-5 font-heading text-[11px] font-bold uppercase tracking-[0.2em]">
              {prev.slug !== next.slug && (
                <Link href={`/portfolio/${prev.slug}`} className="text-white/45 transition-colors hover:text-white">
                  ← {prev.client}
                </Link>
              )}
              <Link href="/portfolio" className="text-white/45 transition-colors hover:text-white">
                Alle Projekte
              </Link>
            </div>
          </div>
          <Link
            href={`/portfolio/${next.slug}`}
            className="group relative block overflow-hidden rounded-[28px] border border-white/[0.08] bg-void-2 md:rounded-[40px]"
            style={{ backgroundImage: `radial-gradient(70% 80% at 100% 0%, ${hex}26, transparent 60%)` }}
          >
            <div className="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-12 md:p-10 lg:p-14">
              <div className="min-w-0 md:col-span-7">
                <p className="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
                  {next.client}
                </p>
                <div className="mt-4">
                  <BoxiTitle as="p" lines={[next.title]} max="3.75rem" min="1.1rem" className="text-white" />
                </div>
                <span className="mt-8 inline-flex items-center gap-2.5 font-heading text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition-colors group-hover:text-white">
                  Ansehen
                  <svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d={ARROW_PATH} fill={hex} transform="rotate(90 50 50)" />
                  </svg>
                </span>
              </div>
              <div className="md:col-span-5">
                <SmartImage
                  image={next.cover}
                  color={next.color}
                  ratio="4/3"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  monogram={next.client.charAt(0)}
                  rounded="rounded-2xl md:rounded-3xl"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export type { MediaVideo };
