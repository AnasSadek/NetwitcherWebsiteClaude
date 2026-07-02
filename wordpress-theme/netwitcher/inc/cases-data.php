<?php
/**
 * Case-Study-Platzhalter nach Branchen – bereit für echte Projekte & Kennzahlen.
 *
 * @package Netwitcher
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nw_cases() {
	return array(
		array(
			'category'  => 'Restaurant & Food Content',
			'title'     => 'Vom leeren Feed zum vollen Laden',
			'color'     => 'sun',
			'challenge' => 'Ein Berliner Restaurant mit starker Küche, aber schwachem Auftritt: Handyfotos im Feed, keine Reels, kaum Reservierungen über Instagram.',
			'solution'  => 'Food-Shooting im Studio und vor Ort, monatliche Reels-Produktion mit Gerichten und Team, neue Speisekarte im Branding und lokale Meta-Kampagne auf Reservierungen.',
			'result'    => 'Ergebnis-Platzhalter: Reichweite, Profilbesuche und Reservierungen über Social Media – echte Kennzahlen folgen nach Projektfreigabe.',
			'services'  => array( 'Food-Fotografie', 'Reels', 'Printdesign', 'Meta Ads' ),
		),
		array(
			'category'  => 'Beauty & Kosmetik',
			'title'     => 'Produktbilder, die den Warenkorb füllen',
			'color'     => 'pink',
			'challenge' => 'Eine Kosmetikmarke mit hochwertigem Produkt, dessen Fotos den Preis nicht rechtfertigten – hohe Klickzahlen, aber schwache Conversion im Shop.',
			'solution'  => 'Produktfotografie mit Set-Design und Neon-Akzenten im Studio, UGC-Reels für Ads, überarbeitete Produktseiten und strukturierte Creative-Tests auf Meta und TikTok.',
			'result'    => 'Ergebnis-Platzhalter: Conversion-Rate der Produktseiten und Cost-per-Purchase der Kampagnen – Kennzahlen folgen nach Projektfreigabe.',
			'services'  => array( 'Produktfotografie', 'UGC-Content', 'TikTok Ads', 'Shop-Optimierung' ),
		),
		array(
			'category'  => 'E-Commerce Produkte',
			'title'     => 'Ein Shooting, ein kompletter Shop-Relaunch',
			'color'     => 'mint',
			'challenge' => 'Ein Online-Shop mit wachsendem Sortiment, aber uneinheitlichen Produktbildern aus drei Quellen – die Marke wirkte kleiner, als sie war.',
			'solution'  => 'Einheitliches Bildkonzept, Produktfotografie-Serie für das gesamte Sortiment im Studio Berlin, schnellere Produktseiten und sauberes Tracking-Setup.',
			'result'    => 'Ergebnis-Platzhalter: einheitliche Bildwelt über das komplette Sortiment, verbesserte Ladezeiten und messbare Shop-Kennzahlen nach Freigabe.',
			'services'  => array( 'E-Commerce-Fotografie', 'Webdesign', 'Speed-Optimierung', 'Analytics' ),
		),
		array(
			'category'  => 'Handwerk & lokale Dienstleistungen',
			'title'     => 'Sichtbar in Berlin, wenn Kunden suchen',
			'color'     => 'sky',
			'challenge' => 'Ein Handwerksbetrieb mit vollem Auftragsbuch über Empfehlungen – aber ohne digitale Sichtbarkeit für die nächste Wachstumsstufe.',
			'solution'  => 'Neue Website mit klarer Leistungsstruktur, Local-SEO-Setup mit Google-Business-Profil, Team- und Baustellenfotografie sowie Google Ads auf die stärksten Leistungen.',
			'result'    => 'Ergebnis-Platzhalter: lokale Rankings, Anrufe über das Google-Profil und Anfragen über die Website – Kennzahlen folgen nach Freigabe.',
			'services'  => array( 'Webdesign', 'Local SEO', 'Fotografie', 'Google Ads' ),
		),
		array(
			'category'  => 'B2B Websites',
			'title'     => 'Vom PDF-Anhang zur digitalen Vertriebsmaschine',
			'color'     => 'violet',
			'challenge' => 'Ein B2B-Dienstleister, dessen Website ein Online-Prospekt war: viel Text, keine Struktur, keine messbaren Anfragen – der Vertrieb lief komplett manuell.',
			'solution'  => 'Neupositionierung der Startseite auf Zielgruppen-Probleme, Referenz- und Prozess-Seiten, professionelle Team-Fotografie und LinkedIn-Content zur Begleitung des Vertriebs.',
			'result'    => 'Ergebnis-Platzhalter: qualifizierte Anfragen über die Website und Sichtbarkeit des Teams auf LinkedIn – Kennzahlen folgen nach Freigabe.',
			'services'  => array( 'Webdesign', 'Content-Strategie', 'Fotografie', 'LinkedIn-Content' ),
		),
		array(
			'category'  => 'Social Media Kampagnen',
			'title'     => 'Creative-Tests statt Bauchgefühl',
			'color'     => 'pink',
			'challenge' => 'Eine Marke schaltete seit Monaten dieselben zwei Anzeigen – steigende Klickpreise, sinkende Ergebnisse, keine neuen Impulse.',
			'solution'  => 'Monatliche Creative-Produktion im Studio (Reels, Statics, UGC), strukturierte A/B-Tests, sauberes Conversion-Tracking und Skalierung der Gewinner-Varianten.',
			'result'    => 'Ergebnis-Platzhalter: Cost-per-Lead und Return on Ad Spend im Kampagnenverlauf – Kennzahlen folgen nach Freigabe.',
			'services'  => array( 'Creative-Produktion', 'Meta Ads', 'Tracking', 'Reporting' ),
		),
	);
}

/**
 * Case-Karte rendern.
 */
function nw_case_card( $item ) {
	$colors = nw_arrow_colors();
	$accent = $colors[ $item['color'] ];
	?>
	<article class="nw-card nw-reveal">
		<div class="nw-case-head" style="background: radial-gradient(400px 160px at 20% 0%, <?php echo esc_attr( $accent ); ?>33, transparent 70%), linear-gradient(160deg, #12122688, #0B0B1A);">
			<?php nw_arrow_svg( $item['color'], 120 ); ?>
			<p class="nw-case-cat" style="color: <?php echo esc_attr( $accent ); ?>"><?php echo esc_html( $item['category'] ); ?></p>
		</div>
		<h3><?php echo esc_html( $item['title'] ); ?></h3>
		<p class="nw-case-block"><strong>Herausforderung · </strong><span><?php echo esc_html( $item['challenge'] ); ?></span></p>
		<p class="nw-case-block"><strong>Lösung · </strong><span><?php echo esc_html( $item['solution'] ); ?></span></p>
		<p class="nw-case-block"><strong>Ergebnis · </strong><span><em><?php echo esc_html( $item['result'] ); ?></em></span></p>
		<ul class="nw-taglist">
			<?php foreach ( $item['services'] as $svc ) : ?>
				<li><?php echo esc_html( $svc ); ?></li>
			<?php endforeach; ?>
		</ul>
		<a class="nw-arrowlink" style="color: <?php echo esc_attr( $accent ); ?>; margin-top: 24px; position: relative; z-index: 2;" href="<?php echo esc_url( home_url( '/kontakt/?service=' . rawurlencode( $item['category'] ) ) ); ?>">
			Ähnliches Projekt starten <span class="nw-arrowlink-chev" aria-hidden="true">→</span>
		</a>
	</article>
	<?php
}
