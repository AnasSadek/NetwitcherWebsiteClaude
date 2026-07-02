<?php
/**
 * 404-Seite.
 *
 * @package Netwitcher
 */

get_header();
?>

<section class="nw-404">
	<div class="nw-container" style="max-width: 640px;">
		<?php nw_star_svg( 72, 'nw-float' ); ?>
		<h1 style="font-size: 56px; margin-top: 32px;">404</h1>
		<p style="margin-top: 16px; font-size: 18px; font-weight: 700;">Diese Seite hat sich entzaubert.</p>
		<p class="nw-muted" style="margin-top: 12px; font-size: 14px;">Die gesuchte Seite existiert nicht (mehr). Aber keine Sorge – die Magie findest du auf der Startseite oder in unseren Leistungen.</p>
		<div class="nw-btn-row" style="justify-content: center;">
			<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">Zur Startseite</a>
			<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/leistungen/' ) ); ?>">Leistungen ansehen</a>
		</div>
	</div>
</section>

<?php
get_footer();
