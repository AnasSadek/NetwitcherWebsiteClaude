import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "AGB – Allgemeine Geschäftsbedingungen",
  description: "Allgemeine Geschäftsbedingungen der Netwitcher Digital Agency, Berlin.",
  robots: { index: false },
};

// TODO: AGB rechtlich prüfen lassen und Platzhalter ersetzen – dieser Text ist
// eine strukturierte Vorlage, keine Rechtsberatung.
export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen (AGB)">
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der{" "}
        {site.legalName}, {site.street}, {site.zip} {site.city} (nachfolgend
        „Agentur“) und ihren Auftraggebern (nachfolgend „Kunde“) über Leistungen in
        den Bereichen Content-Produktion, Fotografie, Videoproduktion, Social Media
        Management, Performance Marketing, Webdesign, Suchmaschinenoptimierung,
        Branding, Softwareentwicklung, technischer Support sowie Druck- und
        Printdesign. Abweichende Bedingungen des Kunden gelten nur, wenn die
        Agentur ihrer Geltung ausdrücklich schriftlich zugestimmt hat.
      </p>

      <h2>§ 2 Vertragsschluss</h2>
      <p>
        Angebote der Agentur sind freibleibend. Ein Vertrag kommt durch schriftliche
        Auftragsbestätigung (auch per E-Mail), durch Unterzeichnung eines Angebots
        oder durch Beginn der Leistungserbringung zustande. Maßgeblich für den
        Leistungsumfang ist das jeweilige Angebot bzw. die Leistungsbeschreibung.
      </p>

      <h2>§ 3 Leistungsumfang und Mitwirkungspflichten</h2>
      <p>
        Der konkrete Leistungsumfang ergibt sich aus dem jeweiligen Angebot. Der
        Kunde stellt der Agentur alle für die Leistungserbringung erforderlichen
        Inhalte, Zugänge, Freigaben und Informationen rechtzeitig zur Verfügung.
        Verzögerungen, die auf verspätete Mitwirkung des Kunden zurückgehen,
        verlängern vereinbarte Fristen angemessen.
      </p>

      <h2>§ 4 Korrekturschleifen und Abnahme</h2>
      <p>
        Sofern nicht anders vereinbart, sind je Leistungsposition zwei
        Korrekturschleifen enthalten. Weitergehende Änderungswünsche werden nach
        Aufwand zu den jeweils gültigen Stundensätzen berechnet. Gelieferte
        Leistungen gelten als abgenommen, wenn der Kunde nicht innerhalb von 14
        Tagen nach Lieferung begründete Einwände erhebt.
      </p>

      <h2>§ 5 Vergütung und Zahlungsbedingungen</h2>
      <p>
        Es gilt die im Angebot vereinbarte Vergütung zuzüglich der gesetzlichen
        Umsatzsteuer. Bei Projekten kann die Agentur angemessene Abschlagszahlungen
        verlangen (üblich: 50 % bei Beauftragung, 50 % bei Abschluss). Laufende
        Leistungen (z. B. Social Media Management, Wartung, SEO) werden monatlich
        im Voraus abgerechnet. Rechnungen sind innerhalb von 14 Tagen ohne Abzug
        fällig. Mediabudgets für Werbeanzeigen trägt der Kunde und zahlt sie direkt
        an die jeweilige Plattform, sofern nicht anders vereinbart.
      </p>

      <h2>§ 6 Laufzeit und Kündigung</h2>
      <p>
        Verträge über laufende Leistungen haben, sofern nicht anders vereinbart,
        eine Mindestlaufzeit von drei Monaten und verlängern sich jeweils um einen
        Monat, wenn sie nicht mit einer Frist von 30 Tagen zum Laufzeitende
        gekündigt werden. Das Recht zur außerordentlichen Kündigung aus wichtigem
        Grund bleibt unberührt. Kündigungen bedürfen der Textform.
      </p>

      <h2>§ 7 Nutzungsrechte</h2>
      <p>
        Mit vollständiger Zahlung der vereinbarten Vergütung erhält der Kunde die
        vertraglich vereinbarten Nutzungsrechte an den finalen Arbeitsergebnissen.
        Rohdaten, offene Projektdateien und nicht ausgewählte Entwürfe verbleiben,
        sofern nicht anders vereinbart, bei der Agentur. Die Agentur ist
        berechtigt, erbrachte Leistungen zu Referenzzwecken (Portfolio, Website,
        Social Media) zu präsentieren, sofern der Kunde dem nicht schriftlich
        widerspricht.
      </p>

      <h2>§ 8 Gewährleistung und Haftung</h2>
      <p>
        Die Agentur erbringt ihre Leistungen mit größter Sorgfalt nach dem aktuellen
        Stand der Technik. Ein bestimmter wirtschaftlicher Erfolg (z. B. Rankings,
        Reichweiten, Conversion-Raten) wird nicht geschuldet. Die Agentur haftet
        unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von
        Leben, Körper und Gesundheit. Bei einfacher Fahrlässigkeit haftet die
        Agentur nur bei Verletzung wesentlicher Vertragspflichten, begrenzt auf den
        vertragstypischen, vorhersehbaren Schaden.
      </p>

      <h2>§ 9 Vertraulichkeit und Datenschutz</h2>
      <p>
        Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils
        anderen Partei geheim zu halten. Die Verarbeitung personenbezogener Daten
        erfolgt gemäß unserer{" "}
        <a href="/datenschutz">Datenschutzerklärung</a> und den geltenden
        datenschutzrechtlichen Bestimmungen.
      </p>

      <h2>§ 10 Schlussbestimmungen</h2>
      <p>
        Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort und – soweit
        der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder
        öffentlich-rechtliches Sondervermögen ist – Gerichtsstand ist Berlin.
        Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die
        Wirksamkeit der übrigen Bestimmungen unberührt.
      </p>

      <p>Stand: Juli 2026</p>
    </LegalPage>
  );
}
