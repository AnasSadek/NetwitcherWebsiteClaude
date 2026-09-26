"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ARROW_COLORS, ARROW_PATH } from "@/components/arrows";
import { withLocale, type Locale } from "@/lib/i18n/locale";
import { site, whatsappHref } from "@/lib/site";

/**
 * Kurzer Anfrage-Dialog statt großem Standardformular.
 *
 * Drei Schritte, jeder passt ohne Scrollen auf den Schirm:
 *   1 Thema wählen  → ein Klick, kein Tippen
 *   2 Vorhaben      → ein Freitextfeld + Zeitrahmen (optional)
 *   3 Kontakt       → Name + E-Mail, Rest freiwillig
 *
 * Bewusst normale HTML-Steuerelemente: echte <button>, <input>, <textarea>,
 * <fieldset>/<legend>, native Validierung, sichtbarer Fokus. Die einzige
 * Bewegung ist ein kurzer Schritt-Übergang, der bei "reduce motion" entfällt.
 *
 * Versand ohne Backend: die Angaben werden zu einer fertigen Nachricht
 * zusammengesetzt und wahlweise per E-Mail oder WhatsApp geöffnet.
 * Für ein späteres Backend genügt es, buildMessage() an eine API-Route zu POSTen.
 */

type Topic = {
  id: string;
  label: string;
  hint: string;
  accent: keyof typeof ARROW_COLORS;
};

const TOPICS_DE: Topic[] = [
  { id: "content-studio", label: "Content & Studio", hint: "Regelmäßiger Content aus dem Studio Berlin", accent: "pink" },
  { id: "foto-video", label: "Foto & Video", hint: "Produkt-, Team- oder Imageproduktion", accent: "pink" },
  { id: "social-media", label: "Social Media", hint: "Kanäle aufbauen, betreuen, wachsen lassen", accent: "sky" },
  { id: "ads", label: "Ads", hint: "Meta, Google & TikTok mit Budgetverantwortung", accent: "sky" },
  { id: "website", label: "Website", hint: "Neue Website, Relaunch oder Onlineshop", accent: "mint" },
  { id: "seo", label: "SEO", hint: "Sichtbar werden, wenn jemand sucht", accent: "mint" },
  { id: "branding", label: "Branding", hint: "Logo, Design-System, Print", accent: "violet" },
  { id: "software", label: "Software", hint: "Individuelle Tools, Portale, Automatisierung", accent: "violet" },
  { id: "anderes", label: "Etwas anderes", hint: "Erzähl es uns einfach in eigenen Worten", accent: "sun" },
];

const TOPICS_AR: Topic[] = [
  { id: "content-studio", label: "المحتوى والاستوديو", hint: "محتوى منتظم من استوديو برلين", accent: "pink" },
  { id: "foto-video", label: "تصوير وفيديو", hint: "إنتاج للمنتجات، والفرق، وصورة العلامة التجارية.", accent: "pink" },
  { id: "social-media", label: "وسائل التواصل الاجتماعي", hint: "بناء القنوات وإدارتها وتنميتها", accent: "sky" },
  { id: "ads", label: "إعلانات", hint: "إعلانات Meta وGoogle وTikTok مع إدارة مسؤولة للميزانية.", accent: "sky" },
  { id: "website", label: "موقع إلكتروني", hint: "موقع جديد أو إعادة تصميم أو متجر إلكتروني", accent: "mint" },
  { id: "seo", label: "تحسين محركات البحث", hint: "الظهور عندما يبحث العملاء عن خدماتك.", accent: "mint" },
  { id: "branding", label: "الهوية البصرية", hint: "شعار، نظام تصميم، مطبوعات", accent: "violet" },
  { id: "software", label: "برمجيات", hint: "أدوات مخصصة، بوابات، أتمتة", accent: "violet" },
  { id: "anderes", label: "شيء آخر", hint: "أخبرنا به بكلماتك الخاصة", accent: "sun" },
];

const TIMINGS_DE = [
  { id: "asap", label: "So schnell wie möglich" },
  { id: "wochen", label: "In den nächsten Wochen" },
  { id: "planung", label: "Noch in Planung" },
];

const TIMINGS_AR = [
  { id: "asap", label: "في أقرب وقت ممكن" },
  { id: "wochen", label: "خلال الأسابيع القادمة" },
  { id: "planung", label: "لا يزال قيد التخطيط" },
];

/**
 * Übernimmt ?service=… aus Links wie /kontakt?service=Fotoshooting. Die
 * Stichwortliste deckt deutsche UND arabische Varianten ab (Links können aus
 * beiden Sprachversionen kommen, z. B. übersetzte navTitle-Werte) — die
 * Reihenfolge entscheidet: das erste passende Stichwort gewinnt. Kein
 * Treffer heißt schlicht: Schritt 1 wird ganz normal gezeigt.
 */
