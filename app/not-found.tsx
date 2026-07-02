import { ButtonLink } from "@/components/Button";
import { StarMark } from "@/components/arrows";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center pt-24">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <StarMark size={72} className="mx-auto mb-8 animate-float motion-reduce:animate-none" />
        <h1 className="font-heading text-5xl font-extrabold tracking-tight">404</h1>
        <p className="mt-4 text-lg font-bold">Diese Seite hat sich entzaubert.</p>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          Die gesuchte Seite existiert nicht (mehr). Aber keine Sorge – die Magie
          findest du auf der Startseite oder in unseren Leistungen.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
          <ButtonLink href="/leistungen" variant="secondary">Leistungen ansehen</ButtonLink>
        </div>
      </div>
    </section>
  );
}
