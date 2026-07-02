import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  eyebrowColor = "text-mint",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "center" | "left";
  eyebrowColor?: string;
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
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {intro && (
          <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </Reveal>
  );
}
