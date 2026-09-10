import type { PortfolioProject } from "@/lib/portfolio";
import { projectKind } from "@/lib/portfolio";
import { BrowserFrame, PhoneFrame } from "./Frames";
import { Placeholder } from "./Placeholder";
import { SmartImage } from "./SmartImage";

const mono = (client: string) => client.trim().charAt(0).toUpperCase();

/**
 * Die grosse Komposition eines Projekts, abhängig davon, was es ist:
 *   website  → Browser + Smartphone, versetzt
 *   video    → drei Reels als Fächer
 *   software → Hauptscreen + überlappender Zweitscreen
 *   visual   → Cover mit Begleitbild
 * Reine Darstellung, keine Player: die Bühne lädt kein Video vorab.
 */
export function ProjectVisual({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  project: PortfolioProject;
  priority?: boolean;
  sizes?: string;
}) {
  const kind = projectKind(project);
  const m = mono(project.client);

  if (kind === "website" && project.website) {
    const { desktop, mobile, url } = project.website;
    return (
      <div className="relative pr-[14%] pb-[8%] sm:pr-[18%]">
        <BrowserFrame
          image={desktop ?? project.cover}
          color={project.color}
          url={url}
          sizes={sizes}
          priority={priority}
          monogram={m}
        />
        <div className="absolute bottom-0 right-0 w-[30%] max-w-[210px] sm:w-[27%]">
          <PhoneFrame
            image={mobile ?? { alt: `${project.client}, mobile Ansicht` }}
            color={project.color}
            sizes="(min-width: 1024px) 14vw, 30vw"
            monogram={m}
          />
        </div>
      </div>
    );
  }

  if (kind === "video" && project.videos?.length) {
    const reels = project.videos.filter((v) => (v.ratio ?? "9/16") === "9/16").slice(0, 3);
    const items = reels.length ? reels : project.videos.slice(0, 3);
    return (
      <div className="flex items-end justify-center gap-3 px-2 sm:gap-5">
        {items.map((v, i) => {
          const center = items.length === 3 ? i === 1 : i === 0;
          return (
            <div
              key={v.title + i}
              className={`relative w-[38%] max-w-[240px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 md:rounded-3xl ${
                center ? "z-10 scale-[1.06] md:w-[36%]" : i === 0 ? "-rotate-3 translate-y-4" : "rotate-3 translate-y-4"
              }`}
              style={{ aspectRatio: "9 / 16" }}
            >
              {v.poster ? (
                <SmartImage
                  image={{ src: v.poster, alt: v.title, ratio: "9/16" }}
                  color={project.color}
                  ratio="9/16"
                  sizes="(min-width: 1024px) 18vw, 38vw"
                  priority={priority && center}
                  rounded="rounded-none"
                />
              ) : (
                <Placeholder color={project.color} kind="video" ratio="9:16" monogram={center ? m : undefined} />
              )}
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                {v.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "software" && project.screens?.length) {
    const [main, second] = project.screens;
    return (
      <div className="relative pb-[10%] pr-[10%]">
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] md:rounded-3xl">
          <SmartImage
            image={main}
            color={project.color}
            ratio="16/10"
            sizes={sizes}
            priority={priority}
            monogram={m}
            label={main.caption ?? "Screenshot folgt"}
            rounded="rounded-none"
          />
        </div>
        {second && (
          <div className="absolute bottom-0 right-0 w-[46%] overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] md:rounded-2xl">
            <SmartImage
              image={second}
              color={project.color}
              ratio={second.ratio === "9/16" ? "9/16" : "16/10"}
              sizes="(min-width: 1024px) 28vw, 46vw"
              label={second.caption ?? "Screenshot folgt"}
              rounded="rounded-none"
              className={second.ratio === "9/16" ? "max-h-[70%]" : ""}
            />
          </div>
        )}
      </div>
    );
  }

  const companion = project.images?.[0] ?? project.posters?.[0] ?? project.socialPosts?.[0];
  return (
    <div className="relative pb-[8%] pr-[12%]">
      <SmartImage
        image={project.cover}
        color={project.color}
        sizes={sizes}
        priority={priority}
        monogram={m}
        rounded="rounded-2xl md:rounded-3xl"
        className="shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
      />
      {companion && (
        <SmartImage
          image={companion}
          color={project.color}
          ratio="4/5"
          sizes="(min-width: 1024px) 18vw, 36vw"
          rounded="rounded-xl md:rounded-2xl"
          className="absolute bottom-0 right-0 w-[34%] border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
        />
      )}
    </div>
  );
}
