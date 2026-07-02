export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  seoDescription: string;
  content: { heading?: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "content-der-verkauft-statt-nur-gefaellt",
    title: "Content, der verkauft statt nur gefällt: 5 Prinzipien aus der Praxis",
    excerpt:
      "Likes zahlen keine Rechnungen. Diese fünf Prinzipien entscheiden, ob dein Content Reichweite in echte Anfragen verwandelt – mit Beispielen aus unserem Studio-Alltag.",
    date: "2026-06-10",
    readingTime: "6 Min.",
    category: "Content Creation",
    seoDescription:
      "5 Prinzipien für Content, der verkauft: Hook, Zielgruppenfokus, Plattform-Logik, CTA und Serien-Denken – erklärt von Netwitcher, deinem Content-Studio in Berlin.",
    content: [
      {
        paragraphs: [
          "Viele Unternehmen produzieren Content, der gut aussieht – und trotzdem nichts bewegt. Der Grund ist fast nie die Bildqualität. Es ist der fehlende Auftrag: Content ohne Ziel bleibt Dekoration. Diese fünf Prinzipien wenden wir in jeder Produktion in unserem Berliner Studio an.",
        ],
      },
      {
        heading: "1. Die ersten zwei Sekunden entscheiden",
        paragraphs: [
          "Auf Instagram und TikTok wird nicht geblättert, sondern gewischt. Wenn dein Reel nicht in den ersten zwei Sekunden einen Grund zum Bleiben liefert – eine Bewegung, eine Frage, ein überraschendes Bild – ist der Rest egal. Wir planen deshalb jeden Clip vom Hook aus rückwärts, nicht vom Produkt aus vorwärts.",
        ],
      },
      {
        heading: "2. Zielgruppe schlägt Ästhetik",
        paragraphs: [
          "Ein Feed kann preisverdächtig aussehen und trotzdem an der Zielgruppe vorbeiproduzieren. Ein Handwerksbetrieb braucht Vertrauen und Vorher-Nachher, eine Kosmetikmarke Textur und Ergebnis, ein B2B-Dienstleister Kompetenzbeweise. Erst wenn klar ist, was deine Kunden überzeugt, entscheiden wir, wie es aussieht.",
        ],
      },
      {
        heading: "3. Nativ für die Plattform produzieren",
        paragraphs: [
          "Ein Fernsehspot, der auf 9:16 zugeschnitten wird, bleibt ein Fernsehspot im falschen Format. Reels, TikToks und Ads folgen eigenen Regeln: vertikales Framing, Untertitel, schnelle Schnitte, Ton optional. Wer nativ produziert, bekommt vom Algorithmus Reichweite geschenkt – wer recycelt, zahlt sie mit Budget.",
        ],
      },
      {
        heading: "4. Jeder Inhalt braucht einen nächsten Schritt",
        paragraphs: [
          "„Mehr dazu im Profil“, „Schreib uns UNTERTITEL per DM“, „Link zur Terminbuchung“: Ein Call-to-Action kostet nichts und verändert alles. Content ohne nächsten Schritt erzeugt Applaus. Content mit nächstem Schritt erzeugt Anfragen.",
        ],
      },
      {
        heading: "5. In Serien denken, nicht in Einzelposts",
        paragraphs: [
          "Ein virales Reel ist Glück. Eine Serie, die planbar produziert wird, ist ein System. Wir bauen Content-Formate, die sich wiederholen lassen – so entsteht Wiedererkennung, Produktionsroutine und ein Feed, der mit jedem Monat stärker wird.",
          "Du willst wissen, wie diese Prinzipien für deine Marke aussehen? In einem kostenlosen Erstgespräch zeigen wir dir, welche Formate für deine Zielgruppe funktionieren.",
        ],
      },
    ],
  },
  {
    slug: "produktfotografie-conversion-hebel",
    title: "Warum Produktfotografie dein günstigster Conversion-Hebel ist",
    excerpt:
      "Bevor jemand deinen Text liest, hat er dein Bild bewertet. Warum bessere Produktbilder oft mehr bringen als mehr Werbebudget – und woran du schwache Bilder erkennst.",
    date: "2026-05-22",
    readingTime: "5 Min.",
    category: "Produktfotografie",
    seoDescription:
      "Produktfotografie als Conversion-Hebel: Warum professionelle Produktbilder Conversion-Rate und Werbeleistung steigern – Praxiswissen aus dem Netwitcher Studio Berlin.",
    content: [
      {
        paragraphs: [
          "Im Online-Shop kann niemand dein Produkt anfassen. Das Bild übernimmt alles: Qualität zeigen, Vertrauen aufbauen, den Preis rechtfertigen. Trotzdem investieren viele Unternehmen zuerst in mehr Werbebudget – und schicken teuren Traffic auf Produktseiten, deren Bilder nicht überzeugen.",
        ],
      },
      {
        heading: "Das Bild wird vor dem Preis bewertet",
        paragraphs: [
          "Nutzer entscheiden in Millisekunden, ob ein Produkt hochwertig wirkt. Unscharfe Freisteller, gemischte Hintergründe und uneinheitliches Licht senken den wahrgenommenen Wert – und damit die Zahlungsbereitschaft. Umgekehrt kann ein durchdachtes Bildkonzept denselben Artikel in einer anderen Preisklasse verkaufen.",
        ],
      },
      {
        heading: "Bessere Bilder machen auch deine Ads billiger",
        paragraphs: [
          "Meta und TikTok belohnen Anzeigen, die Aufmerksamkeit halten, mit günstigeren Klickpreisen. Das Creative ist der größte Hebel im Performance Marketing – und das Creative ist in den meisten Fällen: dein Produktbild oder Produktvideo. Wer hier investiert, senkt die Kosten in jeder nachgelagerten Kampagne.",
        ],
      },
      {
        heading: "Woran du erkennst, dass es Zeit für ein Shooting ist",
        paragraphs: [
          "Deine Produktseiten haben Besucher, aber wenige Käufe. Dein Feed wirkt uneinheitlich, weil Bilder aus drei Quellen stammen. Deine Konkurrenz sieht hochwertiger aus, obwohl dein Produkt besser ist. Jeder dieser Punkte ist ein Zeichen, dass nicht dein Produkt das Problem ist – sondern seine Darstellung.",
          "In unserem Studio in Berlin produzieren wir Produktserien mit einheitlichem Konzept: E-Commerce-Freisteller, Lifestyle-Szenen und Detailaufnahmen aus einem Guss. Sende uns dein Produkt – wir zeigen dir, was möglich ist.",
        ],
      },
    ],
  },
  {
    slug: "meta-ads-budget-verbrennen-stoppen",
    title: "Meta Ads: 4 Gründe, warum deine Kampagnen Budget verbrennen",
    excerpt:
      "Wenn Anzeigen laufen, aber keine Anfragen kommen, liegt es fast immer an einem dieser vier Punkte. So findest du heraus, welcher es bei dir ist.",
    date: "2026-04-30",
    readingTime: "7 Min.",
    category: "Performance Marketing",
    seoDescription:
      "Meta Ads optimieren: fehlendes Tracking, schwache Creatives, falsche Kampagnenziele und Landingpage-Probleme – die 4 häufigsten Budget-Fresser und ihre Lösungen.",
    content: [
      {
        paragraphs: [
          "„Wir haben Ads probiert, hat nicht funktioniert“ – diesen Satz hören wir in fast jedem Erstgespräch. Beim Blick ins Werbekonto zeigt sich dann fast immer eines von vier Problemen. Die gute Nachricht: Alle vier sind lösbar.",
        ],
      },
      {
        heading: "1. Die Kampagne optimiert auf das falsche Ziel",
        paragraphs: [
          "Wer auf Klicks oder Reichweite optimiert, bekommt Klicks und Reichweite – von Menschen, die gern klicken, aber selten kaufen. Kampagnen müssen auf das Ereignis optimieren, das dir Geld bringt: die Anfrage, den Kauf, den Termin. Das setzt voraus, dass dieses Ereignis sauber gemessen wird.",
        ],
      },
      {
        heading: "2. Das Tracking misst nicht, was zählt",
        paragraphs: [
          "Ohne Pixel, Conversions API und korrekt eingerichtete Events fliegt der Algorithmus blind – und du auch. Wir sehen regelmäßig Konten, in denen seit Monaten „Conversions“ gezählt werden, die in Wahrheit Seitenaufrufe sind. Erst messen, dann skalieren.",
        ],
      },
      {
        heading: "3. Ein Creative, seit Monaten im Einsatz",
        paragraphs: [
          "Anzeigen nutzen sich ab. Wenn dieselbe Zielgruppe dasselbe Video zum zwanzigsten Mal sieht, steigen die Kosten pro Ergebnis Woche für Woche. Erfolgreiche Konten testen laufend neue Hooks und Varianten – deshalb gehört bei uns die Creative-Produktion fest zum Kampagnen-Management.",
        ],
      },
      {
        heading: "4. Die Landingpage verliert, was die Anzeige gewinnt",
        paragraphs: [
          "Die beste Anzeige scheitert an einer Seite, die langsam lädt, auf dem Smartphone bricht oder kein klares Formular hat. Anzeige und Landingpage sind ein System: gleiche Botschaft, gleiches Versprechen, ein offensichtlicher nächster Schritt.",
          "Du willst wissen, welcher der vier Punkte dein Konto bremst? Wir schauen uns dein Setup im kostenlosen Erstgespräch an – ehrlich und ohne Fachchinesisch.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
