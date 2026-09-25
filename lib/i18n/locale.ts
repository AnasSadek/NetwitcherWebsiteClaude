export type Locale = "de" | "ar";

export const LOCALES: Locale[] = ["de", "ar"];
export const DEFAULT_LOCALE: Locale = "de";

export const isRtl = (locale: Locale) => locale === "ar";

/** German path (no locale prefix) → equivalent Arabic path, and back.
 *  Both trees share the exact same segment names, so this is a pure prefix
 *  map — the language switcher always lands on the same page. */
export function localizePath(pathname: string, target: Locale): string {
  const withoutPrefix = pathname.startsWith("/ar") ? pathname.slice(3) || "/" : pathname;
  if (target === "de") return withoutPrefix;
  return withoutPrefix === "/" ? "/ar" : `/ar${withoutPrefix}`;
}

export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith("/ar") ? "ar" : "de";
}

/** Unpräfixierten (deutschen) Pfad in die aktuelle Locale übersetzen —
 *  fürs Verlinken innerhalb geteilter Komponenten wie Header/Footer. */
export function withLocale(href: string, locale: Locale): string {
  if (locale === "de") return href;
  return href === "/" ? "/ar" : `/ar${href}`;
}
