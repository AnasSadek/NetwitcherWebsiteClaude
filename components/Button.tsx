import Link from "next/link";

const styles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet to-sky px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-night shadow-glow-violet transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(139,92,246,.5)]",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/5 px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-snow backdrop-blur transition-all duration-200 hover:border-mint/60 hover:bg-white/10",
  warm: "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink to-sun px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-night shadow-glow-pink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(244,104,168,.5)]",
  whatsapp:
    "inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-night transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(37,211,102,.4)]",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  children,
  external,
  className = "",
  ariaLabel,
}: {
  href: string;
  variant?: keyof typeof styles;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `${styles[variant]} ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-heading text-sm font-bold tracking-wide text-snow transition-colors hover:text-mint ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
