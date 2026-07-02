export type AccentColor = "mint" | "violet" | "pink" | "sun" | "sky";

export type Service = {
  slug: string;
  href: string;
  title: string;
  navTitle: string;
  color: AccentColor;
  icon:
    | "camera"
    | "megaphone"
    | "target"
    | "monitor"
    | "search"
    | "sparkles"
    | "play"
    | "code"
    | "wrench"
    | "printer";
  teaser: string;
  bullets: string[];
  cta: string;
  hero: {
    eyebrow: string;
    headline: string;
    intro: string;
  };
  sections: { heading: string; body: string }[];
  deliverables: string[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "studio",
    href: "/studio",
    title: "Content Creation & Studio Berlin",
    navTitle: "Content Creation & Studio",
    color: "pink",
    icon: "camera",
    teaser:
      "Produktfotos, Reels, Kampagnenvisuals und Social-Media-Content – produziert in unserem eigenen Studio in Berlin, geplant mit Strategie und gebaut für Conversion.",
    bullets: [
      "Produktfotografie",
      "Reels & Short-Form-Videos",
      "Kampagnenvisuals",
      "Social Media Content",
      "UGC-Content",
      "Studio-Shootings in Berlin",
    ],
    cta: "Content produzieren lassen",
    hero: {
      eyebrow: "Content Creation Berlin",
      headline: "Content, der nicht nur gut aussieht – sondern arbeitet.",
      intro:
        "In unserem Content-Studio in Berlin produzieren wir Fotos, Reels und Videos mit einem klaren Auftrag: Aufmerksamkeit stoppen, Vertrauen aufbauen, Anfragen auslösen. Jede Produktion startet mit deiner Zielgruppe – nicht mit der Kamera.",
    },
    sections: [
      {
        heading: "Strategie zuerst, dann Produktion",
        body: "Bevor wir eine einzige Aufnahme machen, klären wir: Wen willst du erreichen, auf welcher Plattform, mit welchem Ziel? Daraus entsteht ein Content-Konzept mit Hooks, Formaten und einem Shotplan. So verlässt kein Material unser Studio, das keinen Job hat.",
      },
      {
        heading: "Ein Shooting, ein ganzer Content-Monat",
        body: "Wir planen Produktionen so, dass aus einem Studiotag ein kompletter Content-Vorrat entsteht: Produktbilder für den Shop, Reels für Instagram und TikTok, Werbevideos für Ads und Bildmaterial für Website und Landingpages – alles im konsistenten Look deiner Marke.",
      },
      {
        heading: "Gebaut für die Plattform, nicht dagegen",
        body: "Ein Reel funktioniert anders als ein Werbespot, ein TikTok anders als ein LinkedIn-Post. Wir produzieren nativ für jede Plattform: Hook in den ersten zwei Sekunden, vertikales Framing, Untertitel, Schnittrhythmus – damit dein Content organisch und in Ads performt.",
      },
    ],
    deliverables: [
      "Content-Konzept & Shotplan",
      "Studio-Shooting in Berlin",
      "Produktfotografie (E-Commerce, Food, Beauty)",
      "Reels & Short-Form-Videos, fertig geschnitten",
      "Werbevideos für Meta & TikTok Ads",
      "UGC- und Behind-the-Scenes-Content",
      "Bildmaterial für Website & Landingpages",
      "Nutzungsrechte klar geregelt",
    ],
    faq: [
      {
        q: "Wie schnell bekommen wir fertigen Content?",
        a: "Je nach Umfang liefern wir erste Ergebnisse innerhalb von 5–10 Werktagen nach dem Shooting. Für Kampagnen mit festem Starttermin planen wir rückwärts vom Livegang.",
      },
      {
        q: "Müssen wir für ein Shooting nach Berlin kommen?",
        a: "Nein. Produkte kannst du uns einfach zusenden – wir übernehmen Set-Design, Produktion und Rückversand. Für Shootings mit Team oder Personen empfangen wir dich gern im Studio.",
      },
      {
        q: "Produziert ihr auch laufend, nicht nur einmalig?",
        a: "Ja. Die meisten Kunden starten mit einer Erstproduktion und gehen dann in ein monatliches Content-Paket über – mit festen Produktionsslots und planbarem Output.",
      },
    ],
    seo: {
      title: "Content Creation Berlin – Studio für Fotos, Reels & Video | Netwitcher",
      description:
        "Content Creation in Berlin: Produktfotografie, Reels, Werbevideos und Social-Media-Content aus unserem eigenen Studio. Strategisch geplant, auf Conversion produziert. Jetzt Studio-Shooting anfragen.",
    },
  },
  {
    slug: "foto-videoproduktion",
    href: "/leistungen/foto-videoproduktion",
    title: "Foto- & Videoproduktion",
    navTitle: "Foto- & Videoproduktion",
    color: "sun",
    icon: "play",
    teaser:
      "Produktfotografie, Werbevideos, Promo-Clips und Motion Graphics – produziert im Berliner Studio oder bei dir vor Ort, geschnitten für Social Media und Ads.",
    bullets: [
      "Produktfotografie",
      "Werbe- & Promo-Videos",
      "Social-Media-Videos",
      "Motion Graphics",
      "Erklärvideos",
      "Imagefilme",
    ],
    cta: "Video produzieren lassen",
    hero: {
      eyebrow: "Video Produktion Berlin",
      headline: "Bilder, die Vertrauen schaffen. Videos, die verkaufen.",
      intro:
        "Menschen kaufen von Marken, die professionell aussehen. Wir produzieren Fotos und Videos, die deine Marke hochwertig zeigen – und schneiden sie so, dass sie auf Instagram, TikTok, YouTube und in Ads messbar funktionieren.",
    },
    sections: [
      {
        heading: "Produktfotografie, die den Preis rechtfertigt",
        body: "Ob E-Commerce-Freisteller, Food-Shooting oder Beauty-Content: Wir inszenieren deine Produkte mit Licht, Set-Design und Nachbearbeitung so, dass sie im Feed auffallen und im Shop überzeugen. Der Unterschied zu Smartphone-Bildern ist sofort sichtbar – und messbar in der Conversion-Rate.",
      },
      {
        heading: "Werbevideos mit Hook, nicht nur mit Logo",
        body: "Die ersten zwei Sekunden entscheiden, ob jemand weiterschaut. Unsere Werbevideos starten mit einem klaren Hook, erzählen in 15–45 Sekunden einen Nutzen und enden mit einer eindeutigen Handlungsaufforderung. Genau das Material, das Performance-Kampagnen brauchen.",
      },
      {
        heading: "Motion Design & Erklärvideos",
        body: "Komplexe Angebote brauchen einfache Bilder. Mit Motion Graphics und animierten Erklärvideos machen wir aus abstrakten Leistungen verständliche Geschichten – für Website, Pitch und Social Media.",
      },
    ],
    deliverables: [
      "Konzept, Storyboard & Shotlist",
      "Produktion im Studio Berlin oder on location",
      "Professionelles Licht-Setup & Set-Design",
      "Schnitt, Color Grading & Sounddesign",
      "Formate für alle Kanäle (9:16, 1:1, 16:9)",
      "Untertitel & plattformgerechte Exporte",
      "Motion Graphics & Animationen",
      "Rohmaterial-Archiv auf Wunsch",
    ],
    faq: [
      {
        q: "Was kostet eine Videoproduktion?",
        a: "Das hängt von Konzept, Drehtagen und Umfang ab. Ein Social-Media-Videopaket startet deutlich günstiger als ein Imagefilm. Im Erstgespräch bekommst du eine klare Einschätzung mit Festpreis-Angebot.",
      },
      {
        q: "Liefert ihr auch nur Fotos ohne Video?",
        a: "Ja. Reine Foto-Shootings – etwa Produktbilder für deinen Shop oder Teamfotos für die Website – sind ein eigenes Paket und oft der schnellste Einstieg.",
      },
      {
        q: "Können wir das Material überall verwenden?",
        a: "Ja. Du bekommst die Nutzungsrechte für alle vereinbarten Kanäle transparent geregelt – ohne versteckte Lizenzfallen.",
      },
    ],
    seo: {
      title: "Foto- & Videoproduktion Berlin – Werbevideos & Produktfotos | Netwitcher",
      description:
        "Professionelle Foto- und Videoproduktion in Berlin: Produktfotografie, Werbevideos für Social Media, Motion Graphics und Erklärvideos – produziert für Reichweite und Conversion.",
    },
  },
  {
    slug: "social-media-management",
    href: "/leistungen/social-media-management",
    title: "Social Media Management",
    navTitle: "Social Media Management",
    color: "sky",
    icon: "megaphone",
    teaser:
      "Wir übernehmen deine Kanäle komplett: Strategie, Contentplan, Design, Reels, Community und monatliches Reporting – damit deine Marke sichtbar bleibt, ohne dass du täglich posten musst.",
    bullets: [
      "Instagram, TikTok, Facebook & LinkedIn",
      "Contentplan & Redaktionskalender",
      "Post-Design & Reels",
      "Community Management",
      "Monatliche Reports",
      "Content aus dem eigenen Studio",
    ],
    cta: "Social Media betreuen lassen",
    hero: {
      eyebrow: "Social Media Agentur Berlin",
      headline: "Deine Kanäle. Unser Job. Jeden Monat sichtbar.",
      intro:
        "Regelmäßig posten reicht nicht – der Feed vergisst schnell. Wir führen deine Social-Media-Kanäle mit Strategie, eigenem Studio-Content und echtem Community Management. Du siehst jeden Monat, was gepostet wurde, was funktioniert hat und was wir daraus ableiten.",
    },
    sections: [
      {
        heading: "Ein Plan statt Posting-Panik",
        body: "Wir entwickeln einen Redaktionskalender aus Formaten, die zu deiner Zielgruppe passen: Reels für Reichweite, Karussells für Vertrauen, Stories für Nähe. Jeder Post hat einen Platz in der Strategie – nichts wird gepostet, nur weil „mal wieder was raus muss“.",
      },
      {
        heading: "Content aus unserem Studio, nicht aus der Stock-Datenbank",
        body: "Der größte Unterschied zu anderen Agenturen: Wir produzieren deinen Content selbst – Reels, Produktbilder und Kampagnenvisuals aus unserem Berliner Studio. Dein Feed sieht aus wie deine Marke, nicht wie eine Vorlagensammlung.",
      },
      {
        heading: "Community & Reporting",
        body: "Wir beantworten Kommentare und Nachrichten in deiner Markenstimme und liefern monatlich einen Report, der mehr zeigt als Follower-Zahlen: Reichweite, Interaktionen, Profilbesuche, Klicks – und die Empfehlung, was wir im nächsten Monat verstärken.",
      },
    ],
    deliverables: [
      "Kanal- & Zielgruppen-Analyse",
      "Content-Strategie & Redaktionskalender",
      "Post-Designs im Branding",
      "Reels-Produktion inkl. Schnitt",
      "Caption-Texte & Hashtag-Strategie",
      "Community Management",
      "Story-Konzepte",
      "Monatlicher Report mit Handlungsempfehlung",
    ],
    faq: [
      {
        q: "Wie viele Posts sind sinnvoll?",
        a: "Qualität schlägt Frequenz. Für die meisten Marken sind 8–16 Beiträge pro Monat plus Stories der richtige Rahmen – abgestimmt auf Plattform und Ziel. Wir empfehlen dir im Erstgespräch ein konkretes Setup.",
      },
      {
        q: "Behalten wir die Kontrolle über unsere Kanäle?",
        a: "Ja, vollständig. Die Accounts bleiben deine, Freigaben laufen über einen einfachen Prozess, und du siehst den Contentplan, bevor etwas live geht.",
      },
      {
        q: "Funktioniert das auch für B2B?",
        a: "Ja – vor allem über LinkedIn und gezielten Experten-Content. B2B-Kaufentscheidungen beginnen heute mit dem Profil-Check. Wir sorgen dafür, dass der überzeugt.",
      },
    ],
    seo: {
      title: "Social Media Agentur Berlin – Management & Content | Netwitcher",
      description:
        "Social Media Management aus Berlin: Strategie, Contentplan, Reels, Post-Design, Community Management und Reporting – mit Content aus unserem eigenen Studio.",
    },
  },
  {
    slug: "performance-marketing",
    href: "/leistungen/performance-marketing",
    title: "Performance Marketing & Ads",
    navTitle: "Performance Marketing / Ads",
    color: "violet",
    icon: "target",
    teaser:
      "Meta, TikTok und Google Ads mit sauberem Tracking, starken Creatives und laufender Optimierung – damit aus Werbebudget messbare Anfragen und Verkäufe werden.",
    bullets: [
      "Meta Ads (Facebook & Instagram)",
      "TikTok Ads",
      "Google Search Ads",
      "Kampagnen-Setup & Funnel",
      "Tracking & Conversion-Messung",
      "Laufende Optimierung & Reporting",
    ],
    cta: "Kampagnen starten",
    hero: {
      eyebrow: "Performance Marketing Agentur",
      headline: "Werbung, die sich rechnet – nicht nur Reichweite kauft.",
      intro:
        "Die meisten Kampagnen scheitern nicht am Budget, sondern an schwachen Creatives und fehlendem Tracking. Wir bauen beides: Anzeigen, die im Feed stoppen, und ein Messsystem, das dir zeigt, was jede Anfrage kostet.",
    },
    sections: [
      {
        heading: "Creatives sind 80 % der Performance",
        body: "Der Algorithmus optimiert die Auslieferung – aber ob jemand klickt, entscheidet das Creative. Weil wir Content und Ads aus einer Hand machen, testen wir laufend neue Hooks, Formate und Varianten aus unserem eigenen Studio, statt monatelang dieselbe Anzeige zu schalten.",
      },
      {
        heading: "Tracking, bevor der erste Euro fließt",
        body: "Vor dem Kampagnenstart richten wir Meta Pixel, Conversions API, Google Tag und saubere Events ein. So optimieren die Plattformen auf echte Anfragen und Käufe – und du siehst im Report echte Kosten pro Ergebnis statt geschönter Klickzahlen.",
      },
      {
        heading: "Testen, skalieren, wiederholen",
        body: "Wir starten strukturiert: Zielgruppen- und Creative-Tests mit kontrolliertem Budget, dann Skalierung der Gewinner. Jeden Monat bekommst du einen Report mit Zahlen, Learnings und dem konkreten Plan für den nächsten Monat.",
      },
    ],
    deliverables: [
      "Kampagnenstrategie & Funnel-Konzept",
      "Ad Creatives (Video, Bild, Text) aus dem Studio",
      "Kampagnen-Setup auf Meta, TikTok & Google",
      "Pixel-, Conversions-API- & Event-Tracking",
      "Landingpage-Empfehlungen oder -Umsetzung",
      "A/B-Tests & laufende Optimierung",
      "Transparentes monatliches Reporting",
      "Skalierungs-Roadmap",
    ],
    faq: [
      {
        q: "Welches Budget brauchen wir zum Start?",
        a: "Für aussagekräftige Tests empfehlen wir je nach Plattform und Ziel ein Mediabudget ab ca. 900–1.500 € pro Monat. Darunter sind Ergebnisse möglich, aber Tests dauern länger. Wir sagen dir ehrlich, was mit deinem Budget realistisch ist.",
      },
      {
        q: "Wie schnell sehen wir Ergebnisse?",
        a: "Erste Daten nach wenigen Tagen, belastbare Ergebnisse nach 4–6 Wochen Testphase. Performance Marketing ist ein System, das mit jeder Iteration besser wird – kein Schalter.",
      },
      {
        q: "Arbeitet ihr mit Werbekonto-Zugriff oder eigenem Konto?",
        a: "Immer in deinem Werbekonto. Daten, Pixel-Historie und Zielgruppen gehören dir – auch wenn die Zusammenarbeit endet.",
      },
    ],
    seo: {
      title: "Performance Marketing Agentur Berlin – Meta, TikTok & Google Ads | Netwitcher",
      description:
        "Performance Marketing aus Berlin: Meta Ads, TikTok Ads und Google Ads mit eigenen Creatives, sauberem Tracking und laufender Optimierung. Kampagnen, die Anfragen bringen.",
    },
  },
  {
    slug: "webdesign-ecommerce",
    href: "/leistungen/webdesign-ecommerce",
    title: "Webdesign & E-Commerce",
    navTitle: "Webdesign & E-Commerce",
    color: "mint",
    icon: "monitor",
    teaser:
      "Websites, Shops und Landingpages, die schnell laden, auf jedem Gerät überzeugen und Besucher in Anfragen verwandeln – mit WordPress, Shopify oder individuell entwickelt.",
    bullets: [
      "WordPress-Websites",
      "Individuell entwickelte Websites mit Dashboard",
      "Shopify- & WooCommerce-Shops",
      "Landingpages für Kampagnen",
      "Wartung & Speed-Optimierung",
      "Analytics & Meta-Pixel-Setup",
    ],
    cta: "Website erstellen lassen",
    hero: {
      eyebrow: "Webdesign Berlin",
      headline: "Deine Website ist dein bester Verkäufer. Oder dein teuerster Bremsklotz.",
      intro:
        "Besucher entscheiden in Sekunden, ob sie bleiben. Wir bauen Websites und Shops, die sofort Vertrauen aufbauen, blitzschnell laden und Besucher gezielt zur Anfrage führen – vom ersten Wireframe bis zum Livegang.",
    },
    sections: [
      {
        heading: "Conversion-Design statt Deko-Design",
        body: "Jede Seite bekommt eine klare Aufgabe: eine Botschaft, eine Handlung. Wir strukturieren Inhalte nach dem, was Besucher wirklich wissen wollen, setzen CTAs dort, wo Entscheidungen fallen, und testen die Seite auf echten Geräten – nicht nur im Design-Tool.",
      },
      {
        heading: "Die richtige Technik für dein Modell",
        body: "WordPress für redaktionelle Websites, Shopify oder WooCommerce für Shops, individuelle Entwicklung mit eigenem Dashboard, wenn Standard nicht reicht. Wir empfehlen die Lösung, die zu deinem Team und Budget passt – nicht die, die uns am meisten Aufwand bringt.",
      },
      {
        heading: "Schnell, messbar, wartbar",
        body: "Core Web Vitals, saubere SEO-Grundstruktur, Analytics und Meta Pixel gehören bei uns zum Standard, nicht zur Zusatzrechnung. Nach dem Livegang übernehmen wir auf Wunsch Wartung, Updates und Weiterentwicklung.",
      },
    ],
    deliverables: [
      "Struktur- & Wireframe-Konzept",
      "Individuelles Design im Branding",
      "Umsetzung (WordPress, Shopify, WooCommerce oder Custom)",
      "Responsive auf allen Geräten",
      "Speed- & Core-Web-Vitals-Optimierung",
      "SEO-Grundeinrichtung & Metadaten",
      "Analytics-, Tag- & Meta-Pixel-Setup",
      "Einweisung & optionale Wartung",
    ],
    faq: [
      {
        q: "Wie lange dauert eine Website?",
        a: "Eine Landingpage in 2–3 Wochen, eine komplette Unternehmenswebsite in 4–8 Wochen, ein Shop je nach Sortiment in 6–10 Wochen. Den genauen Zeitplan bekommst du im Angebot.",
      },
      {
        q: "Können wir Inhalte später selbst pflegen?",
        a: "Ja. Egal ob WordPress, Shopify oder Custom-Lösung mit Dashboard – du bekommst eine Einweisung und kannst Texte, Bilder und Produkte selbst ändern.",
      },
      {
        q: "Macht ihr auch Redesigns bestehender Seiten?",
        a: "Ja. Oft ist ein strukturiertes Redesign mit Conversion-Fokus wirksamer als ein kompletter Neubau. Wir analysieren erst und empfehlen dann.",
      },
    ],
    seo: {
      title: "Webdesign Berlin – Websites, Shops & Landingpages | Netwitcher",
      description:
        "Webdesign und E-Commerce aus Berlin: WordPress, Shopify, WooCommerce oder individuell entwickelt. Schnelle, conversion-optimierte Websites mit sauberem Tracking-Setup.",
    },
  },
  {
    slug: "seo",
    href: "/leistungen/seo",
    title: "SEO – Suchmaschinenoptimierung",
    navTitle: "SEO",
    color: "mint",
    icon: "search",
    teaser:
      "Technisches SEO, Content und lokale Sichtbarkeit – damit dich Kunden bei Google finden, bevor sie deine Konkurrenz finden. Mit monatlichen Reports statt Blackbox.",
    bullets: [
      "Technisches SEO",
      "OnPage-Optimierung",
      "SEO-Content",
      "Local SEO (Google Business)",
      "Backlink-Strategie",
      "Monatliche SEO-Reports",
    ],
    cta: "Bei Google sichtbarer werden",
    hero: {
      eyebrow: "SEO Agentur Berlin",
      headline: "Gefunden werden, wenn Kunden wirklich suchen.",
      intro:
        "SEO ist der Kanal, der nicht aufhört zu arbeiten, wenn das Werbebudget pausiert. Wir bringen deine Website technisch in Form, bauen Inhalte für echte Suchanfragen und machen dich lokal in Berlin und deutschlandweit sichtbar.",
    },
    sections: [
      {
        heading: "Erst das Fundament: technisches SEO",
        body: "Langsame Ladezeiten, kaputte Struktur oder fehlende Indexierung kosten Rankings, bevor Content überhaupt eine Chance hat. Wir starten mit einem Audit, beheben technische Blocker und richten eine saubere Seitenarchitektur ein.",
      },
      {
        heading: "Content für Suchintentionen, nicht für Keyword-Dichte",
        body: "Wir recherchieren, was deine Kunden wirklich googeln – und bauen Seiten, die diese Fragen besser beantworten als jede Konkurrenzseite. Das ist der Content, den Google belohnt und der Besucher in Anfragen verwandelt.",
      },
      {
        heading: "Local SEO: der schnellste Hebel für Berliner Unternehmen",
        body: "Google-Business-Profil, lokale Landingpages, Bewertungsstrategie und konsistente Einträge: Für lokale Dienstleister ist Local SEO oft der schnellste Weg zu neuen Anfragen. Wir richten das komplette Setup ein und halten es aktuell.",
      },
    ],
    deliverables: [
      "SEO-Audit & Wettbewerbsanalyse",
      "Keyword- & Suchintentions-Recherche",
      "Technische Optimierung (Speed, Struktur, Indexierung)",
      "OnPage-Optimierung bestehender Seiten",
      "SEO-Content-Erstellung",
      "Google-Business- & Local-SEO-Setup",
      "Backlink-Strategie",
      "Monatlicher Report mit Rankings & Maßnahmen",
    ],
    faq: [
      {
        q: "Wann sehen wir erste SEO-Ergebnisse?",
        a: "Technische Verbesserungen wirken oft in Wochen, Content-Rankings brauchen je nach Wettbewerb 3–6 Monate. Dafür bleibt der Effekt – anders als bei Ads – dauerhaft bestehen.",
      },
      {
        q: "Garantiert ihr Platz 1 bei Google?",
        a: "Nein – und niemand Seriöses tut das. Wir garantieren sauberes Handwerk, transparente Reports und Maßnahmen, die auf Daten basieren statt auf Versprechen.",
      },
      {
        q: "Lohnt sich SEO neben Ads?",
        a: "Gerade dann. Ads liefern sofort Daten, SEO baut den langfristigen Kanal auf. Die Keyword-Daten aus Kampagnen fließen bei uns direkt in die SEO-Strategie ein.",
      },
    ],
    seo: {
      title: "SEO Agentur Berlin – Technik, Content & Local SEO | Netwitcher",
      description:
        "SEO aus Berlin: technisches SEO, OnPage-Optimierung, SEO-Content, Local SEO und Backlink-Strategie mit monatlichen Reports. Sichtbar werden, wenn Kunden suchen.",
    },
  },
  {
    slug: "branding-design",
    href: "/leistungen/branding-design",
    title: "Branding & Design",
    navTitle: "Branding & Design",
    color: "violet",
    icon: "sparkles",
    teaser:
      "Logo, visuelle Identität, Templates und Brand Guidelines – ein Markenauftritt, der auf Instagram, Website und Visitenkarte dieselbe klare Sprache spricht.",
    bullets: [
      "Logo-Design",
      "Komplette visuelle Identität",
      "Social-Media-Templates",
      "Brand Guidelines",
      "Print- & Digital-Assets",
      "Naming & Claim-Entwicklung",
    ],
    cta: "Marke professionell aufbauen",
    hero: {
      eyebrow: "Branding Agentur Berlin",
      headline: "Eine Marke, die man wiedererkennt – nicht nur ein Logo, das existiert.",
      intro:
        "Menschen vertrauen Marken, die konsistent auftreten. Wir entwickeln deine visuelle Identität von Logo über Farben und Typografie bis zu Social-Media-Templates – damit jeder Berührungspunkt sofort nach dir aussieht.",
    },
    sections: [
      {
        heading: "Strategie vor Gestaltung",
        body: "Gutes Branding beginnt mit Fragen, nicht mit Farbpaletten: Wofür stehst du, wen willst du erreichen, wovon willst du dich abgrenzen? Erst wenn die Positionierung klar ist, gestalten wir – dann aber konsequent.",
      },
      {
        heading: "Ein System, kein Einzelstück",
        body: "Du bekommst kein Logo, das nur auf der Visitenkarte funktioniert, sondern ein System: Logo-Varianten, Farbwelt, Typografie, Bildsprache und Templates für Social Media. Alles dokumentiert in Guidelines, mit denen jedes Team konsistent arbeiten kann.",
      },
      {
        heading: "Vom Rebrand bis zum Start-up-Launch",
        body: "Ob du neu gründest oder ein gewachsenes Unternehmen visuell auffrischen willst: Wir begleiten den kompletten Prozess – inklusive Umstellung von Website, Profilen und Drucksachen, damit der neue Auftritt überall gleichzeitig ankommt.",
      },
    ],
    deliverables: [
      "Marken-Workshop & Positionierung",
      "Logo-Design mit Varianten & Dateipaket",
      "Farbwelt, Typografie & Bildsprache",
      "Brand Guidelines (digital)",
      "Social-Media-Template-Set",
      "Geschäftsausstattung (Visitenkarte, Signatur, Briefbogen)",
      "Asset-Bibliothek für Print & Digital",
      "Rollout-Begleitung",
    ],
    faq: [
      {
        q: "Wie läuft ein Logo-Projekt ab?",
        a: "Workshop, Moodboards, zwei bis drei ausgearbeitete Designrichtungen, gemeinsame Auswahl, Feinschliff, finales Dateipaket. Du bist an den entscheidenden Punkten eingebunden – ohne 30 Korrekturschleifen.",
      },
      {
        q: "Gehören uns die Rechte am Design?",
        a: "Ja. Mit Abschluss des Projekts erhältst du die uneingeschränkten Nutzungsrechte an allen finalen Designs samt offener Dateien.",
      },
      {
        q: "Könnt ihr unser bestehendes Logo behalten und den Rest aufbauen?",
        a: "Ja. Oft reicht ein „Brand Refresh“: Das Logo bleibt, aber Farben, Typografie und Templates werden zu einem konsistenten System ausgebaut.",
      },
    ],
    seo: {
      title: "Branding & Design Berlin – Logo, Identität & Guidelines | Netwitcher",
      description:
        "Branding aus Berlin: Logo-Design, komplette visuelle Identität, Social-Media-Templates und Brand Guidelines. Ein Markenauftritt, der überall wiedererkennbar ist.",
    },
  },
  {
    slug: "softwareentwicklung",
    href: "/leistungen/softwareentwicklung",
    title: "Softwareentwicklung",
    navTitle: "Softwareentwicklung",
    color: "sky",
    icon: "code",
    teaser:
      "Individuelle Web-Apps, Dashboards, CRM- und Buchungssysteme – maßgeschneiderte digitale Werkzeuge, die deine Abläufe schneller und dein Team produktiver machen.",
    bullets: [
      "Individuelle Web-Apps",
      "Dashboards & Auswertungen",
      "CRM-Systeme",
      "Buchungssysteme",
      "Interne Tools & Automatisierung",
      "Schnittstellen & Integrationen",
    ],
    cta: "Digitale Lösung entwickeln",
    hero: {
      eyebrow: "Individuelle Softwareentwicklung",
      headline: "Wenn Standard-Software bremst, bauen wir dein Werkzeug.",
      intro:
        "Excel-Chaos, fünf Tools, die nicht miteinander sprechen, Prozesse, die nur eine Person versteht: Wir entwickeln Web-Apps, Dashboards und interne Systeme, die exakt zu deinen Abläufen passen – und mit deinem Unternehmen mitwachsen.",
    },
    sections: [
      {
        heading: "Erst der Prozess, dann der Code",
        body: "Wir starten mit deinen Abläufen: Wer macht was, wo geht Zeit verloren, welche Daten fehlen? Daraus entsteht ein Konzept mit klaren Prioritäten – und ein erster nutzbarer Stand, oft schon nach wenigen Wochen.",
      },
      {
        heading: "Von FekraHub gelernt: Produkte, nicht Prototypen",
        body: "Mit FekraHub haben wir eine eigene Plattform für Bildungseinrichtungen entwickelt und betreiben sie im Alltag. Diese Produkt-Erfahrung fließt in jedes Kundenprojekt: durchdachte Rollen und Rechte, saubere Datenmodelle, Oberflächen, die Nicht-Techniker sofort verstehen.",
      },
      {
        heading: "Betrieb, Wartung, Weiterentwicklung",
        body: "Software ist nie „fertig“. Wir hosten, warten und entwickeln weiter – mit planbaren Wartungspaketen, sauberer Dokumentation und ohne Abhängigkeit von einer einzelnen Person.",
      },
    ],
    deliverables: [
      "Prozess- & Anforderungsanalyse",
      "Technisches Konzept & Roadmap",
      "UI/UX-Design der Anwendung",
      "Entwicklung (Web-App, Dashboard, CRM, Buchung)",
      "Schnittstellen zu bestehenden Tools",
      "Rollen-, Rechte- & Nutzerverwaltung",
      "Testing, Deployment & Hosting",
      "Wartung & Weiterentwicklung",
    ],
    faq: [
      {
        q: "Was kostet individuelle Software?",
        a: "Weniger als viele denken – wenn man klein und richtig startet. Wir priorisieren die Funktionen mit dem größten Nutzen und liefern in Etappen. Nach der Analyse bekommst du eine transparente Aufwandsschätzung.",
      },
      {
        q: "Gehört uns der Quellcode?",
        a: "Ja. Du erhältst die Rechte am entwickelten Code und volle Transparenz über Architektur und Hosting.",
      },
      {
        q: "Könnt ihr ein bestehendes System übernehmen?",
        a: "Ja. Wir prüfen den Bestand in einem Tech-Audit und sagen dir ehrlich, ob Weiterentwicklung oder Neubau wirtschaftlicher ist.",
      },
    ],
    seo: {
      title: "Softwareentwicklung Berlin – Web-Apps, Dashboards & CRM | Netwitcher",
      description:
        "Individuelle Softwareentwicklung aus Berlin: Web-Apps, Dashboards, CRM- und Buchungssysteme, die exakt zu deinen Prozessen passen. Inklusive Wartung und Weiterentwicklung.",
    },
  },
  {
    slug: "technischer-support",
    href: "/leistungen/technischer-support",
    title: "Technischer Support",
    navTitle: "Technischer Support",
    color: "sun",
    icon: "wrench",
    teaser:
      "Wartung, Updates, Performance-Analysen und schnelle Hilfe für Website und Shop – damit Technik nie der Grund ist, warum du Kunden verlierst.",
    bullets: [
      "Website- & Shop-Support",
      "Technische Wartung & Updates",
      "Performance-Analysen",
      "Sicherheits-Monitoring & Backups",
      "Team-Schulungen",
      "Erweiterte Dashboards & Auswertungen",
    ],
    cta: "Support anfragen",
    hero: {
      eyebrow: "Technischer Support & Wartung",
      headline: "Deine Website läuft. Wir sorgen dafür, dass das so bleibt.",
      intro:
        "Eine gehackte Seite, ein kaputtes Update oder ein Shop, der im Weihnachtsgeschäft ausfällt, kostet mehr als jede Wartung. Wir übernehmen Updates, Backups, Monitoring und schnelle Hilfe – mit festen Reaktionszeiten statt Warteschleife.",
    },
    sections: [
      {
        heading: "Wartung, die Probleme verhindert statt repariert",
        body: "Regelmäßige Updates von CMS, Plugins und Servern, automatische Backups und Sicherheits-Monitoring: Wir halten deine Technik aktuell, bevor Lücken zum Problem werden – dokumentiert in einem monatlichen Wartungsbericht.",
      },
      {
        heading: "Performance im Blick",
        body: "Wir messen Ladezeiten, Core Web Vitals und Fehlerraten kontinuierlich. Wird deine Seite langsamer, sehen wir es vor deinen Kunden – und beheben die Ursache, nicht nur das Symptom.",
      },
      {
        heading: "Schulung & Dashboards für dein Team",
        body: "Auf Wunsch schulen wir dein Team im Umgang mit CMS, Shop und Analytics und bauen Dashboards, die deine wichtigsten Kennzahlen auf einen Blick zeigen – von Besuchern bis Bestellungen.",
      },
    ],
    deliverables: [
      "Wartungsvertrag mit festen Reaktionszeiten",
      "CMS-, Plugin- & Server-Updates",
      "Automatische Backups & Wiederherstellung",
      "Sicherheits-Monitoring",
      "Performance- & Fehleranalysen",
      "Monatlicher Wartungsbericht",
      "Team-Schulungen",
      "Individuelle KPI-Dashboards",
    ],
    faq: [
      {
        q: "Betreut ihr auch Websites, die ihr nicht gebaut habt?",
        a: "Ja. Nach einem kurzen technischen Check übernehmen wir bestehende WordPress-Seiten, Shops und individuelle Systeme in die Wartung.",
      },
      {
        q: "Wie schnell reagiert ihr im Notfall?",
        a: "Je nach Wartungspaket innerhalb weniger Stunden am selben Werktag. Kritische Ausfälle behandeln wir immer mit höchster Priorität.",
      },
      {
        q: "Gibt es Support auch ohne Vertrag?",
        a: "Ja, auf Stundenbasis. Für planbare Kosten und garantierte Reaktionszeiten empfehlen wir aber ein monatliches Paket.",
      },
    ],
    seo: {
      title: "Technischer Support & Website-Wartung Berlin | Netwitcher",
      description:
        "Technischer Support aus Berlin: Wartung, Updates, Backups, Performance-Analysen und schnelle Hilfe für Website und Shop – mit festen Reaktionszeiten.",
    },
  },
  {
    slug: "druck-printdesign",
    href: "/leistungen/druck-printdesign",
    title: "Druck & Printdesign",
    navTitle: "Druck & Printdesign",
    color: "pink",
    icon: "printer",
    teaser:
      "Visitenkarten, Flyer, Broschüren und Speisekarten im Look deiner Marke – gestaltet mit Konzept, produziert in Druckqualität, abgestimmt auf deinen digitalen Auftritt.",
    bullets: [
      "Visitenkarten",
      "Flyer & Plakate",
      "Broschüren & Kataloge",
      "Speisekarten",
      "Kreative Printmaterialien",
      "Markenkonsistentes Printdesign",
    ],
    cta: "Printmaterial gestalten",
    hero: {
      eyebrow: "Printdesign Berlin",
      headline: "Print, das man behalten will – und das zur Marke passt.",
      intro:
        "Eine Visitenkarte, die sich hochwertig anfühlt, eine Speisekarte, die Appetit macht, ein Flyer, der nicht im Papierkorb landet: Wir gestalten Printmaterial mit demselben Anspruch wie deine digitale Marke – aus einem Guss.",
    },
    sections: [
      {
        heading: "Digital und Print aus einer Hand",
        body: "Der häufigste Markenfehler: Website und Drucksachen sehen aus wie von zwei verschiedenen Firmen. Weil wir beides gestalten, stimmen Farben, Typografie und Tonalität überall überein – vom Instagram-Post bis zur Broschüre.",
      },
      {
        heading: "Gestaltung mit Ziel",
        body: "Auch Print hat eine Conversion-Aufgabe: der Flyer mit QR-Code zur Landingpage, die Speisekarte mit klarer Bestselleron-Führung, die Broschüre, die ein Verkaufsgespräch vorbereitet. Wir gestalten für die Handlung, nicht nur fürs Auge.",
      },
      {
        heading: "Druckfertig bis in die Produktion",
        body: "Wir liefern druckfertige Daten mit korrekten Farbprofilen, Beschnitt und Veredelungsoptionen – und begleiten auf Wunsch die Produktion bei geprüften Druckereien, damit das Ergebnis hält, was der Entwurf verspricht.",
      },
    ],
    deliverables: [
      "Konzept & Gestaltung im Branding",
      "Visitenkarten, Flyer, Plakate",
      "Broschüren, Kataloge & Mappen",
      "Speise- & Getränkekarten",
      "Verpackungs- & Etikettendesign",
      "Druckfertige Daten (CMYK, Beschnitt, Profile)",
      "Druckabwicklung mit Partner-Druckereien",
      "Vorlagen zur Selbstpflege",
    ],
    faq: [
      {
        q: "Übernehmt ihr auch den Druck?",
        a: "Ja. Wir arbeiten mit geprüften Druckereien zusammen und wickeln Angebot, Produktion und Qualitätskontrolle für dich ab – oder liefern nur die druckfertigen Daten, wenn du eine eigene Druckerei hast.",
      },
      {
        q: "Was, wenn wir noch kein Logo oder Branding haben?",
        a: "Dann starten wir eine Stufe früher: Mit unserem Branding-Paket entsteht erst die visuelle Basis, danach das Printmaterial – so vermeidest du doppelte Kosten.",
      },
      {
        q: "Wie schnell geht ein Flyer oder eine Visitenkarte?",
        a: "Gestaltung in 3–7 Werktagen, Druck je nach Auflage und Veredelung weitere 2–5 Werktage. Express ist nach Absprache möglich.",
      },
    ],
    seo: {
      title: "Druck & Printdesign Berlin – Visitenkarten, Flyer & Broschüren | Netwitcher",
      description:
        "Printdesign aus Berlin: Visitenkarten, Flyer, Broschüren und Speisekarten im Look deiner Marke – konzipiert, gestaltet und druckfertig produziert.",
    },
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

/** Services, die unter /leistungen/[slug] gerendert werden (Studio hat eine eigene Seite). */
export const leistungenServices = services.filter((s) => s.slug !== "studio");
