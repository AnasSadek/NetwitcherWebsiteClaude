import { media } from "./media";
import type { AccentColor } from "./services";
import type {
  PortfolioProject,
  Ratio,
  StripItem,
  PortfolioCategory,
} from "./portfolio";

/* ------------------------------------------------------------------------
   PORTFOLIO (ARABISCH) – arabische Übersetzung der Projektdaten
   ------------------------------------------------------------------------
   Spiegelt lib/portfolio.ts 1:1 (gleiche Reihenfolge, gleiche Slugs, gleiche
   Medien-Pfade und Links). Nur Text-Felder sind ins Arabische übersetzt.
   lib/portfolio.ts bleibt unverändert; diese Datei ist rein additiv.
   ------------------------------------------------------------------------ */

/** Kategorien für Filter & Navigation (AR). Gleiche ids/Farben/Reihenfolge
 *  wie PORTFOLIO_CATEGORIES, nur das Label ist übersetzt. */
export const PORTFOLIO_CATEGORIES_AR = [
  { id: "web", label: "مواقع إلكترونية", color: "mint" },
  { id: "ecommerce", label: "التجارة الإلكترونية", color: "mint" },
  { id: "social-video", label: "سوشيال ميديا وفيديو", color: "pink" },
  { id: "photo", label: "التصوير الفوتوغرافي", color: "sun" },
  { id: "design", label: "التصميم والهوية البصرية", color: "sun" },
  { id: "software", label: "برمجيات وتطبيقات", color: "violet" },
  { id: "ai", label: "الذكاء الاصطناعي والأتمتة", color: "sky" },
] as const satisfies readonly { id: string; label: string; color: AccentColor }[];

/* ------------------------------------------------------------------------
   PROJEKTE (ARABISCH)
   Reihenfolge und Slugs identisch zu portfolioProjects.
   ------------------------------------------------------------------------ */

