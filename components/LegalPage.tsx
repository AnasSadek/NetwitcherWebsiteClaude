import { Reveal } from "./Reveal";

/** Layout-Rahmen für Impressum, Datenschutz & AGB. */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-36 pb-24 md:pt-44">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
          <div className="legal mt-10 space-y-6 text-sm leading-relaxed text-mist [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-snow [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-snow [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
