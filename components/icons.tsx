import type { Service } from "@/lib/services";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type FeatureIconName =
  | "users"
  | "calendar-check"
  | "book"
  | "message-circle"
  | "bar-chart"
  | "shield-check"
  | "inbox"
  | "calendar"
  | "sliders"
  | "map-pin"
  | "list-checks"
  | "package";

/** Zweites, kleines Icon-Set im selben Strich-Stil wie {@link ServiceIcon},
 *  für Feature-Karten ausserhalb der Leistungen-Seite. */
export function FeatureIcon({
  icon,
  className = "h-6 w-6",
}: {
  icon: FeatureIconName;
  className?: string;
}) {
  const paths: Record<FeatureIconName, React.ReactNode> = {
    users: (
      <>
        <circle cx="9" cy="8.5" r="3" />
        <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        <path d="M16 8.2a2.7 2.7 0 0 1 0 5.2M20.5 19.5c0-2.5-1.8-4.3-4-4.9" />
      </>
    ),
    "calendar-check": (
      <>
        <rect x="4" y="5.5" width="16" height="14" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
        <path d="m9 14.5 2 2 4-4" />
      </>
    ),
    book: (
      <>
        <path d="M4 6a2 2 0 0 1 2-2h5.5v15H6a2 2 0 0 0-2 2V6Z" />
        <path d="M20 6a2 2 0 0 0-2-2h-5.5v15H18a2 2 0 0 1 2 2V6Z" />
      </>
    ),
    "message-circle": (
      <>
        <path d="M4 12a8 8 0 1 1 3.3 6.4L4 19.5l1.1-3.2A7.9 7.9 0 0 1 4 12Z" />
      </>
    ),
    "bar-chart": (
      <>
        <path d="M4 20V10.5M10 20V4M16 20v-7M20 20H4" />
      </>
    ),
    "shield-check": (
      <>
        <path d="M12 3.5 19 6v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-2.5Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    inbox: (
      <>
        <path d="M4 13h4l1.5 2.5h5L16 13h4" />
        <path d="M4 13V6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V13" />
        <path d="M4 13v4.5A1.5 1.5 0 0 0 5.5 19h13a1.5 1.5 0 0 0 1.5-1.5V13" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5.5" width="16" height="14" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
        <circle cx="9" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
    sliders: (
      <>
        <path d="M5 19v-6M5 9V5M12 19v-4M12 11V5M19 19v-2M19 13V5" />
        <circle cx="5" cy="11" r="1.8" />
        <circle cx="12" cy="13" r="1.8" />
        <circle cx="19" cy="15" r="1.8" />
      </>
    ),
    "map-pin": (
      <>
        <path d="M12 21s7-7.2 7-12A7 7 0 0 0 5 9c0 4.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.4" />
      </>
    ),
    "list-checks": (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
      </>
    ),
    package: (
      <>
        <path d="M3.5 8 12 3.5 20.5 8 12 12.5 3.5 8Z" />
        <path d="M3.5 8v9L12 21.5 20.5 17V8" />
        <path d="M12 12.5V21.5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      {paths[icon]}
    </svg>
  );
}

export function ServiceIcon({
  icon,
  className = "h-7 w-7",
}: {
  icon: Service["icon"];
  className?: string;
}) {
  const paths: Record<Service["icon"], React.ReactNode> = {
    camera: (
      <>
        <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.2-1.8c.2-.3.5-.5.9-.5h3.6c.4 0 .7.2.9.5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" />
        <circle cx="12" cy="12.5" r="3.2" />
      </>
    ),
    megaphone: (
      <>
        <path d="M4 10v4a1 1 0 0 0 1 1h2l4 4h1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1L7 9H5a1 1 0 0 0-1 1Z" />
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
    monitor: (
      <>
        <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
        <path d="M9.5 20h5M12 16.5V20" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15.5 15.5 4.5 4.5" />
      </>
    ),
    sparkles: (
      <>
        <path d="M12 4.5 13.6 9l4.4 1.5-4.4 1.5L12 16.5 10.4 12 6 10.5 10.4 9 12 4.5Z" />
        <path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
      </>
    ),
    play: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" stroke="none" />
      </>
    ),
    code: (
      <>
        <path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.2 5.5l-2.4 13" />
      </>
    ),
    wrench: (
      <>
        <path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7a1.8 1.8 0 1 0 2.5 2.5l5.3-5.2a4 4 0 0 0 5-5.3l-2.6 2.6-2.3-2.3 2.6-2.5Z" />
      </>
    ),
    printer: (
      <>
        <path d="M7 8V4.5h10V8M7 16H4.5v-6h15v6H17" />
        <rect x="7" y="13.5" width="10" height="6" rx="1" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      {paths[icon]}
    </svg>
  );
}
