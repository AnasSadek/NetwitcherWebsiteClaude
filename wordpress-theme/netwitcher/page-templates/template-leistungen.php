<?php
/**
 * Template Name: Leistungen (Übersicht)
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
				'eyebrow' => 'Leistungen',
				'title'   => 'Alles, was deine Marke <span class="nw-gradient">wachsen lässt</span>',
				'intro'   => 'Zehn Bereiche, ein Team: Wir verbinden Content-Produktion, Kampagnen und Technik so, dass jeder Baustein auf dasselbe Ziel einzahlt – mehr Sichtbarkeit, mehr Vertrauen, mehr Anfragen. Wähl den Bereich, der dich gerade weiterbringt.',
			)
		);
		?>
	</div>
</section>

<section class="nw-section" style="padding-top: 24px;">
	<div class="nw-container">
		<div class="nw-grid nw-grid--3">
			<?php foreach ( nw_services() as $service ) : ?>
				<?php nw_service_card( $service ); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php
nw_final_cta(
	'Nicht sicher, wo du anfangen sollst?',
	'Kein Problem – dafür ist das Erstgespräch da. Wir schauen gemeinsam auf dein Unternehmen und sagen dir ehrlich, welcher Hebel bei dir zuerst wirkt: Content, Kampagnen oder Website.'
);
get_footer();
