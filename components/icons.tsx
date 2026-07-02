import type { Service } from "@/lib/services";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

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
