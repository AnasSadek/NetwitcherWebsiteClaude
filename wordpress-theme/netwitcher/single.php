<?php
/**
 * Einzelner Blogartikel.
 *
 * @package Netwitcher
 */

get_header();
?>

<?php while ( have_posts() ) : the_post(); ?>
	<article class="nw-section" style="padding-top: 150px;">
		<div class="nw-container">
			<div class="nw-prose">
				<nav class="nw-breadcrumb" aria-label="Brotkrumen">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Startseite</a> / <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a>
				</nav>
				<?php $nw_cats = get_the_category(); ?>
				<?php if ( $nw_cats ) : ?>
					<p class="nw-eyebrow"><?php echo esc_html( $nw_cats[0]->name ); ?></p>
				<?php endif; ?>
				<h1 style="font-size: clamp(1.8rem, 4vw, 2.5rem);"><?php the_title(); ?></h1>
				<p class="nw-postmeta">
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
					· Netwitcher Team
				</p>
				<div style="margin-top: 40px;">
					<?php the_content(); ?>
				</div>

				<div class="nw-card nw-reveal" style="margin-top: 56px; text-align: center; align-items: center;">
					<h2 style="font-size: 18px;">Diese Themen für dein Unternehmen umsetzen?</h2>
					<p>Im kostenlosen Erstgespräch übertragen wir das auf deine Marke – konkret und ohne Verpflichtung.</p>
					<p style="margin-top: 24px;"><a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Kostenloses Erstgespräch buchen</a></p>
				</div>
			</div>
		</div>
	</article>
<?php endwhile; ?>

<?php
nw_final_cta();
get_footer();
