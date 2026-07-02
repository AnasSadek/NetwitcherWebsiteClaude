<?php
/**
 * Template Name: Studio Berlin (Content Creation)
 *
 * @package Netwitcher
 */

get_header();
$nw_studio = nw_get_service( 'studio' );
?>

<section class="nw-page-hero" style="background: radial-gradient(800px 450px at 75% 10%, rgba(244,104,168,.16), transparent 65%), radial-gradient(600px 400px at 15% 80%, rgba(245,211,61,.1), transparent 65%);">
	<div class="nw-container">
		<div class="nw-split">
			<div class="nw-reveal">
				<p class="nw-eyebrow nw-eyebrow--pink"><?php echo esc_html( $nw_studio['eyebrow'] ); ?> · Studio Berlin</p>
				<h1><?php echo esc_html( $nw_studio['headline'] ); ?></h1>
				<p class="nw-muted" style="margin-top: 24px; font-size: 17px;"><?php echo esc_html( $nw_studio['intro'] ); ?></p>
				<div class="nw-btn-row">
					<a class="nw-btn nw-btn--warm" href="<?php echo esc_url( home_url( '/kontakt/?service=Fotoshooting' ) ); ?>">Studio-Shooting anfragen</a>
					<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Kostenloses Erstgespräch</a>
				</div>
			</div>
			<div class="nw-figure nw-reveal">
				<img src="<?php echo esc_url( nw_get_option( 'img_studio' ) ); ?>" alt="Content-Studio in Berlin: Produktfotografie-Setup mit Softboxen, Kamera und Neon-Akzentlicht" width="1024" height="576">
			</div>
		</div>
	</div>
</section>

<section class="nw-section">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow'       => 'Was im Studio entsteht',
				'eyebrow_class' => 'nw-eyebrow--pink',
				'title'         => 'Ein Ort. <span class="nw-gradient-warm">Alle Formate.</span>',
				'intro'         => 'Vom Produktbild bis zum Kampagnenvideo: Wir produzieren dort, wo Licht, Technik und Team schon bereitstehen – das macht uns schnell und die Qualität konstant.',
			)
		);
		$nw_angebote = array(
			array( 'sun', 'Produktfotografie', 'E-Commerce-Freisteller, Lifestyle-Szenen und Detailaufnahmen mit Set-Design – Bilder, die den Preis deines Produkts rechtfertigen.' ),
			array( 'pink', 'Food & Beverage Shoots', 'Gerichte, Drinks und Zutaten, inszeniert mit Licht und Textur – Content, der Appetit macht und Reservierungen bringt.' ),
			array( 'violet', 'Beauty & Kosmetik Content', 'Texturen, Swatches, Anwendung: Beauty-Content mit dem Look großer Marken – produziert für Feed, Shop und Ads.' ),
			array( 'mint', 'E-Commerce Produktbilder', 'Einheitliche Bildserien für dein komplettes Sortiment – konsistent, skalierbar und shop-optimiert angeliefert.' ),
			array( 'sky', 'Reels für Instagram & TikTok', 'Vertikal gedacht, mit Hook geplant, nativ geschnitten – Reels, die organische Reichweite holen statt sie zu kaufen.' ),
			array( 'violet', 'Werbevideos für Ads', 'Kurze Performance-Videos mit klarer Botschaft und CTA – das Material, das Meta- und TikTok-Kampagnen wirklich brauchen.' ),
			array( 'pink', 'Behind-the-Scenes Content', 'Echte Einblicke in dein Team und deine Produktion – der Content, der Vertrauen aufbaut und Marken nahbar macht.' ),
			array( 'mint', 'Content für Webseiten & Landingpages', 'Header-Bilder, Team-Fotos und Produktvisuals, die deine Website vom Template zum Markenauftritt machen.' ),
		);
		?>
		<div class="nw-grid nw-grid--4">
			<?php foreach ( $nw_angebote as $item ) : ?>
				<div class="nw-card nw-card--<?php echo esc_attr( $item[0] ); ?> nw-reveal">
					<?php nw_arrow_svg( $item[0], 22 ); ?>
					<h3 style="margin-top: 16px; font-size: 15px;"><?php echo esc_html( $item[1] ); ?></h3>
					<p style="font-size: 13px;"><?php echo esc_html( $item[2] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<div class="nw-grid nw-grid--2" style="margin-top: 0; align-items: stretch;">
			<figure class="nw-figure nw-reveal" style="margin: 0;">
				<img src="<?php echo esc_url( nw_get_option( 'img_product' ) ); ?>" alt="High-End-Produktfotografie im Studio: Kosmetikflasche mit Cyan- und Magenta-Lichtkanten" loading="lazy" width="768" height="1024" style="height: 100%;">
				<figcaption style="color: var(--nw-mint);">Produktfotografie</figcaption>
			</figure>
			<div style="display: grid; gap: 24px;">
				<figure class="nw-figure nw-reveal" style="margin: 0;">
					<img src="<?php echo esc_url( nw_get_option( 'img_reels' ) ); ?>" alt="Behind the Scenes einer Reel-Produktion mit Gimbal und Ringlicht im dunklen Studio" loading="lazy" width="1024" height="576">
					<figcaption style="color: var(--nw-sky);">Reels &amp; Video-Produktion</figcaption>
				</figure>
				<div class="nw-card nw-reveal" style="justify-content: center;">
					<h2 style="font-size: 20px;">Produkt einsenden, Content zurückbekommen</h2>
					<p>Du musst für ein Shooting nicht nach Berlin kommen: Sende uns dein Produkt, wir übernehmen Set-Design, Produktion, Nachbearbeitung und Rückversand. Innerhalb weniger Tage hast du kampagnenfertigen Content im Postfach.</p>
					<p style="margin-top: 24px;"><a class="nw-btn nw-btn--warm" href="<?php echo esc_url( home_url( '/kontakt/?service=Fotoshooting' ) ); ?>">Studio-Shooting anfragen</a></p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="nw-section">
	<div class="nw-container">
		<div class="nw-grid nw-grid--3" style="margin-top: 0;">
			<?php foreach ( $nw_studio['sections'] as $i => $sec ) : ?>
				<div class="nw-card nw-reveal">
					<?php nw_arrow_svg( 'pink', 24, $i * 72 ); ?>
					<h3 style="margin-top: 20px;"><?php echo esc_html( $sec[0] ); ?></h3>
					<p><?php echo esc_html( $sec[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<?php nw_section_head( array( 'eyebrow' => 'Häufige Fragen', 'eyebrow_class' => 'nw-eyebrow--pink', 'title' => 'Gut zu wissen' ) ); ?>
		<div class="nw-faq">
			<?php foreach ( $nw_studio['faq'] as $faq ) : ?>
				<details class="nw-reveal">
					<summary><?php echo esc_html( $faq[0] ); ?></summary>
					<p><?php echo esc_html( $faq[1] ); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php
nw_final_cta(
	'Dein Produkt verdient bessere Bilder.',
	'Erzähl uns, was du verkaufst – wir zeigen dir, wie es im richtigen Licht aussieht. Erstgespräch und Konzeptidee sind kostenlos.'
);
get_footer();