const PARAM_KEYWORDS: [string[], string][] = [
  [["foto", "video", "shooting", "film", "تصوير", "فيديو"], "foto-video"],
  [["content", "studio", "reel", "محتوى", "استوديو", "ريلز"], "content-studio"],
  [["social", "instagram", "tiktok", "سوشيال", "ميديا"], "social-media"],
  [["ads", "performance", "marketing", "kampagne", "إعلان", "تسويق", "حملة"], "ads"],
  [["seo", "suchmaschine", "بحث"], "seo"],
  [["web", "shop", "commerce", "landing", "موقع", "متجر"], "website"],
  [["brand", "logo", "design", "print", "druck", "هوية", "تصميم", "طباعة"], "branding"],
  [["software", "support", "entwicklung", "app", "portal", "برمج", "دعم", "تطبيق"], "software"],
];

function topicFromParam(param: string | null, topics: Topic[]): Topic | null {
  if (!param) return null;
  const p = param.toLowerCase();
  const id =
    topics.find((t) => t.id === p || t.label.toLowerCase() === p)?.id ??
    PARAM_KEYWORDS.find(([words]) => words.some((w) => p.includes(w)))?.[1];
  return topics.find((t) => t.id === id) ?? null;
}

function Arrow({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path d={ARROW_PATH} fill={color} transform="rotate(90 50 50)" />
    </svg>
  );
}

const inputCls =
  "w-full rounded border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors hover:border-ink/20 focus:border-mint focus:outline-none";

const STEP_LABELS_DE = ["Thema", "Vorhaben", "Kontakt"];
const STEP_LABELS_AR = ["مجال المشروع", "التفاصيل", "التواصل"];

type Fields = {
  message: string;
  name: string;
  email: string;
  company: string;
  phone: string;
};

const EMPTY: Fields = { message: "", name: "", email: "", company: "", phone: "" };

