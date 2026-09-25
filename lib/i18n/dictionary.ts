import type { Locale } from "./locale";

/** UI-Textbausteine (Chrome), nicht die Projekt-/Leistungs-/Blog-Inhalte
 *  selbst — die leben locale-spezifisch in eigenen Datendateien
 *  (lib/portfolio.ts / lib/portfolio.ar.ts usw.), damit jede Komponente,
 *  die z. B. `project.title` rendert, ohne Änderung für beide Sprachen
 *  funktioniert. Hier stehen nur wiederkehrende Bedienelemente. */
export type Dictionary = {
  common: {
    skipToContent: string;
    langSwitcherLabel: string;
    langNameDe: string;
    langNameAr: string;
  };
  nav: {
    services: string;
    studio: string;
    portfolio: string;
    about: string;
    blog: string;
    contactCta: string;
    studioDropdownLabel: string;
    homeAriaLabel: string;
    mainNavAriaLabel: string;
    mobileNavAriaLabel: string;
    menuOpen: string;
    menuClose: string;
  };
  footer: {
    tagline: string;
    description: string;
    servicesHeading: string;
    studioLink: string;
    allServicesLink: string;
    companyHeading: string;
    aboutLink: string;
    portfolioLink: string;
    productsLink: string;
    blogLink: string;
    contactLink: string;
    imprintLink: string;
    privacyLink: string;
    termsLink: string;
    contactHeading: string;
    whatsappLink: string;
    countryLabel: string;
    bookIntroCta: string;
    copyrightCity: string;
  };
  whatsapp: {
    ariaLabel: string;
    tooltip: string;
    defaultMessage: string;
  };
  notFound: {
    title: string;
    heading: string;
    body: string;
    homeCta: string;
    servicesCta: string;
  };
  portfolio: {
    breadcrumbAriaLabel: string;
    visitWebsite: string;
    servicesLabel: string;
    areaLabel: string;
    yearLabel: string;
    previewBadge: string;
    aboutProject: string;
    websiteSectionTitle: string;
    videosSectionTitle: string;
    videoSectionTitle: string;
    tapToPlay: string;
    imagesSectionTitle: string;
    motivesCount: (n: number) => string;
    printSectionTitle: string;
    socialSectionTitle: string;
    feedSelection: string;
    postComingSoon: string;
    productSectionTitle: string;
    experienceSectionTitle: string;
    screenshotComingSoon: string;
    comingSoon: string;
    resultsSectionTitle: string;
    nextProjectLabel: string;
    allProjectsLabel: string;
    viewLabel: string;
    filterAriaLabel: string;
    allFilter: string;
    projectCountSingular: string;
    projectCountPlural: string;
    emptyCategory: string;
    ctaTopics: Record<string, string>;
    kindLabels: { website: string; video: string; software: string; visual: string };
    viewProject: string;
    screenshotFollowsDesktop: string;
    screenshotFollowsMobile: string;
    mediaComingSoonImage: string;
    mediaComingSoonVideo: string;
    defaultFeaturesHeading: string;
    prevImageAria: string;
    nextImageAria: string;
    closeAria: string;
    enlargeImage: (alt: string) => string;
    clientsWeWorkWith: string;
    viewClient: (client: string) => string;
    logoAlt: (client: string) => string;
    instagramFallbackLink: string;
    playVideo: (title: string) => string;
    videoComingSoon: (title: string) => string;
  };
};

