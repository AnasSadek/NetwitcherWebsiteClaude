<?php
/**
 * Standard-Seite (Impressum, Datenschutz, AGB & frei angelegte Seiten).
 *
 * @package Netwitcher
 */

get_header();
?>

<?php while ( have_posts() ) : the_post(); ?>
	<section class="nw-section" style="padding-top: 150px;">
		<div class="nw-container">
			<div class="nw-prose">
				<h1 style="font-size: clamp(1.8rem, 4vw, 2.5rem);"><?php the_title(); ?></h1>
				<div style="margin-top: 40px;">
					<?php the_content(); ?>
				</div>
			</div>
		</div>
	</section>
<?php endwhile; ?>

<?php
get_footer();
