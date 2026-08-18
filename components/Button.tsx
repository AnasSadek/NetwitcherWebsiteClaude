import Link from "next/link";
import { ARROW_COLORS, ARROW_PATH } from "./arrows";

/**
 * Netwitcher-Interaktionssystem (helle Bühne).
 *
 *  primary   Tinte auf Papier — der eine wichtige Klick
 *  studio    warme Studio-Aktion (Sonnengelb)
 *  ghost     gerahmt, zurückhaltend
 *  link      redaktioneller Textlink
 *  whatsapp  Messenger-Aktion in Kanalfarbe
 *
 * Pillenform, satte Fläche, Pfeil wandert beim Hover. Keine Verläufe auf
 * Buttons — der Marken-Verlauf gehört den grossen Momenten.
 */

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 active:translate-y-px";

const styles = {
  primary: `${base} bg-ink px-7 py-3.5 text-white hover:bg-deep-2`,
  studio: `${base} bg-sun px-7 py-3.5 text-ink hover:brightness-105`,
  ghost: `${base} border-2 border-ink/15 px-7 py-3.5 text-ink hover:border-ink/40 hover:bg-ink/5`,
  whatsapp: `${base} bg-whatsapp px-7 py-3.5 text-white hover:brightness-105`,
  light: `${base} bg-white px-7 py-3.5 text-ink hover:bg-paper-2`,
  link: "group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:text-violet",
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

/** Redaktioneller Textlink mit farbigem Pfeil-Bullet. */
export function ArrowLink({
  href,
  children,
  color = "violet",
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