export const de: Dictionary = {
  common: {
    skipToContent: "Zum Inhalt springen",
    langSwitcherLabel: "Sprache wechseln",
    langNameDe: "Deutsch",
    langNameAr: "Arabisch",
  },
  nav: {
    services: "Leistungen",
    studio: "Studio",
    portfolio: "Portfolio",
    about: "Über uns",
    blog: "Blog",
    contactCta: "Projekt starten",
    studioDropdownLabel: "Content Creation & Studio Berlin",
    homeAriaLabel: "Netwitcher, Startseite",
    mainNavAriaLabel: "Hauptnavigation",
    mobileNavAriaLabel: "Mobile Navigation",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
  },
  footer: {
    tagline: "Magic in Every Click",
    description:
      "Digital Agency & Content-Studio in Berlin. Wir produzieren Content, der Aufmerksamkeit erzeugt, und Kampagnen, die Kunden bringen.",
    servicesHeading: "Leistungen",
    studioLink: "Content Creation & Studio",
    allServicesLink: "Alle Leistungen",
    companyHeading: "Netwitcher",
    aboutLink: "Über uns",
    portfolioLink: "Portfolio",
    productsLink: "Produkte / FekraHub",
    blogLink: "Blog",
    contactLink: "Kontakt",
    imprintLink: "Impressum",
    privacyLink: "Datenschutzerklärung",
    termsLink: "AGB",
    contactHeading: "Kontakt",
    whatsappLink: "WhatsApp schreiben",
    countryLabel: "Berlin, Deutschland",
    bookIntroCta: "Erstgespräch buchen",
    copyrightCity: "Berlin",
  },
  whatsapp: {
    ariaLabel: "Per WhatsApp schreiben",
    tooltip: "Direkt per WhatsApp schreiben",
    defaultMessage:
      "Hallo Netwitcher! Ich interessiere mich für Content & Marketing und hätte gern ein kostenloses Erstgespräch.",
  },
  notFound: {
    title: "404",
    heading: "Diese Seite hat sich entzaubert.",
    body: "Die gesuchte Seite existiert nicht (mehr). Aber keine Sorge, die Magie findest du auf der Startseite oder in unseren Leistungen.",
    homeCta: "Zur Startseite",
    servicesCta: "Leistungen ansehen",
  },
  portfolio: {
    breadcrumbAriaLabel: "Brotkrumen",
    visitWebsite: "Website besuchen",
    servicesLabel: "Leistungen",
    areaLabel: "Bereich",
    yearLabel: "Jahr",
    previewBadge: "Vorschau · Inhalte folgen",
    aboutProject: "Über das Projekt",
    websiteSectionTitle: "DIE WEBSITE.",
    videosSectionTitle: "REELS & VIDEOS.",
    videoSectionTitle: "VIDEO.",
    tapToPlay: "Tippen zum Abspielen",
    imagesSectionTitle: "BILDER.",
    motivesCount: (n) => `${n} Motive`,
    printSectionTitle: "POSTER & PRINT.",
    socialSectionTitle: "SOCIAL MEDIA.",
    feedSelection: "Feed-Auswahl",
    postComingSoon: "Post folgt",
    productSectionTitle: "DAS PRODUKT.",
    experienceSectionTitle: "DAS ERLEBNIS.",
    screenshotComingSoon: "Screenshot folgt",
    comingSoon: "folgt",
    resultsSectionTitle: "ERGEBNIS.",
    nextProjectLabel: "Nächstes Projekt",
    allProjectsLabel: "Alle Projekte",
    viewLabel: "Ansehen",
    filterAriaLabel: "Projekte filtern",
    allFilter: "Alle",
    projectCountSingular: "Projekt",
    projectCountPlural: "Projekte",
    emptyCategory: "In dieser Kategorie zeigen wir bald erste Projekte.",
    ctaTopics: {
      web: "Website",
      ecommerce: "Shop",
      "social-video": "Social Media",
      photo: "Fotoshooting",
      design: "Branding",
      software: "Software",
      ai: "Software",
    },
    kindLabels: { website: "Website", video: "Video & Social", software: "Software", visual: "Design & Foto" },
    viewProject: "Projekt ansehen",
    screenshotFollowsDesktop: "Desktop-Screenshot folgt",
    screenshotFollowsMobile: "Mobile-Screenshot folgt",
    mediaComingSoonImage: "Bild folgt",
    mediaComingSoonVideo: "Video folgt",
    defaultFeaturesHeading: "ZENTRALE FUNKTIONEN",
    prevImageAria: "Vorheriges Bild",
    nextImageAria: "Nächstes Bild",
    closeAria: "Schliessen",
    enlargeImage: (alt) => `${alt} vergrössern`,
    clientsWeWorkWith: "Marken, mit denen wir arbeiten",
    viewClient: (client) => `${client} ansehen`,
    logoAlt: (client) => `${client}, Logo`,
    instagramFallbackLink: "Beitrag auf Instagram ansehen",
    playVideo: (title) => `${title} abspielen`,
    videoComingSoon: (title) => `${title}, Video folgt`,
  },
};