export const portfolioProjectsAr: PortfolioProject[] = [
  {
    slug: "fekrahub",
    client: "FekraHub",
    title: "إدارة مدرسية بمفهوم جديد",
    description:
      "منصة سحابية للمدارس الناطقة بالعربية في أوروبا، تجمع الإدارة والمعلمين والطلاب وأولياء الأمور في نظام واحد متكامل.",
    year: "منذ 2023",
    categories: ["software"],
    services: ["تصميم UI/UX", "تطبيق ويب", "تطوير SaaS"],
    industry: "تقنية التعليم",
    color: "violet",
    featured: true,
    logo: "/portfolio/fekrahub/logo.png",
    cover: {
      src: "/portfolio/fekrahub/hero-image-fekrahub.webp",
      alt: "FekraHub، نظرة عامة على منصة إدارة المدارس",
      ratio: "16/10",
    },
    screens: [
      {
        src: "/portfolio/fekrahub/hero-image-fekrahub.webp",
        alt: "FekraHub، منصة إدارة المدرسة على اللابتوب والتابلت والهاتف الذكي",
        ratio: "16/10",
      },
    ],
    features: {
      eyebrow: "لماذا FekraHub",
      heading: "الميزات الأساسية",
      intro: "كل ما تحتاجه المدارس ليوم دراسي بسيط ومترابط – في منصة واحدة.",
      items: [
        { icon: "users", title: "إدارة الطلاب", description: "إدارة الطلاب والصفوف والملفات الشخصية من مكان واحد." },
        { icon: "calendar-check", title: "الحضور والدرجات", description: "تسجيل الحضور ومتابعة الأداء الدراسي بوضوح." },
        { icon: "book", title: "الحصص والواجبات", description: "تنظيم الحصص والواجبات والمحتوى التعليمي بسهولة." },
        { icon: "message-circle", title: "التواصل", description: "ربط الإدارة والمعلمين وأولياء الأمور والطلاب مباشرة." },
        { icon: "bar-chart", title: "التقارير والتحليلات", description: "تحليل بيانات المدرسة بوضوح وإعداد التقارير." },
        { icon: "shield-check", title: "الأدوار وصلاحيات الوصول", description: "التحكم في الصلاحيات لكل من الإدارة والمعلمين والموظفين." },
      ],
    },
    gallery: [
      { label: "قائمة الحضور", image: { src: "/portfolio/fekrahub/gallery-attendance.webp", alt: "FekraHub، قائمة حضور مُصدَّرة بصيغة PDF", ratio: "4/3" } },
      { label: "التواصل", image: { src: "/portfolio/fekrahub/gallery-messages.webp", alt: "FekraHub، الرسائل ومشاركة الملفات", ratio: "4/3" } },
      { label: "مواد الدورات", image: { src: "/portfolio/fekrahub/gallery-course-files.webp", alt: "FekraHub، مواد ومستندات الدورات", ratio: "4/3" } },
      { label: "الأدوار والصلاحيات", image: { src: "/portfolio/fekrahub/gallery-roles.webp", alt: "FekraHub، أدوار المستخدمين والصلاحيات", ratio: "4/3" } },
      { label: "التقويم", image: { src: "/portfolio/fekrahub/gallery-calendar.webp", alt: "FekraHub، تقويم الدورات مع خيارات التصفية", ratio: "4/3" } },
    ],
    story: [
      {
        heading: "التحدي",
        body: "تعتمد الكثير من المدارس على أنظمة منفصلة للحضور والدرجات والجداول الدراسية والواجبات والتواصل، ما يجعل اليوم الدراسي معقدًا دون داعٍ.",
      },
      {
        heading: "الحل",
        body: "يجمع FekraHub كل العمليات المدرسية المهمة في منصة مركزية واحدة، مع صلاحيات دخول مخصصة للإدارة والمعلمين والطلاب وأولياء الأمور.",
      },
      {
        heading: "الميزات الأساسية",
        body: "إدارة الطلاب والموظفين · الحضور والدرجات · الواجبات والحصص · الجداول الدراسية · لوحات تحكم لأولياء الأمور والطلاب · التواصل والتقارير",
      },
      {
        heading: "النتيجة",
        body: "منصة مدرسية واضحة ومترابطة تبسّط العمليات الإدارية وتتيح الوصول إلى المعلومات لكل الأطراف المعنية من مكان واحد.",
      },
    ],
    links: [{ label: "المزيد عن FekraHub", href: "/produkte/fekrahub" }],
    servicesSection: {
      eyebrow: "خدماتنا",
      heading: "من الفكرة إلى المنصة الرقمية",
      intro:
        "بالنسبة لـ FekraHub، جمعنا بين الهوية التجارية وتطوير المنتج الرقمي والمحتوى – من الموقع الإلكتروني إلى تطبيق ويب فعّال ووسائل تواصل بصري مؤثرة.",
      accentColors: ["#0FB9F2", "#8B5CF6", "#0FB9F2"],
      items: [
        {
          icon: "monitor",
          title: "تصميم وتطوير المواقع",
          description: "تصميم وتطوير موقع إلكتروني حديث يُبرز هوية FekraHub بوضوح ويقدّم المنصة بشكل مفهوم.",
        },
        {
          icon: "app-window",
          title: "برمجيات / تطبيق ويب",
          description: "تطوير تطبيق ويب مركزي لإدارة المدرسة والتواصل والتدريس والعمليات الرقمية.",
        },
        {
          icon: "video",
          title: "إنتاج الفيديو",
          description: "إنتاج محتوى مرئي وفيديوهات توضح ميزات FekraHub وفوائده وطرق استخدامه بشكل مبسّط.",
        },
      ],
      closingStatement:
        "يتكامل التصميم والتقنية والمحتوى في FekraHub لتقديم منصة رقمية لا تعمل بكفاءة فحسب، بل تتواصل بوضوح وتُعرض باحترافية.",
    },
  },
  {
    slug: "frida-eu",
    client: "FridaEU",
    title: "تجربة تجارة إلكترونية رقمية لعلامة عطور منزلية عصرية",
    description:
      "FridaEU علامة تجارية لمعطرات المنازل ومنتجات التنظيف المعطرة. كان الهدف تطوير تجربة تسوق رقمية تجمع بين اكتشاف العطور وقصة العلامة التجارية والتجارة الإلكترونية.",
    year: 2025,
    categories: ["ecommerce", "web", "design"],
    services: ["التجارة الإلكترونية", "تجربة العلامة التجارية", "تصميم المواقع"],
    color: "sky",
    featured: true,
    logo: "/portfolio/frida-eu/logo.webp",
    cover: {
      src: "/portfolio/frida-eu/device-showcase.webp",
      alt: "FridaEU، المتجر الإلكتروني على اللابتوب والتابلت والهاتف الذكي – لقطات حقيقية من الموقع",
      ratio: "16/10",
    },
    screenSections: [
      {
        title: "المحتوى الاجتماعي وبناء العلامة التجارية",
        body: [
          "إلى جانب المتجر الإلكتروني، تم دعم FridaEU بمحتوى إبداعي على وسائل التواصل الاجتماعي.",
          "تجمع صيغ الفيديو على إنستغرام وتيك توك بين الترفيه وعرض المنتج والتواصل مع الجمهور، لتعزّز الرابط مع المجتمع.",
        ],
        screens: [],
        reels: [
          { href: "https://www.instagram.com/reel/DbgOB2qDKIK/" },
          { href: "https://www.instagram.com/reel/DcQcFE9gJEf/" },
          { href: "https://www.instagram.com/reel/DVHBZEmEbrY/" },
          { href: "https://www.instagram.com/reel/DU3kdkXijd2/" },
          { href: "https://www.instagram.com/reel/DbdpUKZD6dM/" },
        ],
      },
      {
        title: "النتيجة",
        body: "تطوّر FridaEU من متجر إلكتروني تقليدي إلى منصة علامة تجارية رقمية تجمع بين اكتشاف العطور والتجارة الإلكترونية وتجربة العلامة التجارية في رحلة عميل عصرية.",
        screens: [],
      },
    ],
    story: [
      {
        heading: "التحدي",
        body: "العطور منتجات عاطفية بطبيعتها – لكن التجربة المباشرة لشمّ الرائحة تغيب عبر الإنترنت. كان التحدي يكمن في تقديم عوالم العطور المختلفة بشكل مفهوم، وبناء الثقة، وتوجيه العملاء بسهولة نحو المنتج المناسب.",
      },
      {
        heading: "الحل",
        body: "طوّرنا متجرًا إلكترونيًا عصريًا يعتمد على سرد بصري قوي ورحلة عميل واضحة. يتم تقديم المنتجات من خلال عوالم عطرية ومجالات استخدام وباقات مخصصة، ما يسهّل على العملاء الاكتشاف والمقارنة والشراء.",
      },
      {
        heading: "التجربة والميزات",
        body: "عوالم عطرية لاختيار المنتج بسهولة · تجربة تسوق تركّز على المنتج · باقات عطور قابلة للتخصيص · تجارة إلكترونية مصممة أولاً للهاتف · دمج قصة العلامة التجارية مع المحتوى الاجتماعي · تجربة استخدام متعددة اللغات",
      },
    ],
    hideNextProject: true,
    links: [{ label: "زيارة الموقع", href: "https://fridaeu.com" }],
    servicesSection: {
      eyebrow: "خدماتنا",
      heading: "من التجارة الإلكترونية إلى التسويق القائم على الأداء",
      intro: [
        "بالنسبة لـ FridaEU، لم نكتفِ بتطوير متجر إلكتروني، بل بنينا منظومة رقمية متكاملة تجمع بين العلامة التجارية والمحتوى والتجارة والتسويق القائم على الأداء.",
        "من البنية التقنية للمتجر الإلكتروني مرورًا بالمحتوى الاجتماعي وصولاً إلى الإعلانات المدفوعة والتجارة عبر منصات التواصل، نرافق العلامة التجارية عبر رحلة العميل الرقمية بالكامل.",
      ],
      items: [
        {
          icon: "shopping-bag",
          title: "متجر إلكتروني",
          description: "متجر إلكتروني يركّز على التحويل، يجمع بين اكتشاف المنتجات وعالم العلامة التجارية وعملية شراء سهلة.",
        },
        {
          icon: "share",
          title: "التسويق عبر وسائل التواصل الاجتماعي",
          description: "تواصل استراتيجي عبر وسائل التواصل الاجتماعي لزيادة الظهور وتعزيز الولاء للعلامة التجارية وبناء مجتمع نشط.",
        },
        {
          icon: "video",
          title: "إنتاج الفيديو والريلز",
          description: "صيغ فيديو وريلز إبداعية تُبرز المنتجات بشكل عاطفي وتجذب الانتباه على منصات التواصل الاجتماعي.",
        },
        {
          icon: "target",
          title: "إعلانات Meta",
          description: "حملات أداء على فيسبوك وإنستغرام تركّز على الوصول واكتشاف المنتجات وزيادة التحويلات.",
        },
        {
          icon: "trending-up",
          title: "إعلانات TikTok",
          description: "حملات مصممة خصيصًا للمنصة تجمع بين المحتوى الإبداعي والعرض القائم على الأداء.",
        },
        {
          icon: "shopping-cart",
          title: "متجر TikTok",
          description: "إنشاء ودمج التجارة عبر وسائل التواصل الاجتماعي، بحيث يمكن اكتشاف المنتجات وشراؤها مباشرة من حيث يُستهلك المحتوى.",
        },
      ],
      closingStatement:
        "ليست إجراءات منفصلة، بل نظام متكامل: يتكامل المتجر والمحتوى ووسائل التواصل الاجتماعي والإعلانات المدفوعة معًا، ليصبح FridaEU مرئيًا رقميًا، وقابلاً للتجربة والشراء.",
    },
  },
  {
    slug: "abziel",
    client: "ABZIEL",
    title: "سوشيال ميديا وريلز",
    description:
      "يجمع ABZiel بين التعليم والاندماج والتطور المهني في علامة تجارية رقمية قوية. من خلال موقع إلكتروني عصري وتسويق استراتيجي عبر وسائل التواصل الاجتماعي وحملات قائمة على الأداء، نُبرز العروض ونبني الثقة ونربط الأشخاص بالعروض التعليمية والتدريبية المناسبة لهم.",
    year: 2025,
    categories: ["social-video"],
    services: ["تصميم المواقع", "التسويق عبر وسائل التواصل الاجتماعي", "التسويق القائم على الأداء"],
    color: "sky",
    stripFit: "contain",
    logo: "/portfolio/abziel/logo.png",
    cover: {
      src: "/portfolio/abziel/hero-abziel.webp",
      alt: "ABZiel، الموقع الإلكتروني على اللابتوب والتابلت والهاتف الذكي",
      ratio: "16/9",
    },
    screens: [
      {
        src: "/portfolio/abziel/hero-abziel.webp",
        alt: "ABZiel، الموقع الإلكتروني على اللابتوب والتابلت والهاتف الذكي",
        ratio: "16/9",
      },
    ],
    heroContain: true,
    screenSections: [
      {
        title: "المحتوى الاجتماعي والظهور",
        body: [
          "إلى جانب الموقع الإلكتروني الجديد، يظهر ABZiel من خلال محتوى إبداعي على وسائل التواصل الاجتماعي.",
          "ريلز قصيرة وجذابة توضّح العروض التعليمية والتدريبية بشكل مبسّط، وتعزّز الرابط مع الجمهور المستهدف على إنستغرام.",
        ],
        screens: [],
        reels: [
          { href: "https://www.instagram.com/reel/DMN4j9Wqxvm/" },
          { href: "https://www.instagram.com/reel/DWy6YdfjOSL/" },
          { href: "https://www.instagram.com/reel/DWg4J9GCsat/" },
          { href: "https://www.instagram.com/reel/DUgi9cvDPwy/" },
          { href: "https://www.instagram.com/reel/DbYulPnMAxo/" },
        ],
      },
    ],
    servicesSection: {
      eyebrow: "خدماتنا",
      heading: "ظهور رقمي يبني الروابط",
      intro:
        "بالنسبة لـ ABZiel، جمعنا بين تصميم المواقع ووسائل التواصل الاجتماعي والتسويق القائم على الأداء في حضور رقمي متكامل – بهدف إبراز العروض التعليمية وبناء الثقة والوصول بفعالية إلى جمهور جديد.",
      accentColors: ["#0F85C0", "#292952", "#AA2422", "#0F85C0"],
      items: [
        {
          icon: "share",
          title: "التسويق عبر وسائل التواصل الاجتماعي",
          description: "محتوى استراتيجي وتواصل مستمر يُبرز ABZiel ويخلق رابطًا قويًا مع الجمهور المستهدف.",
        },
        {
          icon: "monitor",
          title: "تصميم وتطوير المواقع",
          description: "تصميم وتطوير موقع إلكتروني عصري يعرض العروض بوضوح ويوجّه الزوار نحو التواصل.",
        },
        {
          icon: "target",
          title: "إعلانات Meta",
          description: "حملات أداء على فيسبوك وإنستغرام تستهدف مهتمين جدد وتزيد من الاستفسارات ذات الصلة.",
        },
        {
          icon: "trending-up",
          title: "إعلانات TikTok",
          description: "حملات إبداعية مصممة للمنصة تجذب الانتباه وتصل إلى جمهور جديد عبر TikTok.",
        },
      ],
      closingStatement:
        "يتكامل الموقع الإلكتروني والمحتوى والتسويق القائم على الأداء في ABZiel – لمزيد من الظهور والثقة ورابط رقمي أقوى بين العروض التعليمية والأشخاص الذين يحتاجونها.",
    },
  },
  {
    slug: "umzugly",
    client: "Umzugly",
    title: "تخطيط وإدارة عمليات الانتقال رقميًا",
    description:
      "منصة رقمية تجمع عملية الانتقال بأكملها – من الطلب وجمع البيانات إلى تحديد المواعيد والإدارة الداخلية – في نظام واحد متكامل.",
    year: 2025,
    categories: ["software"],
    services: ["تصميم UI/UX", "تطبيق ويب", "عملية الحجز", "تطوير SaaS"],
    industry: "النقل والخدمات اللوجستية",
    color: "pink",
    heroContain: true,
    galleryFrame: "laptop",
    logo: "/portfolio/umzugly/logo.webp",
    cover: {
      src: "/portfolio/umzugly/hero-umzugly-v2.webp",
      alt: "Umzugly، نظرة عامة على منصة إدارة الانتقال",
      ratio: "16/9",
    },
    screens: [
      {
        src: "/portfolio/umzugly/hero-umzugly-v2.webp",
        alt: "Umzugly، منصة إدارة الانتقال على اللابتوب والتابلت والهاتف الذكي",
        ratio: "4/3",
      },
    ],
    features: {
      eyebrow: "لماذا Umzugly",
      heading: "الميزات الأساسية",
      intro: "مسار عمل رقمي للطلب والتخطيط والإدارة.",
      accentColors: ["#E30613", "#F2684B", "#E30613", "#F4718C", "#E30613", "#F2684B"],
      items: [
        { icon: "inbox", title: "طلبات الانتقال", description: "إدارة جميع الطلبات وحالاتها من مكان واحد." },
        { icon: "calendar", title: "تحديد المواعيد", description: "تنظيم مواعيد الانتقال بوضوح في التقويم." },
        { icon: "sliders", title: "نظام تسعير مرن", description: "تخصيص الخدمات والأسعار حسب الحاجة." },
        { icon: "map-pin", title: "نطاق الخدمة والمسافة", description: "تحديد مناطق الخدمة والمسافات بمرونة." },
        { icon: "list-checks", title: "عملية طلب موجّهة", description: "إرشاد العملاء خطوة بخطوة خلال عملية الانتقال." },
        { icon: "package", title: "خدمات إضافية", description: "تسجيل خدمات مثل التغليف والتركيب والتنظيف." },
      ],
    },
    gallery: [
      { label: "إدارة الطلبات", image: { src: "/portfolio/umzugly/gallery-request-overview.jpg", alt: "Umzugly، نظرة عامة على جميع طلبات الانتقال وحالاتها", ratio: "4/3" } },
      { label: "تفاصيل الانتقال", image: { src: "/portfolio/umzugly/gallery-moving-details.jpg", alt: "Umzugly، تسجيل موجّه لمكان الانتقال منه وتفاصيل الانتقال", ratio: "4/3" } },
      { label: "تقويم المواعيد", image: { src: "/portfolio/umzugly/gallery-calendar.jpg", alt: "Umzugly، تقويم داخلي بمواعيد الانتقال", ratio: "4/3" } },
      { label: "خدمات إضافية", image: { src: "/portfolio/umzugly/gallery-additional-services.jpg", alt: "Umzugly، اختيار خدمات إضافية مثل التغليف والتركيب", ratio: "4/3" } },
      { label: "إعداد الأسعار", image: { src: "/portfolio/umzugly/gallery-pricing-config.jpg", alt: "Umzugly، إعداد الأسعار والخدمات", ratio: "4/3" } },
      { label: "مكان الانتقال إليه", image: { src: "/portfolio/umzugly/gallery-destination.jpg", alt: "Umzugly، تسجيل مكان الانتقال إليه ضمن عملية الطلب", ratio: "4/3" } },
      { label: "خدمات إضافية (الانتقال إليه)", image: { src: "/portfolio/umzugly/gallery-move-in-services.jpg", alt: "Umzugly، اختيار خدمات إضافية عند الانتقال إلى المكان الجديد", ratio: "4/3" } },
      { label: "نطاق الخدمة", image: { src: "/portfolio/umzugly/gallery-service-area.jpg", alt: "Umzugly، إعداد نطاق الخدمة والمسافة القصوى", ratio: "4/3" } },
      { label: "التخصيص", image: { src: "/portfolio/umzugly/gallery-customization.jpg", alt: "Umzugly، تخصيص نموذج التواصل وصفحة الشكر", ratio: "4/3" } },
      { label: "اختيار الموعد", image: { src: "/portfolio/umzugly/gallery-date-selection.jpg", alt: "Umzugly، اختيار الموعد ومصدر الدفع ضمن عملية الطلب", ratio: "4/3" } },
      { label: "بيانات التواصل", image: { src: "/portfolio/umzugly/gallery-contact.jpg", alt: "Umzugly، تسجيل بيانات التواصل", ratio: "4/3" } },
      { label: "تأكيد البريد الإلكتروني", image: { src: "/portfolio/umzugly/gallery-email-verification.jpg", alt: "Umzugly، تأكيد عنوان البريد الإلكتروني برمز التحقق", ratio: "4/3" } },
    ],
    story: [
      {
        heading: "التحدي",
        body: "تحتوي طلبات الانتقال على الكثير من المعلومات المتغيرة – من العناوين وتفاصيل السكن إلى الخدمات الإضافية والمواعيد. وسرعان ما يصبح جمع هذه البيانات وإدارتها داخليًا أمرًا معقدًا.",
      },
      {
        heading: "الحل",
        body: "طوّرنا منصة رقمية ترشد العملاء خطوة بخطوة خلال طلب الانتقال، وتمنح الشركة في الوقت نفسه واجهة مركزية للطلبات والمواعيد والإعدادات.",
      },
      {
        heading: "الميزات الأساسية",
        body: "طلب رقمي · تفاصيل الانتقال · خدمات إضافية · تحديد المواعيد · إعداد الأسعار والخدمات · لوحة تحكم إدارية",
      },
      {
        heading: "النتيجة",
        body: "مسار عمل رقمي متكامل يبسّط عملية الطلب للعملاء، ويجعل معالجة عمليات الانتقال داخليًا أكثر وضوحًا وكفاءة.",
      },
    ],
    servicesSection: {
      eyebrow: "خدماتنا",
      heading: "المنتج الرقمي يلتقي بالمحتوى",
      intro:
        "بالنسبة لـ Umzugly، جمعنا بين تطوير المنتج والمحتوى – عبر تطبيق ويب مخصص لعمليات الانتقال الرقمية وريلز جذابة للتواصل مع الجمهور.",
      accentColors: ["#E30613"],
      items: [
        {
          icon: "laptop",
          title: "تطبيق ويب",
          description: "تصميم وتطوير تطبيق ويب رقمي يجمع طلبات الانتقال وتحديد المواعيد والعمليات الداخلية في نظام واحد.",
        },
        {
          icon: "video",
          title: "ريلز",
          description: "صيغ فيديو قصيرة وديناميكية تُبرز Umzugly وتوضّح خدماته وتجذب الانتباه على وسائل التواصل الاجتماعي.",
        },
      ],
      closingStatement:
        "تتكامل التقنية والمحتوى في Umzugly: يبسّط تطبيق الويب العملية، بينما تجعل الريلز العلامة التجارية مرئية ومفهومة للخارج.",
    },
  },
  {
    slug: "falioun-academy",
    client: "Falioun Academy",
    title: "المحتوى والتسويق القائم على الأداء",
    description:
      "تجمع Falioun Academy بين التدريب العملي وآفاق مستقبلية حقيقية. من خلال برنامج مكثف لتأهيل فنيي تركيب الطاقة الشمسية، وتدريب عملي حقيقي، وأدوات تخطيط احترافية، يتم إعداد المشاركين خطوة بخطوة لدخول قطاع الطاقة الشمسية – من الفهم التقني الأول وصولاً إلى التركيب والصيانة الاحترافيين.",
    year: 2025,
    categories: ["social-video"],
    services: ["إنتاج الفيديو", "التسويق القائم على الأداء"],
    color: "sun",
    heroContain: true,
    logo: "/portfolio/falioun-academy/logo.webp",
    cover: {
      src: "/portfolio/falioun-academy/hero-falioun.webp",
      alt: "Falioun Academy، تدريب فنيي تركيب الطاقة الشمسية",
      ratio: "16/9",
    },
    screens: [
      {
        src: "/portfolio/falioun-academy/hero-falioun.webp",
        alt: "Falioun Academy، تدريب فنيي تركيب الطاقة الشمسية",
        ratio: "16/9",
      },
    ],
    screenSections: [
      {
        title: "المحتوى الاجتماعي والظهور",
        body: [
          "ريلز قصيرة وديناميكية تعرض التدريب والممارسة العملية وفرص العمل في Falioun Academy بأسلوب صادق ومفهوم.",
          "يجعل المحتوى برنامج التأهيل قابلاً للتجربة، ويخلق اهتمامًا بدخول قطاع الطاقة الشمسية.",
        ],
        screens: [],
        reels: [
          { href: "https://www.instagram.com/reel/DV3rZmljuPk/" },
          { href: "https://www.instagram.com/reel/DQUIAuTABPu/" },
          { href: "https://www.instagram.com/reel/DO9L71Nitst/" },
        ],
      },
    ],
    servicesSection: {
      eyebrow: "خدماتنا",
      heading: "محتوى وأداء لمزيد من الظهور",
      intro:
        "بالنسبة لـ Falioun Academy، جمعنا بين المحتوى المرئي والحملات القائمة على الأداء لتقديم برنامج التأهيل بوضوح، وخلق اهتمام، والوصول إلى مشاركين جدد بشكل مستهدف.",
      accentColors: ["#E4141C", "#D1A61E"],
      items: [
        {
          icon: "video",
          title: "إنتاج الفيديو",
          description: "إنتاج صيغ فيديو وريلز ديناميكية تنقل التدريب والممارسة وفرص العمل بأسلوب صادق ومفهوم.",
        },
        {
          icon: "target",
          title: "الحملات الإعلانية وإعلانات Meta",
          description: "حملات أداء مستهدفة على فيسبوك وإنستغرام للوصول إلى الجمهور المناسب واستقطاب مهتمين مؤهلين للأكاديمية.",
        },
      ],
      closingStatement:
        "محتوى قوي يلتقي بأداء مستهدف: تجعل الفيديوهات البرنامج قابلاً للتجربة، بينما تصل إعلانات Meta إلى الأشخاص المناسبين تمامًا حيث ينشأ الاهتمام.",
    },
  },
  {
    slug: "louic",
    client: "LOUIC",
    title: "حملة إعلانات Google",
    description:
      "يمثّل LOUIC خدمات سحب ونقل سريعة وموثوقة على مدار الساعة. بفضل التواجد على مدار 24/7 وسائقين ذوي خبرة وحلول مرنة، يضمن LOUIC وصول العملاء بسرعة وأمان في حالات الأعطال أو الحوادث أو نقل المركبات.",
    year: 2025,
    categories: ["social-video"],
    services: ["إعلانات Google", "التسويق القائم على الأداء"],
    color: "sun",
    heroContain: true,
    hideScreensShowcase: true,
    logo: "/portfolio/louic/logo.png",
    cover: {
      src: "/portfolio/louic/hero-louic.webp",
      alt: "LOUIC، شاحنة نقل السيارات أثناء العمل",
      ratio: "16/9",
    },
    screens: [
      {
        src: "/portfolio/louic/hero-louic.webp",
        alt: "LOUIC، شاحنة نقل السيارات أثناء العمل",
        ratio: "16/9",
      },
    ],
    servicesSection: {
      eyebrow: "خدماتنا",
      heading: "حاضرون عند الحاجة إلى مساعدة سريعة",
      intro:
        "بالنسبة لـ LOUIC، نعتمد على إعلانات Google المستهدفة للوصول إلى الأشخاص في اللحظة التي يبحثون فيها بنشاط عن خدمة سحب أو مساعدة على الطريق أو نقل مركبات.",
      accentColors: ["#F5C518"],
      items: [
        {
          icon: "search",
          title: "إعلانات Google",
          description: "حملات بحث مستهدفة تُظهر LOUIC بالضبط عندما يبحث الأشخاص بشكل عاجل عن خدمة سحب أو مساعدة على الطريق أو نقل مركبات.",
        },
      ],
      closingStatement:
        "بفضل إعلانات Google، يظهر LOUIC في اللحظة الحاسمة – بالضبط عندما تكون المساعدة السريعة مطلوبة.",
    },
  },
  {
    slug: "netwitcher",
    client: "Netwitcher",
    title: "الاستراتيجية والإبداع والتقنية في منظومة واحدة",
    description:
      "Netwitcher أكثر من مجرد وكالة رقمية – نحن نجمع بين الاستراتيجية والإبداع والتقنية في منظومة رقمية واحدة تُبرز العلامات التجارية وتحقق النمو. من الهوية البصرية والمحتوى، مرورًا بوسائل التواصل الاجتماعي والتسويق القائم على الأداء، وصولاً إلى المواقع الإلكترونية، نطوّر كل نقطة تواصل بهدف واضح: تحويل الانتباه إلى نتائج قابلة للقياس.",
    year: 2025,
    categories: ["web", "design", "social-video"],
    services: ["تصميم المواقع", "الهوية البصرية والتصميم", "سوشيال ميديا", "المحتوى والفيديو", "التسويق القائم على الأداء"],
    color: "violet",
    featured: true,
    useBrandLogo: true,
    cover: {
      src: media.studio.webp,
      alt: "إعداد تصوير المنتجات في استوديو المحتوى في برلين: صناديق إضاءة، كاميرا على حامل ثلاثي، طاولة تصوير",
      ratio: "16/9",
    },
    servicesSection: {
      eyebrow: "ما نقوم به من أجل Netwitcher",
      heading: "علامة واحدة. منظومة واحدة. كل شيء من مصدر واحد.",
      intro:
        "Netwitcher هو ملعبنا الرقمي الخاص. هنا نجمع بين الاستراتيجية والتصميم والمحتوى والتقنية والتسويق القائم على الأداء في علامة تجارية تصب فيها كل نقطة تواصل في التي تليها.",
      accentColors: ["#2EE6C8", "#8B5CF6", "#F468A8", "#F5D33D", "#0FB9F2"],
      items: [
        {
          icon: "monitor",
          title: "تصميم وتطوير المواقع",
          description: "تصميم وتطوير حضور رقمي يُبرز علامتنا التجارية بوضوح ويقود الزوار من الانطباع الأول وحتى التواصل معنا.",
        },
        {
          icon: "share",
          title: "سوشيال ميديا",
          description: "تواصل استراتيجي ومحتوى مستمر يُبرز علامتنا التجارية ويعكس شخصيتها ويبني مجتمعًا نشطًا.",
        },
        {
          icon: "video",
          title: "المحتوى وإنتاج الفيديو",
          description: "صور وريلز وفيديوهات من استوديو المحتوى الخاص بنا – مصمَّمة لجذب الانتباه وجعل العلامات التجارية قابلة للتجربة.",
        },
        {
          icon: "palette",
          title: "الهوية البصرية والتصميم",
          description: "هوية بصرية متسقة تجمع بين الشعار والألوان والخطوط والتصميم في عالم علامة تجارية مميز.",
        },
        {
          icon: "target",
          title: "إعلانات Meta",
          description: "حملات قائمة على الأداء على فيسبوك وإنستغرام تجمع بين المحتوى الإبداعي والوصول المستهدف والنتائج القابلة للقياس.",
        },
      ],
      closingStatement:
        "ليست تخصصات منفصلة، بل منظومة مترابطة: الهوية البصرية تخلق التمييز، والمحتوى يجذب الانتباه، ووسائل التواصل الاجتماعي تبني العلاقات، والإعلانات توسّع الوصول، والموقع الإلكتروني يحوّل الاهتمام إلى تواصل فعلي.",
    },
    reelsSection: {
      eyebrow: "من استوديونا",
      heading: "محتوى لا يمكن تجاوزه بسحبة إصبع",
      intro: "الفكرة والكاميرا والإضاءة والمونتاج – تُصنع ريلزنا حيث تلتقي الاستراتيجية بالإنتاج الإبداعي.",
      reels: [
        { href: "https://www.instagram.com/reel/Db3bvXEtfge/" },
        { href: "https://www.instagram.com/reel/DZfsLwvCSSk/" },
        { href: "https://www.instagram.com/reel/DYfGIh-NUQJ/" },
        { href: "https://www.instagram.com/reel/DaVJaU8oWXE/" },
      ],
    },
    clientsSection: {
      eyebrow: "عملاؤنا",
      heading: "علامات تجارية تمنحنا ثقتها",
      intro:
        "من التجارة الإلكترونية والتعليم إلى البرمجيات والخدمات والشركات المحلية – نطوّر حلولاً رقمية لعلامات تجارية بأهداف متنوعة.",
    },
    brandStatement: {
      heading: "MAGIC IN EVERY CLICK.",
      body: "من الفكرة الأولى وحتى آخر نقرة، نطوّر تجارب رقمية تعمل فيها الاستراتيجية والإبداع والتقنية معًا.",
    },
  },
];

