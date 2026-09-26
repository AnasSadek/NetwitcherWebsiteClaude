import type { Metadata } from "next";
import { InquiryFlow } from "@/components/contact/InquiryFlow";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "تواصل معنا واطلب استشارتك",
  description:
    "أخبرنا في ثلاث خطوات قصيرة عمّا تحتاجه: محتوى، جلسة تصوير، وسائل التواصل الاجتماعي، إعلانات، موقع إلكتروني، تحسين محركات البحث، هوية بصرية أو برمجيات. نرد خلال يوم عمل واحد. من برلين.",
  alternates: { canonical: "/ar/kontakt" },
};

export default function KontaktPageAr() {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <header className="max-w-2xl">
            <h1 className="font-heading text-4xl font-black leading-[1.03] tracking-tight md:text-6xl">
              لنبدأ.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-3">
              ثلاث خطوات قصيرة، وبعدها نملك صورة واضحة لتقديم تقييم صريح، دون
              استشارات طويلة أو تعقيد غير ضروري.
            </p>
          </header>

          <div className="mt-16 grid gap-14 border-t border-line pt-12 lg:grid-cols-[minmax(0,58%)_minmax(0,42%)] lg:gap-20 md:mt-20">
            {/* Anfrage-Dialog */}
            <InquiryFlow locale="ar" />

            {/* Direkter Weg, bewusst schmal und ruhig */}
            <aside>
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">
                تفضل التواصل المباشر؟
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
                <li>
                  <a
                    href={whatsappHref(
                      "مرحباً نتويتشر! أنا مهتم بخدمات المحتوى والتسويق، وأود حجز مكالمة تعارف مجانية."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-heading font-bold text-whatsapp">واتساب</span>
                    <span className="text-right rtl:text-left text-ink-3 transition-colors group-hover:text-ink">
                      غالباً نرد في نفس اليوم
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-heading font-bold">البريد الإلكتروني</span>
                    <span className="text-right rtl:text-left text-ink-3 transition-colors group-hover:text-ink" dir="ltr">
                      {site.email}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-heading font-bold">الهاتف</span>
                    <span className="text-right rtl:text-left text-ink-3 transition-colors group-hover:text-ink" dir="ltr">
                      {site.phone}
                    </span>
                  </a>
                </li>
                <li className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-heading font-bold">الاستوديو</span>
                  <span className="text-right rtl:text-left text-ink-3">
                    برلين، ألمانيا
                  </span>
                </li>
              </ul>

              <div id="termin" className="mt-12 scroll-mt-32">
                <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">
                  مكالمة تعارف
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-3">
                  20-30 دقيقة عبر مكالمة فيديو أو هاتف. نستمع إليك، نحلل الوضع،
                  ونخبرك بصراحة بما يستحق التنفيذ وما لا يستحق. مجاناً.
                </p>
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2.5 rounded border border-ink/20 px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:border-ink/60 hover:bg-ink/5"
                >
                  احجز مكالمة تعارف
                </a>
                <p className="mt-4 text-xs leading-relaxed text-ink-3">
                  لم يناسبك أي موعد؟ أرسل لنا وقتين مقترحين عبر واتساب، وسنؤكد
                  المناسب منهما.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
