<?php
/**
 * Template Name: Projekte / Case Studies
 *
 * @package Netwitcher
 */

get_header();
?>

<section class="nw-page-hero nw-aurora">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'align'   => 'left',
				'tag'     => 'h1',
				'eyebrow' => 'Projekte & Case Studies',
				'title'   => 'Arbeit, die man <span class="nw-gradient">messen kann</span>',
				'intro'   => 'Sechs Branchen, sechs typische Ausgangslagen, sechs Wege zum Ergebnis. Die Cases zeigen, wie wir denken und arbeiten – konkrete Kundennamen und Kennzahlen ergänzen wir nach Freigabe unserer Kunden.',
			)
		);
		?>
	</div>
</section>

<section class="nw-section" style="padding-top: 24px;">
	<div class="nw-container">
		<div class="nw-grid nw-grid--3">
			<?php foreach ( nw_cases() as $case ) : ?>
				<?php nw_case_card( $case ); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php
nw_final_cta(
	'Dein Projekt könnte das nächste sein.',
	'Egal ob Restaurant, Shop, Handwerk oder B2B: Erzähl uns deine Ausgangslage – wir zeigen dir, wie wir sie angehen würden. Kostenlos und unverbindlich.'
);
get_footer();
