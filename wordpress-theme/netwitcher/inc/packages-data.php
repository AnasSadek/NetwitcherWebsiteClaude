<?php
/**
 * Content-Pakete (ohne Preise, wertorientiert).
 *
 * @package Netwitcher
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nw_packages_note() {
	return 'Alle Pakete werden individuell auf Zielgruppe, Branche und Plattform abgestimmt – du zahlst für Wirkung, nicht für Posten auf einer Liste.';
}

function nw_packages() {
	return array(
		array(
			'name'      => 'Starter Content',
			'color'     => 'mint',
			'tagline'   => 'Der professionelle Einstieg',
			'for_whom'  => 'Für Unternehmen, die endlich Content wollen, der nach Marke aussieht – ohne gleich ein ganzes Marketing-Team aufzubauen.',
			'includes'  => array( 'Content-Konzept & Look-Definition', 'Studio-Shooting-Tag in Berlin', 'Produktfotos oder Team-Bilder', 'Erste Reels für Instagram & TikTok', 'Bildmaterial für Website & Profile' ),
			'cta'       => 'Starter anfragen',
			'highlight' => false,
		),
		array(
			'name'      => 'Growth Content',
			'color'     => 'sky',
			'tagline'   => 'Sichtbarkeit mit System',
			'for_whom'  => 'Für Marken, die regelmäßig sichtbar sein wollen: monatliche Produktion plus Kanal-Betreuung – Content und Posting aus einer Hand.',
			'includes'  => array( 'Monatlicher Produktions-Slot im Studio', 'Reels, Posts & Stories nach Redaktionsplan', 'Social Media Management inklusive', 'Community Management', 'Monatlicher Report mit Empfehlungen' ),
			'cta'       => 'Growth anfragen',
			'highlight' => true,
		),
		array(
			'name'      => 'Performance Content',
			'color'     => 'violet',
			'tagline'   => 'Content, der Kampagnen antreibt',
			'for_whom'  => 'Für Unternehmen, die Werbung schalten: laufende Creative-Produktion plus Kampagnen-Management auf Meta, TikTok oder Google.',
			'includes'  => array( 'Ad-Creatives aus dem Studio (Video & Static)', 'Strukturierte Creative-Tests', 'Kampagnen-Setup & -Optimierung', 'Conversion-Tracking & Landingpage-Check', 'Transparentes Performance-Reporting' ),
			'cta'       => 'Performance anfragen',
			'highlight' => false,
		),
		array(
			'name'      => 'Full-Service Marketing',
			'color'     => 'pink',
			'tagline'   => 'Dein komplettes Marketing-Team',
			'for_whom'  => 'Für Unternehmen, die Wachstum ernst meinen: Strategie, Content, Social Media, Ads, Website und SEO – koordiniert von einem Team mit einem Ziel.',
			'includes'  => array( 'Marketing-Strategie & Quartalsplanung', 'Content-Produktion & Social Media', 'Performance-Kampagnen', 'Website-Weiterentwicklung & SEO', 'Fester Ansprechpartner & Monats-Review' ),
			'cta'       => 'Full-Service anfragen',
			'highlight' => false,
		),
	);
}

/**
 * Paket-Karte rendern.
 */
function nw_package_card( $pkg ) {
	$colors = nw_arrow_colors();
	$accent = $colors[ $pkg['color'] ];
	?>
	<article class="nw-card nw-pkg <?php echo $pkg['highlight'] ? 'nw-pkg--highlight' : ''; ?> nw-reveal">
		<?php if ( $pkg['highlight'] ) : ?>
			<span class="nw-pkg-flag">Am häufigsten gewählt</span>
		<?php endif; ?>
		<div class="nw-pkg-head">
			<?php nw_arrow_svg( $pkg['color'], 20 ); ?>
			<h3><?php echo esc_html( $pkg['name'] ); ?></h3>
		</div>
		<p class="nw-pkg-tag" style="color: <?php echo esc_attr( $accent ); ?>"><?php echo esc_html( $pkg['tagline'] ); ?></p>
		<p><?php echo esc_html( $pkg['for_whom'] ); ?></p>
		<ul>
			<?php foreach ( $pkg['includes'] as $inc ) : ?>
				<li><?php nw_arrow_svg( $pkg['color'], 12, 90 ); ?><?php echo esc_html( $inc ); ?></li>
			<?php endforeach; ?>
		</ul>
		<a class="nw-btn <?php echo $pkg['highlight'] ? 'nw-btn--primary' : 'nw-btn--secondary'; ?>" href="<?php echo esc_url( home_url( '/kontakt/?service=' . rawurlencode( $pkg['name'] ) ) ); ?>">
			<?php echo esc_html( $pkg['cta'] ); ?>
		</a>
	</article>
	<?php
}