/* ------------------------------------------------------------------------
   Helfer (ARABISCH)
   ------------------------------------------------------------------------ */

export const getProjectAr = (slug: string) =>
  portfolioProjectsAr.find((p) => p.slug === slug);

export const getCategoryAr = (id: PortfolioCategory) =>
  PORTFOLIO_CATEGORIES_AR.find((c) => c.id === id)!;

/** Kategorien, die tatsächlich Projekte enthalten, mit Anzahl. */
export function categoriesInUseAr() {
  return PORTFOLIO_CATEGORIES_AR.map((c) => ({
    ...c,
    count: portfolioProjectsAr.filter((p) => p.categories.includes(c.id)).length,
  })).filter((c) => c.count > 0);
}

export function adjacentProjectsAr(slug: string) {
  const i = portfolioProjectsAr.findIndex((p) => p.slug === slug);
  const n = portfolioProjectsAr.length;
  return {
    prev: portfolioProjectsAr[(i - 1 + n) % n],
    next: portfolioProjectsAr[(i + 1) % n],
  };
}

/** Medienauswahl für den Filmstreifen im Hero: genau eine Karte je Projekt
 *  (Cover-Bild). `FilmStrip` dupliziert die Liste separat für den
 *  nahtlosen Endlos-Loop — hier bleibt jedes Projekt ein einzelner Eintrag. */
export function stripMediaAr(): StripItem[] {
  return portfolioProjectsAr.map((p) => ({
    slug: p.slug,
    client: p.client,
    color: p.color,
    ratio: p.cover.ratio ?? "16/10",
    src: p.cover.src,
    alt: p.cover.alt,
    kind: "image",
    fit: p.stripFit,
  }));
}
