import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung der Netwitcher Digital Agency, Berlin.",
  robots: { index: false },
};

// TODO: Platzhalter prüfen/ergänzen und die Erklärung an die tatsächlich
// eingesetzten Dienste (Hosting, Analytics, Pixel, Calendly) anpassen.
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>1. Datenschutz auf einen Blick</h2>
      <p>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
        deinen personenbezogenen Daten passiert, wenn du diese Website besuchst.
        Personenbezogene Daten sind alle Daten, mit denen du persönlich
        identifiziert werden kannst.
      </p>

      <h2>2. Verantwortliche Stelle</h2>
      <p>
        {site.legalName}
        <br />
        {site.street}, {site.zip} {site.city}
        <br />
        Telefon: {site.phone}
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>3. Datenerfassung auf dieser Website</h2>
      <h3>Server-Log-Dateien</h3>
      <p>
        Der Provider der Seiten erhebt und speichert automatisch Informationen in
        sogenannten Server-Log-Dateien, die dein Browser automatisch übermittelt:
        Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname
        des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine
        Zusammenführung dieser Daten mit anderen Datenquellen wird nicht
        vorgenommen. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f
        DSGVO (berechtigtes Interesse an der technisch fehlerfreien Darstellung
        und Optimierung der Website).
      </p>
      <h3>Kontaktformular und Kontakt per E-Mail, Telefon oder WhatsApp</h3>
      <p>
        Wenn du uns per Kontaktformular, E-Mail, Telefon oder WhatsApp kontaktierst,
        werden deine Angaben inklusive der von dir angegebenen Kontaktdaten zwecks
        Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns
        gespeichert. Diese Daten geben wir nicht ohne deine Einwilligung weiter.
        Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
        (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an der effektiven Bearbeitung von Anfragen). Bei der Nutzung von
        WhatsApp gelten ergänzend die Datenschutzhinweise der WhatsApp Ireland Ltd.
      </p>
      <h3>Terminbuchung (Calendly)</h3>
      <p>
        Für die Buchung von Erstgesprächen verlinken wir auf den Dienst Calendly
        (Calendly LLC, USA). Wenn du dort einen Termin buchst, verarbeitet Calendly
        die von dir eingegebenen Daten (z. B. Name, E-Mail-Adresse, Wunschtermin).
        Details findest du in der Datenschutzerklärung von Calendly. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. b DSGVO.
      </p>

      <h2>4. Hosting</h2>
      <p>
        Diese Website wird bei einem externen Dienstleister gehostet
        ([Hosting-Anbieter eintragen]). Die personenbezogenen Daten, die auf dieser
        Website erfasst werden, werden auf den Servern des Hosters gespeichert.
        Der Einsatz des Hosters erfolgt im Interesse einer sicheren, schnellen und
        effizienten Bereitstellung unseres Online-Angebots (Art. 6 Abs. 1 lit. f
        DSGVO). Mit dem Hoster wurde ein Vertrag über Auftragsverarbeitung
        geschlossen.
      </p>

      <h2>5. Analyse-Tools und Marketing</h2>
      <p>
        [Sofern eingesetzt: Hier Angaben zu Google Analytics, Meta Pixel, TikTok
        Pixel o. Ä. ergänzen – inklusive Rechtsgrundlage (Einwilligung über ein
        Consent-Banner, Art. 6 Abs. 1 lit. a DSGVO), Speicherdauer und
        Widerrufsmöglichkeit. Werden keine solchen Tools eingesetzt, kann dieser
        Abschnitt entfallen.]
      </p>

      <h2>6. Deine Rechte</h2>
      <p>Du hast im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über deine gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
        <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO) – zuständig ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit</li>
      </ul>

      <h2>7. Speicherdauer</h2>
      <p>
        Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer
        genannt wurde, verbleiben deine personenbezogenen Daten bei uns, bis der
        Zweck für die Datenverarbeitung entfällt. Wenn du ein berechtigtes
        Löschersuchen geltend machst oder eine Einwilligung zur Datenverarbeitung
        widerrufst, werden deine Daten gelöscht, sofern keine anderen rechtlich
        zulässigen Gründe für die Speicherung bestehen (z. B. steuer- oder
        handelsrechtliche Aufbewahrungsfristen).
      </p>

      <h2>8. SSL- bzw. TLS-Verschlüsselung</h2>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
        vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine
        verschlüsselte Verbindung erkennst du an dem Schloss-Symbol in deiner
        Browserzeile.
      </p>
    </LegalPage>
  );
}
