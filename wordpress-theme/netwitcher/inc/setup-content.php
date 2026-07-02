<?php
/**
 * Einmaliges Setup bei Theme-Aktivierung:
 * legt alle Seiten, das Hauptmenü und drei Blogartikel an,
 * setzt Startseite/Blogseite und Permalinks.
 *
 * @package Netwitcher
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Seite anlegen (falls Slug noch nicht existiert) und Template zuweisen.
 */
function nw_create_page( $title, $slug, $template = '', $parent_id = 0, $content = '' ) {
	$existing = get_page_by_path( $parent_id ? get_post_field( 'post_name', $parent_id ) . '/' . $slug : $slug );
	if ( $existing ) {
		return $existing->ID;
	}
	$id = wp_insert_post(
		array(
			'post_title'   => $title,
			'post_name'    => $slug,
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_parent'  => $parent_id,
			'post_content' => $content,
		)
	);
	if ( $id && ! is_wp_error( $id ) && $template ) {
		update_post_meta( $id, '_wp_page_template', $template );
	}
	return is_wp_error( $id ) ? 0 : $id;
}

/**
 * Gesamtes Setup.
 */
function nw_activate_setup() {
	if ( get_option( 'nw_setup_done' ) ) {
		return;
	}

	// Permalinks auf Beitragsname.
	update_option( 'permalink_structure', '/%postname%/' );

	// Kernseiten.
	$front_id   = nw_create_page( 'Startseite', 'startseite' );
	$blog_id    = nw_create_page( 'Blog', 'blog' );
	$leist_id   = nw_create_page( 'Leistungen', 'leistungen', 'page-templates/template-leistungen.php' );
	$studio_id  = nw_create_page( 'Content Creation & Studio Berlin', 'studio', 'page-templates/template-studio.php' );
	$projekt_id = nw_create_page( 'Projekte & Case Studies', 'projekte', 'page-templates/template-projekte.php' );
	$about_id   = nw_create_page( 'Über uns', 'ueber-uns', 'page-templates/template-ueber-uns.php' );
	$fekra_id   = nw_create_page( 'FekraHub', 'fekrahub', 'page-templates/template-fekrahub.php' );
	$kontakt_id = nw_create_page( 'Kontakt', 'kontakt', 'page-templates/template-kontakt.php' );

	// Service-Unterseiten.
	foreach ( nw_leistungen_services() as $service ) {
		nw_create_page( $service['title'], $service['slug'], 'page-templates/template-service.php', $leist_id );
	}

	// Rechtliches.
	nw_create_page( 'Impressum', 'impressum', '', 0, nw_legal_impressum() );
	nw_create_page( 'Datenschutzerklärung', 'datenschutz', '', 0, nw_legal_datenschutz() );
	nw_create_page( 'AGB', 'agb', '', 0, nw_legal_agb() );

	// Front-/Blogseite setzen.
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $front_id );
	update_option( 'page_for_posts', $blog_id );

	// Blogartikel.
	nw_create_posts();

	// Hauptmenü.
	nw_create_menu( compact( 'front_id', 'leist_id', 'studio_id', 'projekt_id', 'about_id', 'blog_id', 'kontakt_id' ) );

	update_option( 'nw_setup_done', 1 );
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'nw_activate_setup' );

/**
 * Hauptmenü mit Leistungen-Dropdown.
 */
function nw_create_menu( $ids ) {
	$menu_name = 'Hauptmenü';
	$menu      = wp_get_nav_menu_object( $menu_name );
	if ( ! $menu ) {
		$menu_id = wp_create_nav_menu( $menu_name );
	} else {
		return; // Menü existiert bereits – nichts überschreiben.
	}

	$add_page = function ( $page_id, $parent_item = 0 ) use ( $menu_id ) {
		return wp_update_nav_menu_item(
			$menu_id,
			0,
			array(
				'menu-item-object-id' => $page_id,
				'menu-item-object'    => 'page',
				'menu-item-type'      => 'post_type',
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent_item,
			)
		);
	};

	$add_page( $ids['front_id'] );
	$leist_item = $add_page( $ids['leist_id'] );
	$add_page( $ids['studio_id'], $leist_item );
	foreach ( nw_leistungen_services() as $service ) {
		$page = get_page_by_path( 'leistungen/' . $service['slug'] );
		if ( $page ) {
			$add_page( $page->ID, $leist_item );
		}
	}
	$add_page( $ids['studio_id'] );
	$add_page( $ids['projekt_id'] );
	$add_page( $ids['about_id'] );
	$add_page( $ids['blog_id'] );
	$add_page( $ids['kontakt_id'] );

	$locations            = get_theme_mod( 'nav_menu_locations', array() );
	$locations['primary'] = $menu_id;
	set_theme_mod( 'nav_menu_locations', $locations );
}