function Flow({ locale = "de" }: { locale?: Locale }) {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const isAr = locale === "ar";
  const TOPICS = isAr ? TOPICS_AR : TOPICS_DE;
  const TIMINGS = isAr ? TIMINGS_AR : TIMINGS_DE;
  const STEP_LABELS = isAr ? STEP_LABELS_AR : STEP_LABELS_DE;
  const arrowMirror = "rtl:-scale-x-100 rtl:group-hover:-translate-x-1";

  const preselected = topicFromParam(params.get("service"), TOPICS);
  const [step, setStep] = useState(preselected ? 1 : 0);
  const [topic, setTopic] = useState<Topic | null>(preselected);
  const [timing, setTiming] = useState("");
  // Gesteuerte Felder: ein Schritt zurück darf Getipptes nie verwerfen.
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [sent, setSent] = useState<null | "mail" | "whatsapp">(null);
  // Der Fokus wandert auf die Überschrift des neuen Schritts, sobald diese
  // wirklich im DOM steht. Callback-Ref statt Effect, weil AnimatePresence
  // (mode="wait") erst nach der Exit-Animation montiert. Beim ersten Rendern
  // wird nichts fokussiert – sonst springt die Seite bei ?service=… nach unten.
  const focusPending = useRef(false);
  const headingRef = useCallback((node: HTMLHeadingElement | null) => {
    if (!node || !focusPending.current) return;
    focusPending.current = false;
    node.focus();
  }, []);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const go = (next: number) => {
    focusPending.current = true;
    setStep(next);
  };

  const choose = (t: Topic) => {
    setTopic(t);
    go(1);
  };

  const nextFromDetails = () => {
    if (!formRef.current?.reportValidity()) return;
    go(2);
  };

  const buildMessage = () => {
    const lines = isAr
      ? [
          `الموضوع: ${topic?.label ?? "-"}`,
          `الإطار الزمني: ${TIMINGS.find((t) => t.id === timing)?.label ?? "غير محدد"}`,
          "",
          fields.message,
          "",
          `الاسم: ${fields.name}`,
          `البريد الإلكتروني: ${fields.email}`,
        ]
      : [
          `Thema: ${topic?.label ?? "-"}`,
          `Zeitrahmen: ${TIMINGS.find((t) => t.id === timing)?.label ?? "offen"}`,
          "",
          fields.message,
          "",
          `Name: ${fields.name}`,
          `E-Mail: ${fields.email}`,
        ];
    if (fields.company) lines.push(`${isAr ? "الشركة" : "Unternehmen"}: ${fields.company}`);
    if (fields.phone) lines.push(`${isAr ? "الهاتف" : "Telefon"}: ${fields.phone}`);
    return lines.join("\n");
  };

  const submitMail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = isAr ? `طلب: ${topic?.label ?? "عام"}` : `Anfrage: ${topic?.label ?? "Allgemein"}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(buildMessage())}`;
    setSent("mail");
  };

  const submitWhatsapp = () => {
    if (!formRef.current?.reportValidity()) return;
    window.open(
      whatsappHref(`${isAr ? "مرحباً نتويتشر!" : "Hallo Netwitcher!"}\n\n${buildMessage()}`),
      "_blank",
      "noopener,noreferrer"
    );
    setSent("whatsapp");
  };

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };
  const variants = reduce
    ? undefined
    : {
        enter: { opacity: 0, x: isAr ? -16 : 16 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isAr ? 16 : -16 },
      };

  return (
    <div>
      {/* Fortschritt */}
      <p
        aria-live="polite"
        className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-ink-3"
      >
        {isAr ? `الخطوة ${step + 1} من 3: ${STEP_LABELS[step]}` : `Schritt ${step + 1} von 3: ${STEP_LABELS[step]}`}
      </p>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`h-0.5 flex-1 transition-colors duration-300 ${
              i <= step ? "bg-mint" : "bg-ink/10"
            }`}
          />
        ))}
      </div>

      <form ref={formRef} onSubmit={submitMail} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            {/* ---------- Schritt 1: Thema ---------- */}
            {step === 0 && (
              <div>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-heading text-2xl font-black tracking-tight focus:outline-none md:text-3xl"
                >
                  {isAr ? "بماذا يمكننا مساعدتك؟" : "Wobei können wir helfen?"}
                </h2>
                <p className="mt-3 text-sm text-ink-3">
                  {isAr
                    ? "اختر الأقرب لاحتياجك. كل التفاصيل الأخرى نوضحها في الحوار."
                    : "Wähl das, was am ehesten passt. Alles Weitere klären wir im Gespräch."}
                </p>
                <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                  {TOPICS.map((t) => (
                    <li key={t.id} className="h-full">
                      <button
                        type="button"
                        onClick={() => choose(t)}
                        className="group flex h-full min-h-28 w-full items-center gap-3 rounded border border-ink/10 bg-white px-4 py-4 text-left rtl:text-right transition-colors hover:border-ink/35 hover:bg-ink/5"
                      >
                        <Arrow
                          color={ARROW_COLORS[t.accent]}
                          className={`shrink-0 transition-transform duration-200 ${arrowMirror} group-hover:translate-x-1`}
                        />
                        <span>
                          <span className="block font-heading text-base font-bold tracking-tight">
                            {t.label}
                          </span>
                          <span className="mt-0.5 block text-sm leading-snug text-ink-3">
                            {t.hint}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ---------- Schritt 2: Vorhaben ---------- */}
            {step === 1 && (
              <div>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-heading text-2xl font-black tracking-tight focus:outline-none md:text-3xl"
                >
                  {isAr ? "ما الذي تخطط له؟" : "Was steht an?"}
                </h2>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-3">
                  <span className="inline-flex items-center gap-2 text-ink">
                    <Arrow color={ARROW_COLORS[topic?.accent ?? "mint"]} />
                    {topic?.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(0)}
                    className="underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {isAr ? "تغيير" : "ändern"}
                  </button>
                </p>

                <div className="mt-7">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    {isAr ? "جملتان أو ثلاث تكفي" : "Zwei, drei Sätze genügen"}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={fields.message}
                    onChange={set("message")}
                    className={inputCls}
                    placeholder={
                      isAr
                        ? "مثال: سنطلق خط منتجات جديد في الخريف ونحتاج صوراً وريلز له."
                        : "Zum Beispiel: Wir bringen im Herbst eine neue Produktlinie raus und brauchen Fotos und Reels dafür."
                    }
                  />
                </div>

                <fieldset className="mt-7">
                  <legend className="mb-3 text-sm font-medium">
                    {isAr ? "متى تريد البدء؟" : "Wann soll es losgehen?"}{" "}
                    <span className="text-ink-3">{isAr ? "(اختياري)" : "(optional)"}</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {TIMINGS.map((t) => (
                      <label
                        key={t.id}
                        className={`cursor-pointer rounded border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-mint ${
                          timing === t.id
                            ? "border-mint bg-mint/10 text-ink"
                            : "border-ink/10 text-ink-3 hover:border-ink/35"
                        }`}
                      >
                        <input
                          type="radio"
                          name="timing"
                          value={t.id}
                          checked={timing === t.id}
                          onChange={() => setTiming(t.id)}
                          className="sr-only"
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-9 flex items-center gap-6">
                  <button
                    type="button"
                    onClick={nextFromDetails}
                    className="group inline-flex items-center justify-center gap-2.5 rounded bg-[#1B103F] px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(27,16,63,0.18)] transition-colors hover:bg-[#2A1760]"
                  >
                    {isAr ? "التالي" : "Weiter"}
                    <Arrow
                      color="currentColor"
                      className={`transition-transform duration-200 ${arrowMirror} group-hover:translate-x-1`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(0)}
                    className="text-sm text-ink-3 underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {isAr ? "رجوع" : "Zurück"}
                  </button>
                </div>
              </div>
            )}

            {/* ---------- Schritt 3: Kontakt ---------- */}
            {step === 2 && (
              <div>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-heading text-2xl font-black tracking-tight focus:outline-none md:text-3xl"
                >
                  {isAr ? "كيف يمكننا التواصل معك؟" : "Wie erreichen wir dich?"}
                </h2>
                <p className="mt-3 text-sm text-ink-3">
                  {isAr
                    ? "نرد خلال يوم عمل واحد، بتقييم صادق، لا بمحادثة بيع."
                    : "Wir antworten innerhalb eines Werktags, mit einer ehrlichen Einschätzung, nicht mit einem Verkaufsgespräch."}
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                      {isAr ? "الاسم" : "Name"}
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      value={fields.name}
                      onChange={set("name")}
                      className={inputCls}
                      placeholder={isAr ? "اسمك" : "Dein Name"}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      {isAr ? "البريد الإلكتروني" : "E-Mail"}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={fields.email}
                      onChange={set("email")}
                      className={inputCls}
                      dir="ltr"
                      placeholder="du@unternehmen.de"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium">
                      {isAr ? "الشركة" : "Unternehmen"} <span className="text-ink-3">{isAr ? "(اختياري)" : "(optional)"}</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      autoComplete="organization"
                      value={fields.company}
                      onChange={set("company")}
                      className={inputCls}
                      placeholder={isAr ? "اسم الشركة أو العلامة" : "Firma oder Marke"}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                      {isAr ? "الهاتف" : "Telefon"} <span className="text-ink-3">{isAr ? "(اختياري)" : "(optional)"}</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={set("phone")}
                      className={inputCls}
                      dir="ltr"
                      placeholder="+49 …"
                    />
                  </div>
                </div>

                <p className="mt-6 text-xs leading-relaxed text-ink-3">
                  {isAr ? (
                    <>
                      بالإرسال، فإنك توافق على معالجة بياناتك من أجل تنفيذ طلبك. التفاصيل في{" "}
                      <Link href={withLocale("/datenschutz", locale)} className="underline underline-offset-2 hover:text-ink">
                        سياسة الخصوصية
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur
                      Bearbeitung der Anfrage zu. Details in der{" "}
                      <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink">
                        Datenschutzerklärung
                      </Link>
                      .
                    </>
                  )}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2.5 rounded bg-[#1B103F] px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(27,16,63,0.18)] transition-colors hover:bg-[#2A1760]"
                  >
                    {isAr ? "إرسال الطلب" : "Anfrage senden"}
                    <Arrow
                      color="currentColor"
                      className={`transition-transform duration-200 ${arrowMirror} group-hover:translate-x-1`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={submitWhatsapp}
                    className="text-sm text-whatsapp underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {isAr ? "تفضل الإرسال عبر واتساب" : "Lieber per WhatsApp schicken"}
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="text-sm text-ink-3 underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {isAr ? "رجوع" : "Zurück"}
                  </button>
                </div>

                {sent && (
                  <p role="status" className="mt-6 border-l-2 rtl:border-l-0 rtl:border-r-2 pl-4 rtl:pl-0 rtl:pr-4 border-mint text-sm leading-relaxed text-ink-3">
                    {isAr
                      ? sent === "mail"
                        ? "سيفتح برنامج البريد الإلكتروني برسالتك جاهزة، أرسلها وستصل إلينا."
                        : "سيفتح واتساب برسالتك جاهزة، أرسلها وستصل إلينا."
                      : sent === "mail"
                        ? "Dein E-Mail-Programm öffnet sich mit der fertigen Anfrage, einmal absenden, dann ist sie bei uns."
                        : "WhatsApp öffnet sich mit der fertigen Nachricht, einmal absenden, dann ist sie bei uns."}{" "}
                    {isAr ? "إذا لم يعمل ذلك، يمكنك التواصل معنا مباشرة عبر " : "Klappt das nicht, erreichst du uns direkt unter "}
                    <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-2" dir="ltr">
                      {site.email}
                    </a>
                    .
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}

export function InquiryFlow({ locale = "de" }: { locale?: Locale }) {
  return (
    <Suspense
      fallback={
        <div className="h-[28rem]" aria-hidden="true" />
      }
    >
      <Flow locale={locale} />
    </Suspense>
  );
}
