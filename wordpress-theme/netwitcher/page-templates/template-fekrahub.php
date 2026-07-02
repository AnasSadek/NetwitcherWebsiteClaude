<?php
/**
 * Template Name: Produkte / FekraHub
 *
 * @package Netwitcher
 */

get_header();
?>

<section class="nw-page-hero nw-aurora">
	<div class="nw-container">
		<div class="nw-reveal" style="max-width: 800px;">
			<p class="nw-eyebrow nw-eyebrow--sky">Produkte · FekraHub</p>
			<h1>FekraHub: Schulverwaltung, <span class="nw-gradient">die sich selbst erklärt</span></h1>
			<p class="nw-muted" style="margin-top: 24px; font-size: 17px;">FekraHub ist unsere selbst entwickelte Plattform für Schulen und Bildungseinrichtungen: Anmeldungen, Kurse, Kommunikation und Berichte an einem Ort – gebaut, weil Zettelwirtschaft und Excel-Listen wertvolle Zeit kosten, die in den Unterricht gehört.</p>
			<div class="nw-btn-row">
				<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/?service=Software' ) ); ?>">Demo anfragen</a>
				<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/leistungen/softwareentwicklung/' ) ); ?>">Eigene Lösung entwickeln lassen</a>
			</div>
		</div>
	</div>
</section>

<section class="nw-section">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Funktionen',
				'title'   => 'Alles Wichtige an einem Ort',
				'intro'   => 'FekraHub deckt den Alltag einer Bildungseinrichtung ab – von der ersten Anmeldung bis zum Zeugnis.',
			)
		);
		$nw_features = array(
			array( 'mint', 'Digitale Anmeldung', 'Eltern melden Kinder online an – ohne Papierformulare, mit klarem Status für Verwaltung und Familien.' ),
			array( 'violet', 'Kurs- & Klassenverwaltung', 'Kurse, Klassen, Lehrkräfte und Räume zentral organisiert – inklusive Zuweisungen und Kapazitäten.' ),
			array( 'pink', 'Kommunikation', 'Ankündigungen und Nachrichten erreichen Eltern zuverlässig – mehrsprachig und nachvollziehbar.' ),
			array( 'sun', 'Berichte & Zeugnisse', 'Leistungsberichte digital erstellen, freigeben und teilen – mit Rollen und Rechten für jedes Teammitglied.' ),
			array( 'sky', 'Rollen & Rechte', 'Verwaltung, Lehrkräfte, Eltern: Jede Rolle sieht genau das, was sie braucht – nicht mehr und nicht weniger.' ),
			array( 'mint', 'Sicher & DSGVO-bewusst', 'Entwickelt und gehostet mit Fokus auf Datenschutz – sensible Schülerdaten bleiben geschützt.' ),
		);
		?>
		<div class="nw-grid nw-grid--3">
			<?php foreach ( $nw_features as $feat ) : ?>
				<div class="nw-card nw-card--<?php echo esc_attr( $feat[0] ); ?> nw-reveal">
					<?php nw_arrow_svg( $feat[0], 24 ); ?>
					<h3 style="margin-top: 16px;"><?php echo esc_html( $feat[1] ); ?></h3>
					<p><?php echo esc_html( $feat[2] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<div class="nw-section-head nw-reveal">
			<h2>Warum wir ein eigenes Produkt bauen</h2>
			<p class="nw-intro">FekraHub ist mehr als ein Produkt – es ist unser Beweis, dass wir Software nicht nur versprechen, sondern betreiben. Jede Erfahrung aus dem echten Plattform-Alltag – Rollenmodelle, Datenmodelle, Support – fließt direkt in die individuellen Lösungen, die wir für Kunden entwickeln.</p>
		</div>
	</div>
</section>

<?php
nw_final_cta(
	'Interesse an FekraHub – oder an deiner eigenen Plattform?',
	'Wir zeigen dir FekraHub gern in einer Demo. Und wenn du ein eigenes digitales Werkzeug brauchst: Genau solche Systeme entwickeln wir.'
);
get_footer();
