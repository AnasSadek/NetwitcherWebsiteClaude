import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import type { PortfolioProject } from "@/lib/portfolio";

/** Schmale Zeile mit den Marken aus dem Portfolio. Logo, wenn vorhanden, sonst Name. */
export function ClientStrip({ projects }: { projects: PortfolioProject[] }) {
  const seen = new Set<string>();
  const clients = projects.filter((p) => (seen.has(p.client) ? false : (seen.add(p.client), true)));
  if (clients.length < 2) return null;
  return (
    <section className="border-y border-white/[0.07] py-10 md:py-12" aria-label="Marken, mit denen wir arbeiten">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
            <p className="shrink-0 font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
              Marken, mit denen wir arbeiten
            </p>
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-4 md:justify-end md:flex-1">
              {clients.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/portfolio/${c.slug}`}
                    className="block text-white/55 transition-colors hover:text-white"
                    aria-label={`${c.client} ansehen`}
                  >
                    {c.logo ? (
                      <Image src={c.logo} alt={c.client} width={120} height={36} className="h-7 w-auto object-contain opacity-80" />
                    ) : (
                      <span className="font-heading text-lg font-extrabold uppercase tracking-[0.12em]">{c.client}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