/**
 * Drei Blogartikel anlegen.
 */
function nw_create_posts() {
	$posts = array(
		array(
			'title'    => 'Content, der verkauft statt nur gefällt: 5 Prinzipien aus der Praxis',
			'slug'     => 'content-der-verkauft-statt-nur-gefaellt',
			'category' => 'Content Creation',
			'excerpt'  => 'Likes zahlen keine Rechnungen. Diese fünf Prinzipien entscheiden, ob dein Content Reichweite in echte Anfragen verwandelt – mit Beispielen aus unserem Studio-Alltag.',
			'content'  => '<p>Viele Unternehmen produzieren Content, der gut aussieht – und trotzdem nichts bewegt. Der Grund ist fast nie die Bildqualität. Es ist der fehlende Auftrag: Content ohne Ziel bleibt Dekoration. Diese fünf Prinzipien wenden wir in jeder Produktion in unserem Berliner Studio an.</p><h2>1. Die ersten zwei Sekunden entscheiden</h2><p>Auf Instagram und TikTok wird nicht geblättert, sondern gewischt. Wenn dein Reel nicht in den ersten zwei Sekunden einen Grund zum Bleiben liefert – eine Bewegung, eine Frage, ein überraschendes Bild – ist der Rest egal. Wir planen deshalb jeden Clip vom Hook aus rückwärts, nicht vom Produkt aus vorwärts.</p><h2>2. Zielgruppe schlägt Ästhetik</h2><p>Ein Feed kann preisverdächtig aussehen und trotzdem an der Zielgruppe vorbeiproduzieren. Ein Handwerksbetrieb braucht Vertrauen und Vorher-Nachher, eine Kosmetikmarke Textur und Ergebnis, ein B2B-Dienstleister Kompetenzbeweise. Erst wenn klar ist, was deine Kunden überzeugt, entscheiden wir, wie es aussieht.</p><h2>3. Nativ für die Plattform produzieren</h2><p>Ein Fernsehspot, der auf 9:16 zugeschnitten wird, bleibt ein Fernsehspot im falschen Format. Reels, TikToks und Ads folgen eigenen Regeln: vertikales Framing, Untertitel, schnelle Schnitte, Ton optional. Wer nativ produziert, bekommt vom Algorithmus Reichweite geschenkt – wer recycelt, zahlt sie mit Budget.</p><h2>4. Jeder Inhalt braucht einen nächsten Schritt</h2><p>„Mehr dazu im Profil“, „Schreib uns per DM“, „Link zur Terminbuchung“: Ein Call-to-Action kostet nichts und verändert alles. Content ohne nächsten Schritt erzeugt Applaus. Content mit nächstem Schritt erzeugt Anfragen.</p><h2>5. In Serien denken, nicht in Einzelposts</h2><p>Ein virales Reel ist Glück. Eine Serie, die planbar produziert wird, ist ein System. Wir bauen Content-Formate, die sich wiederholen lassen – so entsteht Wiedererkennung, Produktionsroutine und ein Feed, der mit jedem Monat stärker wird.</p><p>Du willst wissen, wie diese Prinzipien für deine Marke aussehen? In einem <a href="/kontakt/#termin">kostenlosen Erstgespräch</a> zeigen wir dir, welche Formate für deine Zielgruppe funktionieren.</p>',
		),
		array(
			'title'    => 'Warum Produktfotografie dein günstigster Conversion-Hebel ist',
			'slug'     => 'produktfotografie-conversion-hebel',
			'category' => 'Produktfotografie',
			'excerpt'  => 'Bevor jemand deinen Text liest, hat er dein Bild bewertet. Warum bessere Produktbilder oft mehr bringen als mehr Werbebudget – und woran du schwache Bilder erkennst.',
			'content'  => '<p>Im Online-Shop kann niemand dein Produkt anfassen. Das Bild übernimmt alles: Qualität zeigen, Vertrauen aufbauen, den Preis rechtfertigen. Trotzdem investieren viele Unternehmen zuerst in mehr Werbebudget – und schicken teuren Traffic auf Produktseiten, deren Bilder nicht überzeugen.</p><h2>Das Bild wird vor dem Preis bewertet</h2><p>Nutzer entscheiden in Millisekunden, ob ein Produkt hochwertig wirkt. Unscharfe Freisteller, gemischte Hintergründe und uneinheitliches Licht senken den wahrgenommenen Wert – und damit die Zahlungsbereitschaft. Umgekehrt kann ein durchdachtes Bildkonzept denselben Artikel in einer anderen Preisklasse verkaufen.</p><h2>Bessere Bilder machen auch deine Ads billiger</h2><p>Meta und TikTok belohnen Anzeigen, die Aufmerksamkeit halten, mit günstigeren Klickpreisen. Das Creative ist der größte Hebel im Performance Marketing – und das Creative ist in den meisten Fällen: dein Produktbild oder Produktvideo. Wer hier investiert, senkt die Kosten in jeder nachgelagerten Kampagne.</p><h2>Woran du erkennst, dass es Zeit für ein Shooting ist</h2><p>Deine Produktseiten haben Besucher, aber wenige Käufe. Dein Feed wirkt uneinheitlich, weil Bilder aus drei Quellen stammen. Deine Konkurrenz sieht hochwertiger aus, obwohl dein Produkt besser ist. Jeder dieser Punkte ist ein Zeichen, dass nicht dein Produkt das Problem ist – sondern seine Darstellung.</p><p>In unserem <a href="/studio/">Studio in Berlin</a> produzieren wir Produktserien mit einheitlichem Konzept: E-Commerce-Freisteller, Lifestyle-Szenen und Detailaufnahmen aus einem Guss. Sende uns dein Produkt – wir zeigen dir, was möglich ist.</p>',
		),
		array(
			'title'    => 'Meta Ads: 4 Gründe, warum deine Kampagnen Budget verbrennen',
			'slug'     => 'meta-ads-budget-verbrennen-stoppen',
			'category' => 'Performance Marketing',
			'excerpt'  => 'Wenn Anzeigen laufen, aber keine Anfragen kommen, liegt es fast immer an einem dieser vier Punkte. So findest du heraus, welcher es bei dir ist.',
			'content'  => '<p>„Wir haben Ads probiert, hat nicht funktioniert“ – diesen Satz hören wir in fast jedem Erstgespräch. Beim Blick ins Werbekonto zeigt sich dann fast immer eines von vier Problemen. Die gute Nachricht: Alle vier sind lösbar.</p><h2>1. Die Kampagne optimiert auf das falsche Ziel</h2><p>Wer auf Klicks oder Reichweite optimiert, bekommt Klicks und Reichweite – von Menschen, die gern klicken, aber selten kaufen. Kampagnen müssen auf das Ereignis optimieren, das dir Geld bringt: die Anfrage, den Kauf, den Termin. Das setzt voraus, dass dieses Ereignis sauber gemessen wird.</p><h2>2. Das Tracking misst nicht, was zählt</h2><p>Ohne Pixel, Conversions API und korrekt eingerichtete Events fliegt der Algorithmus blind – und du auch. Wir sehen regelmäßig Konten, in denen seit Monaten „Conversions“ gezählt werden, die in Wahrheit Seitenaufrufe sind. Erst messen, dann skalieren.</p><h2>3. Ein Creative, seit Monaten im Einsatz</h2><p>Anzeigen nutzen sich ab. Wenn dieselbe Zielgruppe dasselbe Video zum zwanzigsten Mal sieht, steigen die Kosten pro Ergebnis Woche für Woche. Erfolgreiche Konten testen laufend neue Hooks und Varianten – deshalb gehört bei uns die Creative-Produktion fest zum Kampagnen-Management.</p><h2>4. Die Landingpage verliert, was die Anzeige gewinnt</h2><p>Die beste Anzeige scheitert an einer Seite, die langsam lädt, auf dem Smartphone bricht oder kein klares Formular hat. Anzeige und Landingpage sind ein System: gleiche Botschaft, gleiches Versprechen, ein offensichtlicher nächster Schritt.</p><p>Du willst wissen, welcher der vier Punkte dein Konto bremst? Wir schauen uns dein Setup im <a href="/kontakt/#termin">kostenlosen Erstgespräch</a> an – ehrlich und ohne Fachchinesisch.</p>',
		),
	);

	foreach ( $posts as $post ) {
		if ( get_page_by_path( $post['slug'], OBJECT, 'post' ) ) {
			continue;
		}
		$term   = term_exists( $post['category'], 'category' );
		if ( ! $term ) {
			$term = wp_insert_term( $post['category'], 'category' );
		}
		$cat_id = is_wp_error( $term ) ? 0 : (int) ( is_array( $term ) ? $term['term_id'] : $term );
		wp_insert_post(
			array(
				'post_title'    => $post['title'],
				'post_name'     => $post['slug'],
				'post_type'     => 'post',
				'post_status'   => 'publish',
				'post_content'  => $post['content'],
				'post_excerpt'  => $post['excerpt'],
				'post_category' => array( $cat_id ),
			)
		);
	}
}

