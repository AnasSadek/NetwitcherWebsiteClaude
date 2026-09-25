"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { localizePath, type Locale } from "@/lib/i18n/locale";

/** DE/AR-Umschalter: bleibt auf der äquivalenten Route (gleiche Segmente,
 *  nur /ar-Präfix ab-/zugeschaltet), landet nie auf der Startseite. */
export function LanguageSwitcher({
  locale,
  dict,
  variant = "desktop",
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname() || "/";
  const dePath = localizePath(pathname, "de");
  const arPath = localizePath(pathname, "ar");

  const base =
    variant === "desktop"
      ? "flex items-center gap-0.5 rounded-full border border-line bg-white/70 p-0.5 text-xs font-bold"
      : "flex items-center gap-0.5 rounded-full border border-line bg-white p-0.5 text-sm font-bold";

  const itemClass = (active: boolean) =>
    `rounded-full px-2.5 py-1.5 transition-colors ${active ? "bg-ink text-white" : "text-ink-3 hover:text-ink"}`;

  return (
    <div className={base} role="group" aria-label={dict.common.langSwitcherLabel}>
      <Link href={dePath} lang="de" aria-current={locale === "de" ? "true" : undefined} className={itemClass(locale === "de")}>
        DE
      </Link>
      <Link href={arPath} lang="ar" aria-current={locale === "ar" ? "true" : undefined} className={itemClass(locale === "ar")}>
        AR
      </Link>
    </div>
  );
}
