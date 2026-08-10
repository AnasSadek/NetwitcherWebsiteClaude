import Link from "next/link";
import { ARROW_COLORS, ARROW_PATH } from "./arrows";

/**
 * Netwitcher-Interaktionssystem.
 *
 * Eine Familie, klare Rollen — keine Universal-Pille mit Gradient:
 *  primary   solide Markenfläche, hoher Kontrast, Pfeil wandert beim Hover
 *  studio    warme Studio-Aktion (gelb), gleiche Geometrie
 *  ghost     gerahmt, zurückhaltend — Sekundäraktion
 *  link      redaktioneller Textlink mit Unterstrich-Wischer
 *  whatsapp  Messenger-Aktion in Kanalfarbe
 *
 * Geometrie: leicht gerundete Kante (4px) statt Pillenform — nimmt die
 * kantige Logo-/EP-Boxi-Sprache auf. Keine Glow-Schatten.
 */

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded font-heading text-sm font-bold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3";

const styles = {
  primary: `${base} bg-snow px-7 py-3.5 text-night hover:bg-white`,
  studio: `${base} bg-sun px-7 py-3.5 text-night hover:brightness-110`,
  ghost: `${base} border border-white/25 px-7 py-3.5 text-snow hover:border-white/60 hover:bg-white/5`,
  whatsapp: `${base} bg-whatsapp px-7 py-3.5 text-night hover:brightness-110`,
  link: "group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.15em] text-snow transition-colors hover:text-mist",
} as const;

export type ButtonVariant = keyof typeof styles;

function Chevron({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
    >
      <path d={ARROW_PATH} fill={color} transform="rotate(90 50 50)" />
    </svg>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
  external,
  className = "",
  ariaLabel,
  withArrow = true,
}: {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  withArrow?: boolean;
}) {
  const cls = `${styles[variant]} ${className}`;
  const content = (
    <>
      {children}
      {withArrow && <Chevron />}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

/** Redaktioneller Textlink mit farbigem Pfeil-Bullet (Service-Kontext). */
export function ArrowLink({
  href,
  children,
  color = "mint",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  color?: keyof typeof ARROW_COLORS;
  className?: string;
}) {
  return (
    <Link href={href} className={`${styles.link} ${className}`}>
      <Chevron color={ARROW_COLORS[color]} />
      {children}
    </Link>
  );
}