/**
 * Impressum-Inhalt (Platzhalter kennzeichnen, was zu ersetzen ist).
 */
function nw_legal_impressum() {
	return '<h2>Angaben gemäß § 5 DDG</h2><p>Netwitcher Digital Agency<br>[Vor- und Nachname der Inhaberin / des Inhabers bzw. Rechtsform]<br>[Straße & Hausnummer]<br>[PLZ] Berlin<br>Deutschland</p><h2>Kontakt</h2><p>Telefon: [Telefonnummer]<br>E-Mail: info@netwitcher.de</p><h2>Umsatzsteuer-ID</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br>[USt-IdNr. eintragen oder Absatz entfernen]</p><h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2><p>[Vor- und Nachname]<br>[Straße], [PLZ] Berlin</p><h2>EU-Streitschlichtung</h2><p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. Unsere E-Mail-Adresse findest du oben im Impressum.</p><h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2><p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p><h2>Haftung für Inhalte</h2><p>Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p><h2>Haftung für Links</h2><p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p><h2>Urheberrecht</h2><p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>';
}

/**
 * Datenschutz-Inhalt.
 */
function nw_legal_datenschutz() {
	return '<h2>1. Datenschutz auf einen Blick</h2><p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.</p><h2>2. Verantwortliche Stelle</h2><p>Netwitcher Digital Agency<br>[Straße], [PLZ] Berlin<br>Telefon: [Telefonnummer]<br>E-Mail: info@netwitcher.de</p><h2>3. Datenerfassung auf dieser Website</h2><h3>Server-Log-Dateien</h3><p>Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die dein Browser automatisch übermittelt: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technisch fehlerfreien Darstellung und Optimierung der Website).</p><h3>Kontaktformular und Kontakt per E-Mail, Telefon oder WhatsApp</h3><p>Wenn du uns per Kontaktformular, E-Mail, Telefon oder WhatsApp kontaktierst, werden deine Angaben inklusive der von dir angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne deine Einwilligung weiter. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der effektiven Bearbeitung von Anfragen). Bei der Nutzung von WhatsApp gelten ergänzend die Datenschutzhinweise der WhatsApp Ireland Ltd.</p><h3>Terminbuchung (Calendly)</h3><p>Für die Buchung von Erstgesprächen verlinken wir auf den Dienst Calendly (Calendly LLC, USA). Wenn du dort einen Termin buchst, verarbeitet Calendly die von dir eingegebenen Daten (z. B. Name, E-Mail-Adresse, Wunschtermin). Details findest du in der Datenschutzerklärung von Calendly. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p><h2>4. Hosting</h2><p>Diese Website wird bei einem externen Dienstleister gehostet ([Hosting-Anbieter eintragen]). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Der Einsatz des Hosters erfolgt im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots (Art. 6 Abs. 1 lit. f DSGVO). Mit dem Hoster wurde ein Vertrag über Auftragsverarbeitung geschlossen.</p><h2>5. Analyse-Tools und Marketing</h2><p>[Sofern eingesetzt: Hier Angaben zu Google Analytics, Meta Pixel, TikTok Pixel o. Ä. ergänzen – inklusive Rechtsgrundlage (Einwilligung über ein Consent-Banner, Art. 6 Abs. 1 lit. a DSGVO), Speicherdauer und Widerrufsmöglichkeit. Werden keine solchen Tools eingesetzt, kann dieser Abschnitt entfallen.]</p><h2>6. Deine Rechte</h2><p>Du hast im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf:</p><ul><li>Auskunft über deine gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li><li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li><li>Löschung deiner Daten (Art. 17 DSGVO)</li><li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li><li>Datenübertragbarkeit (Art. 20 DSGVO)</li><li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li><li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li><li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO) – zuständig ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit</li></ul><h2>7. Speicherdauer</h2><p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben deine personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn du ein berechtigtes Löschersuchen geltend machst oder eine Einwilligung zur Datenverarbeitung widerrufst, werden deine Daten gelöscht, sofern keine anderen rechtlich zulässigen Gründe für die Speicherung bestehen (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen).</p><h2>8. SSL- bzw. TLS-Verschlüsselung</h2><p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du an dem Schloss-Symbol in deiner Browserzeile.</p>';
}

