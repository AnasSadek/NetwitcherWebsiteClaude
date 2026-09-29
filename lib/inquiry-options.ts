/**
 * Themen/Zeitrahmen-Optionen als reine, ungekürzte id/label-Paare.
 *
 * Spiegelt TOPICS_DE/TOPICS_AR/TIMINGS_DE/TIMINGS_AR aus
 * components/contact/InquiryFlow.tsx (gleiche ids, gleiche Labels) — dort
 * kommen zusätzlich hint/accent für die UI dazu, die die API-Route nicht
 * braucht. Wird serverseitig genutzt, um eingehende `topicId`/`timingId`
 * gegen eine bekannte Liste zu validieren und in ein sicheres, lokalisiertes
 * Label für die E-Mail aufzulösen, statt Freitext vom Client zu vertrauen.
 */

export type InquiryOption = { id: string; label: string };

export const INQUIRY_TOPICS: Record<"de" | "ar", InquiryOption[]> = {
  de: [
    { id: "content-studio", label: "Content & Studio" },
    { id: "foto-video", label: "Foto & Video" },
    { id: "social-media", label: "Social Media" },
    { id: "ads", label: "Ads" },
    { id: "website", label: "Website" },
    { id: "seo", label: "SEO" },
    { id: "branding", label: "Branding" },
    { id: "software", label: "Software" },
    { id: "anderes", label: "Etwas anderes" },
  ],
  ar: [
    { id: "content-studio", label: "المحتوى والاستوديو" },
    { id: "foto-video", label: "تصوير وفيديو" },
    { id: "social-media", label: "وسائل التواصل الاجتماعي" },
    { id: "ads", label: "إعلانات" },
    { id: "website", label: "موقع إلكتروني" },
    { id: "seo", label: "تحسين محركات البحث" },
    { id: "branding", label: "الهوية البصرية" },
    { id: "software", label: "برمجيات" },
    { id: "anderes", label: "شيء آخر" },
  ],
};

export const INQUIRY_TIMINGS: Record<"de" | "ar", InquiryOption[]> = {
  de: [
    { id: "asap", label: "So schnell wie möglich" },
    { id: "wochen", label: "In den nächsten Wochen" },
    { id: "planung", label: "Noch in Planung" },
  ],
  ar: [
    { id: "asap", label: "في أقرب وقت ممكن" },
    { id: "wochen", label: "خلال الأسابيع القادمة" },
    { id: "planung", label: "لا يزال قيد التخطيط" },
  ],
};
