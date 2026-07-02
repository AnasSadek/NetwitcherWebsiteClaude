<?php
/**
 * Template Name: Leistung (Detailseite)
 *
 * Rendert die Service-Detailseite anhand des Seiten-Slugs aus nw_services().
 *
 * @package Netwitcher
 */

get_header();

$nw_service = nw_get_service( get_post_field( 'post_name' ) );
$nw_colors  = nw_arrow_colors();

if ( ! $nw_service ) :
	?>
	<section class="nw-page-hero"><div class="nw-container">
		<h1>Leistung nicht gefunden</h1>
		<p class="nw-muted" style="margin-top:16px;">Der Seiten-Slug „<?php echo esc_html( get_post_field( 'post_name' ) ); ?>“ ist keiner Leistung zugeordnet. Verfügbare Slugs: <?php echo esc_html( implode( ', ', array_keys( nw_leistungen_services() ) ) ); ?></p>
	</div></section>
	<?php
	get_footer();
	return;
endif;

$nw_accent = $nw_colors[ $nw_service['color'] ];
?>

<section class="nw-page-hero" style="background: radial-gradient(700px 400px at 80% 0%, <?php echo esc_attr( $nw_accent ); ?>22, transparent 65%), radial-gradient(500px 300px at 10% 90%, <?php echo esc_attr( $nw_accent ); ?>11, transparent 65%);">
	<div class="nw-container">
		<nav class="nw-breadcrumb nw-reveal" aria-label="Brotkrumen">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Startseite</a> / <a href="<?php echo esc_url( home_url( '/leistungen/' ) ); ?>">Leistungen</a> / <span style="color: var(--nw-snow);"><?php echo esc_html( $nw_service['nav_title'] ); ?></span>
		</nav>
		<div class="nw-reveal" style="max-width: 800px;">
			<p class="nw-eyebrow" style="color: <?php echo esc_attr( $nw_accent ); ?>;"><?php echo esc_html( $nw_service['eyebrow'] ); ?></p>
			<h1><?php echo esc_html( $nw_service['headline'] ); ?></h1>
			<p class="nw-intro nw-muted" style="margin-top: 24px; font-size: 17px;"><?php echo esc_html( $nw_service['intro'] ); ?></p>
			<div class="nw-btn-row">
				<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/?service=' . rawurlencode( $nw_service['nav_title'] ) ) ); ?>"><?php echo esc_html( $nw_service['cta'] ); ?></a>
				<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Kostenloses Erstgespräch</a>
			</div>
		</div>
	</div>
</section>

<section class="nw-section" style="padding-top: 40px;">
	<div class="nw-container">
		<div class="nw-grid nw-grid--3" style="margin-top: 0;">
			<?php foreach ( $nw_service['sections'] as $i => $sec ) : ?>
				<div class="nw-card nw-reveal">
					<?php nw_arrow_svg( $nw_service['color'], 24, $i * 72 ); ?>
					<h3 style="margin-top: 20px;"><?php echo esc_html( $sec[0] ); ?></h3>
					<p><?php echo esc_html( $sec[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Konkret & greifbar',
				'title'   => 'Das bekommst du',
				'intro'   => 'Keine vagen Versprechen – das ist der Umfang, mit dem wir arbeiten. Im Angebot wird jeder Punkt auf dein Projekt zugeschnitten.',
			)
		);
		?>
		<ul class="nw-checklist nw-checklist--2 nw-reveal" style="max-width: 860px; margin-inline: auto;">
			<?php foreach ( $nw_service['deliverables'] as $item ) : ?>
				<li><?php nw_arrow_svg( $nw_service['color'], 13, 90 ); ?><?php echo esc_html( $item ); ?></li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<section class="nw-section">
	<div class="nw-container">
		<?php nw_section_head( array( 'eyebrow' => 'Häufige Fragen', 'title' => 'Gut zu wissen' ) ); ?>
		<div class="nw-faq">
			<?php foreach ( $nw_service['faq'] as $faq ) : ?>
				<details class="nw-reveal">
					<summary><?php echo esc_html( $faq[0] ); ?></summary>
					<p><?php echo esc_html( $faq[1] ); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<?php nw_section_head( array( 'eyebrow' => 'Passt oft dazu', 'title' => 'Verwandte Leistungen' ) ); ?>
		<div class="nw-grid nw-grid--3">
			<?php
			$nw_related = array_slice( array_filter( nw_leistungen_services(), fn( $s ) => $s['slug'] !== $nw_service['slug'] ), 0, 3 );
			foreach ( $nw_related as $rel ) {
				nw_service_card( $rel );
			}
			?>
		</div>
	</div>
</section>

<?php
nw_final_cta();
get_footer();
