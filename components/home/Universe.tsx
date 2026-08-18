import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";

/**
 * „Fünf Farben, ein Universum" — die Disziplinen als Logo-System.
 * Jeder Arm des Sterns steht für ein Feld. Asymmetrisches Raster:
 * zwei grosse Felder (Content, Marketing) tragen das Geschäft,
 * drei kompakte ergänzen es. Kein 3-Spalten-Karten-Einerlei.
 */

type Field = {
  color: keyof typeof ARROW_COLORS;
  bg: string;
  title: string;
  copy: string;
  items: string[];
  href: string;
  big?: boolean;
};

const FIELDS: Field[] = [
  {
    color: "pink",
    bg: "#fdeef5",
    title: "Content & Studio",
    copy: "Foto, Video und Reels aus dem eigenen Studio in Berlin. Geplant, produziert, geschnitten.",
    items: ["Produktfotografie", "Reels & Short Video", "Werbevideo", "Creative Direction"],
    href: "/studio",
    big: true,
  },
  {
    color: "sky",
    bg: "#e9f7fd",
    title: "Social & Ads",
    copy: "Wir bringen Content zu den richtigen Menschen: organisch und bezahlt.",
    items: ["Social Media Management", "Meta Ads", "TikTok Ads", "Google Ads"],
    href: "/leistungen/performance-marketing",
    big: true,
  },
  {
    color: "mint",
    bg: "#e9fbf7",
    title: "Web & Shops",
    copy: "Websites und E-Commerce, gebaut auf Anfragen.",
    items: ["Webdesign", "Landingpages", "E-Commerce"],
    href: "/leistungen/webdesign-ecommerce",
  },
  {
    color: "violet",
    bg: "#f1ecfd",
    title: "Software & KI",
    copy: "Individuelle Tools, Portale und Automatisierung.",
    items: ["Softwareentwicklung", "KI-Workflows", "Technischer Support"],
    href: "/leistungen/softwareentwicklung",
  },
  {
    color: "sun",
    bg: "#fdf8e4",
    title: "Brand & Design",
    copy: "Logo, Design-System und Print, die wiedererkennbar machen.",
    items: ["Branding", "Design-Systeme", "Print"],
    href: "/leistungen/branding-design",
  },
];

function FieldCard({ f, delay }: { f: Field; delay: number }) {
  const hex = ARROW_COLORS[f.color];
  return (
    <Reveal delay={delay} className={f.big ? "md:col-span-3" : "md:col-span-2"}>
      <Link
        href={f.href}
        className="group relative flex h-full flex-col overflow-hidden rounded-card p-7 transition-transform duration-300 hover:-translate-y-1 md:p-8"
        style={{ background: f.bg }}
      >
        {/* Logo-Arm als Wasserzeichen */}
        <svg
          width={f.big ? 150 : 110}
          height={f.big ? 150 : 110}
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute -right-6 -top-6 opacity-[0.16] transition-transform duration-500 group-hover:rotate-[14deg] group-hover:scale-110"
        >
          <path d={ARROW_PATH} fill={hex} />
        </svg>

        <svg width="26" height="26" viewBox="0 0 100 100" aria-hidden="true">
          <path d={ARROW_PATH} fill={hex} />
        </svg>
        <h3 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-ink">
          {f.title}
        </h3>
        <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-ink-2">{f.copy}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {f.items.map((it) => (
            <li
              key={it}
              className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-ink-2"
            >
              {it}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-heading text-xs font-bold uppercase tracking-[0.15em] text-ink">
          Mehr dazu
          <svg
            width="10"
            height="10"
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <path d={ARROW_PATH} fill={hex} transform="rotate(90 50 50)" />
          </svg>
        </span>
      </Link>
    </Reveal>
  );
}

export function Universe() {
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="universum">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 id="universum" className="font-boxi text-3xl leading-[1.1] text-ink md:text-5xl">
              FÜNF FARBEN.
              <br />
              EIN UNIVERSUM.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">
              Jeder Arm unseres Sterns steht für eine Disziplin. Zusammen sind
              sie ein System: Content entsteht, wird verbreitet und landet dort,
              wo aus Aufmerksamkeit Anfragen werden.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-6">
          {FIELDS.map((f, i) => (
            <FieldCard key={f.title} f={f} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
