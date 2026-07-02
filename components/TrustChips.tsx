const chips = [
  "Content Creation",
  "Produktfotografie",
  "Reels & Video",
  "Social Media Ads",
  "Webdesign",
  "SEO",
  "Berlin Studio",
];

export function TrustChips() {
  return (
    <ul className="flex flex-wrap items-center gap-2.5" aria-label="Unsere Kernbereiche">
      {chips.map((chip) => (
        <li
          key={chip}
          className="rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-mist backdrop-blur"
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}