export const ar: Dictionary = {
  common: {
    skipToContent: "الانتقال إلى المحتوى",
    langSwitcherLabel: "تغيير اللغة",
    langNameDe: "الألمانية",
    langNameAr: "العربية",
  },
  nav: {
    services: "الخدمات",
    studio: "الاستوديو",
    portfolio: "أعمالنا",
    about: "من نحن",
    blog: "المدونة",
    contactCta: "ابدأ مشروعك",
    studioDropdownLabel: "إنتاج المحتوى واستوديو برلين",
    homeAriaLabel: "نتويتشر، الصفحة الرئيسية",
    mainNavAriaLabel: "التنقل الرئيسي",
    mobileNavAriaLabel: "قائمة التنقل للجوال",
    menuOpen: "فتح القائمة",
    menuClose: "إغلاق القائمة",
  },
  footer: {
    // Markenclaim bleibt als feststehender Slogan auf Englisch — genau wie
    // im deutschen Original (site.slogan, Netwitchers eigene Brand-
    // Statement-Zeile) nie übersetzt wird.
    tagline: "Magic in Every Click",
    description:
      "وكالة رقمية واستوديو محتوى في برلين. ننتج محتوى يلفت الانتباه وحملات تجلب لك العملاء.",
    servicesHeading: "الخدمات",
    studioLink: "إنتاج المحتوى والاستوديو",
    allServicesLink: "جميع الخدمات",
    companyHeading: "نتويتشر",
    aboutLink: "من نحن",
    portfolioLink: "أعمالنا",
    productsLink: "منتجاتنا / FekraHub",
    blogLink: "المدونة",
    contactLink: "تواصل معنا",
    imprintLink: "بيانات الناشر",
    privacyLink: "سياسة الخصوصية",
    termsLink: "الشروط والأحكام",
    contactHeading: "تواصل معنا",
    whatsappLink: "راسلنا عبر واتساب",
    countryLabel: "برلين، ألمانيا",
    bookIntroCta: "احجز مكالمة تعارف",
    copyrightCity: "برلين",
  },
  whatsapp: {
    ariaLabel: "راسلنا عبر واتساب",
    tooltip: "راسلنا مباشرة عبر واتساب",
    defaultMessage:
      "مرحباً نتويتشر! أنا مهتم بخدمات المحتوى والتسويق، وأود حجز مكالمة تعارف مجانية.",
  },
  notFound: {
    title: "404",
    heading: "يبدو أن هذه الصفحة اختفت في الفراغ الرقمي.",
    body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لا داعي للقلق، ستجد كل ما تحتاجه في الصفحة الرئيسية أو في صفحة خدماتنا.",
    homeCta: "الصفحة الرئيسية",
    servicesCta: "عرض الخدمات",
  },
  portfolio: {
    breadcrumbAriaLabel: "مسار التصفح",
    visitWebsite: "زيارة الموقع",
    servicesLabel: "الخدمات",
    areaLabel: "المجال",
    yearLabel: "السنة",
    previewBadge: "معاينة · المحتوى قريباً",
    aboutProject: "عن المشروع",
    websiteSectionTitle: "الموقع الإلكتروني.",
    videosSectionTitle: "ريلز وفيديوهات.",
    videoSectionTitle: "فيديو.",
    tapToPlay: "اضغط للتشغيل",
    imagesSectionTitle: "الصور.",
    motivesCount: (n) => `${n} صورة`,
    printSectionTitle: "مطبوعات وبوسترات.",
    socialSectionTitle: "سوشيال ميديا.",
    feedSelection: "مختارات من الفيد",
    postComingSoon: "المنشور قريباً",
    productSectionTitle: "المنتج.",
    experienceSectionTitle: "التجربة.",
    screenshotComingSoon: "لقطة الشاشة قريباً",
    comingSoon: "قريباً",
    resultsSectionTitle: "النتائج.",
    nextProjectLabel: "المشروع التالي",
    allProjectsLabel: "جميع المشاريع",
    viewLabel: "عرض",
    filterAriaLabel: "تصفية المشاريع",
    allFilter: "الكل",
    projectCountSingular: "مشروع",
    projectCountPlural: "مشاريع",
    emptyCategory: "سنعرض قريباً أولى المشاريع في هذه الفئة.",
    ctaTopics: {
      web: "موقع إلكتروني",
      ecommerce: "متجر إلكتروني",
      "social-video": "سوشيال ميديا",
      photo: "جلسة تصوير",
      design: "الهوية البصرية",
      software: "برمجيات",
      ai: "برمجيات",
    },
    kindLabels: { website: "موقع إلكتروني", video: "فيديو وسوشيال ميديا", software: "برمجيات", visual: "تصميم وتصوير" },
    viewProject: "عرض المشروع",
    screenshotFollowsDesktop: "لقطة شاشة سطح المكتب قريباً",
    screenshotFollowsMobile: "لقطة شاشة الجوال قريباً",
    mediaComingSoonImage: "الصورة قريباً",
    mediaComingSoonVideo: "الفيديو قريباً",
    defaultFeaturesHeading: "الوظائف الأساسية",
    prevImageAria: "الصورة السابقة",
    nextImageAria: "الصورة التالية",
    closeAria: "إغلاق",
    enlargeImage: (alt) => `تكبير ${alt}`,
    clientsWeWorkWith: "العلامات التجارية التي نعمل معها",
    viewClient: (client) => `عرض ${client}`,
    logoAlt: (client) => `شعار ${client}`,
    instagramFallbackLink: "مشاهدة المنشور على إنستغرام",
    playVideo: (title) => `تشغيل ${title}`,
    videoComingSoon: (title) => `${title}، الفيديو قريباً`,
  },
};

export function getDict(locale: Locale): Dictionary {
  return locale === "ar" ? ar : de;
}
