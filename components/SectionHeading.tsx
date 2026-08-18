import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  eyebrowColor = "text-mint",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "center" | "left";
  eyebrowColor?: string;
  /** Seitentitel bekommen "h1", Abschnittstitel bleiben "h2". */
  as?: "h1" | "h2";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      <div className={alignCls}>
        {eyebrow && (
          <p
            className={`mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        )}
        <Tag className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
          {title}
        </Tag>
        {intro && (
          <p className="mt-5 text-base leading-relaxed text-ink-3 md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </Reveal>
  );
}
