=== Netwitcher ===
Contributors: netwitcher
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Premium-Dark-Theme der Netwitcher Digital Agency & des Content-Studios Berlin.
Magic in Every Click ✦

== Installation ==

1. Im WordPress-Admin: Design → Themes → „Theme hinzufügen“ → „Theme hochladen“
   → netwitcher-theme.zip auswählen → Installieren → Aktivieren.
2. Bei der Aktivierung legt das Theme automatisch an:
   * alle Seiten (Startseite, Leistungen inkl. 9 Unterseiten, Studio, Projekte,
     Über uns, FekraHub, Blog, Kontakt, Impressum, Datenschutz, AGB)
   * das Hauptmenü mit Leistungen-Dropdown
   * drei fertige Blogartikel
   * Startseite/Blogseite und Permalinks (/%postname%/)
3. Fertig – die Website ist sofort vollständig befüllt.

== Nach der Installation anpassen ==

Design → Customizer → „Netwitcher Einstellungen“:
* E-Mail, Telefonnummer, WhatsApp-Nummer (nur Ziffern mit Ländercode)
* Adresse, Calendly-URL, Social-Media-Links
* URLs für Hero-Video und Studio-Bilder (Standard: Higgsfield-CDN;
  empfohlen: Dateien in die Mediathek laden und URLs hier ersetzen)

Außerdem:
* Impressum, Datenschutz, AGB: Platzhalter in eckigen Klammern ersetzen
  (Seiten → jeweilige Seite bearbeiten). AGB rechtlich prüfen lassen.
* Kontaktformular: öffnet standardmäßig eine vorbereitete E-Mail (mailto:).
  Für echten Formularversand z. B. Contact Form 7 oder WPForms einsetzen und
  das Formular in page-templates/template-kontakt.php ersetzen.

== Inhalte ändern ==

Die deutsche Copy der Leistungs-Seiten, Cases und Pakete liegt zentral in:
* inc/services-data.php  (10 Leistungen inkl. FAQ & SEO-Beschreibungen)
* inc/cases-data.php     (6 Case-Study-Platzhalter)
* inc/packages-data.php  (4 Content-Pakete)

Neue Leistungs-Seite: Eintrag in inc/services-data.php ergänzen, dann Seite
mit gleichem Slug als Unterseite von „Leistungen“ mit Template
„Leistung (Detailseite)“ anlegen.

== Design-System ==

Farben: Night #06060F · Mint #2EE6C8 · Violet #8B5CF6 · Pink #F468A8 ·
Sun #F5D33D · Sky #0FB9F2. Headings: Orbitron, Fließtext: Space Grotesk
(beide lokal gebündelt, DSGVO-freundlich – kein Google-Fonts-CDN).

Animationen (Scroll-Reveal, Hero-Parallax der Logo-Pfeile, Stern-Assembly)
laufen in Vanilla JS ohne Abhängigkeiten und respektieren
prefers-reduced-motion.

== Credits ==

* Schriften: Orbitron & Space Grotesk (SIL Open Font License), via Google Fonts
  bezogen und lokal gebündelt.
* Generierte Medien (Hero-Loop, Studio-Visuals): erstellt mit Higgsfield.