/**
 * AGB-Inhalt.
 */
function nw_legal_agb() {
	return '<p><em>Hinweis: strukturierte Vorlage – vor Verwendung rechtlich prüfen lassen und Platzhalter ersetzen.</em></p><h2>§ 1 Geltungsbereich</h2><p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der Netwitcher Digital Agency, [Straße], [PLZ] Berlin (nachfolgend „Agentur“) und ihren Auftraggebern (nachfolgend „Kunde“) über Leistungen in den Bereichen Content-Produktion, Fotografie, Videoproduktion, Social Media Management, Performance Marketing, Webdesign, Suchmaschinenoptimierung, Branding, Softwareentwicklung, technischer Support sowie Druck- und Printdesign. Abweichende Bedingungen des Kunden gelten nur, wenn die Agentur ihrer Geltung ausdrücklich schriftlich zugestimmt hat.</p><h2>§ 2 Vertragsschluss</h2><p>Angebote der Agentur sind freibleibend. Ein Vertrag kommt durch schriftliche Auftragsbestätigung (auch per E-Mail), durch Unterzeichnung eines Angebots oder durch Beginn der Leistungserbringung zustande. Maßgeblich für den Leistungsumfang ist das jeweilige Angebot bzw. die Leistungsbeschreibung.</p><h2>§ 3 Leistungsumfang und Mitwirkungspflichten</h2><p>Der konkrete Leistungsumfang ergibt sich aus dem jeweiligen Angebot. Der Kunde stellt der Agentur alle für die Leistungserbringung erforderlichen Inhalte, Zugänge, Freigaben und Informationen rechtzeitig zur Verfügung. Verzögerungen, die auf verspätete Mitwirkung des Kunden zurückgehen, verlängern vereinbarte Fristen angemessen.</p><h2>§ 4 Korrekturschleifen und Abnahme</h2><p>Sofern nicht anders vereinbart, sind je Leistungsposition zwei Korrekturschleifen enthalten. Weitergehende Änderungswünsche werden nach Aufwand zu den jeweils gültigen Stundensätzen berechnet. Gelieferte Leistungen gelten als abgenommen, wenn der Kunde nicht innerhalb von 14 Tagen nach Lieferung begründete Einwände erhebt.</p><h2>§ 5 Vergütung und Zahlungsbedingungen</h2><p>Es gilt die im Angebot vereinbarte Vergütung zuzüglich der gesetzlichen Umsatzsteuer. Bei Projekten kann die Agentur angemessene Abschlagszahlungen verlangen (üblich: 50 % bei Beauftragung, 50 % bei Abschluss). Laufende Leistungen (z. B. Social Media Management, Wartung, SEO) werden monatlich im Voraus abgerechnet. Rechnungen sind innerhalb von 14 Tagen ohne Abzug fällig. Mediabudgets für Werbeanzeigen trägt der Kunde und zahlt sie direkt an die jeweilige Plattform, sofern nicht anders vereinbart.</p><h2>§ 6 Laufzeit und Kündigung</h2><p>Verträge über laufende Leistungen haben, sofern nicht anders vereinbart, eine Mindestlaufzeit von drei Monaten und verlängern sich jeweils um einen Monat, wenn sie nicht mit einer Frist von 30 Tagen zum Laufzeitende gekündigt werden. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Kündigungen bedürfen der Textform.</p><h2>§ 7 Nutzungsrechte</h2><p>Mit vollständiger Zahlung der vereinbarten Vergütung erhält der Kunde die vertraglich vereinbarten Nutzungsrechte an den finalen Arbeitsergebnissen. Rohdaten, offene Projektdateien und nicht ausgewählte Entwürfe verbleiben, sofern nicht anders vereinbart, bei der Agentur. Die Agentur ist berechtigt, erbrachte Leistungen zu Referenzzwecken (Portfolio, Website, Social Media) zu präsentieren, sofern der Kunde dem nicht schriftlich widerspricht.</p><h2>§ 8 Gewährleistung und Haftung</h2><p>Die Agentur erbringt ihre Leistungen mit größter Sorgfalt nach dem aktuellen Stand der Technik. Ein bestimmter wirtschaftlicher Erfolg (z. B. Rankings, Reichweiten, Conversion-Raten) wird nicht geschuldet. Die Agentur haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit. Bei einfacher Fahrlässigkeit haftet die Agentur nur bei Verletzung wesentlicher Vertragspflichten, begrenzt auf den vertragstypischen, vorhersehbaren Schaden.</p><h2>§ 9 Vertraulichkeit und Datenschutz</h2><p>Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei geheim zu halten. Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <a href="/datenschutz/">Datenschutzerklärung</a> und den geltenden datenschutzrechtlichen Bestimmungen.</p><h2>§ 10 Schlussbestimmungen</h2><p>Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort und – soweit der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist – Gerichtsstand ist Berlin. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p><p>Stand: Juli 2026</p>';
}
