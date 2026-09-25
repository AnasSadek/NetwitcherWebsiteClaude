import { ButtonLink } from "@/components/Button";
import { BrandStar } from "@/components/brand/Logo";
import { de as t } from "@/lib/i18n/dictionary";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center pt-24">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <BrandStar size={72} className="mx-auto mb-8" />
        <h1 className="font-heading text-5xl font-extrabold tracking-tight">{t.notFound.title}</h1>
        <p className="mt-4 text-lg font-bold">{t.notFound.heading}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">
          {t.notFound.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">{t.notFound.homeCta}</ButtonLink>
          <ButtonLink href="/leistungen" variant="ghost">{t.notFound.servicesCta}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
