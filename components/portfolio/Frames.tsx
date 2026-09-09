import type { MediaImage } from "@/lib/portfolio";
import type { AccentColor } from "@/lib/services";
import { SmartImage } from "./SmartImage";

/** Browser-Rahmen für Website-Screenshots. Hover fährt lange Screens nach unten. */
export function BrowserFrame({
  image,
  color,
  url,
  sizes,
  priority,
  monogram,
  className = "",
}: {
  image: MediaImage;
  color: AccentColor;
  url?: string;
  sizes?: string;
  priority?: boolean;
  monogram?: string;
  className?: string;
}) {
  const host = url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-void-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] md:rounded-3xl ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="block h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="block h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="block h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md bg-white/[0.06] font-heading text-[10px] font-semibold tracking-wide text-white/45">
          {host || " "}
        </span>
      </div>
      <div className="scroll-preview">
        <SmartImage
          image={image}
          color={color}
          sizes={sizes}
          priority={priority}
          monogram={monogram}
          label="Desktop-Screenshot folgt"
          rounded="rounded-none"
        />
      </div>
    </div>
  );
}

/** Smartphone-Rahmen für 9:16-Screens. */
export function PhoneFrame({
  image,
  color,
  sizes,
  monogram,
  className = "",
  label = "Mobile-Screenshot folgt",
}: {
  image: MediaImage;
  color: AccentColor;
  sizes?: string;
  monogram?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative rounded-[2rem] border border-white/15 bg-void-3 p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] md:rounded-[2.4rem] md:p-2 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-3 z-10 h-1.5 w-1/4 -translate-x-1/2 rounded-full bg-black/60 md:top-4"
      />
      <SmartImage
        image={image}
        color={color}
        ratio="9/16"
        sizes={sizes}
        monogram={monogram}
        label={label}
        rounded="rounded-[1.6rem] md:rounded-[1.9rem]"
      />
    </div>
  );
}
