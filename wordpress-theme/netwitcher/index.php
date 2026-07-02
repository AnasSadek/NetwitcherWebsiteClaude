<?php
/**
 * Blog-Index / Archiv-Fallback.
 *
 * @package Netwitcher
 */

get_header();
$nw_order  = nw_star_order();
$nw_colors = nw_arrow_colors();
?>

<section class="nw-page-hero nw-aurora">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'align'   => 'left',
				'tag'     => 'h1',
				'eyebrow' => 'Blog',
				'title'   => is_home() ? 'Praxiswissen statt <span class="nw-gradient">Marketing-Blabla</span>' : esc_html( get_the_archive_title() ),
				'intro'   => is_home() ? 'Was wir im Studio und in Kampagnen jeden Tag lernen, schreiben wir hier auf – konkret, anwendbar und ohne Verkaufsdruck.' : '',
			)
		);
		?>
	</div>
</section>

<section class="nw-section" style="padding-top: 24px;">
	<div class="nw-container">
		<?php if ( have_posts() ) : ?>
			<div class="nw-grid nw-grid--3">
				<?php
				$nw_i = 0;
				while ( have_posts() ) :
					the_post();
					$nw_accent = $nw_colors[ $nw_order[ $nw_i % 5 ] ];
					$nw_cats   = get_the_category();
					?>
					<article class="nw-card nw-reveal">
						<a class="nw-card-link" href="<?php the_permalink(); ?>" aria-label="<?php the_title_attribute(); ?>"></a>
						<?php if ( $nw_cats ) : ?>
							<p class="nw-postcard-cat" style="color: <?php echo esc_attr( $nw_accent ); ?>;"><?php echo esc_html( $nw_cats[0]->name ); ?></p>
						<?php endif; ?>
						<h3><?php the_title(); ?></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 30 ) ); ?></p>
						<p class="nw-postmeta"><time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></p>
					</article>
					<?php
					$nw_i++;
				endwhile;
				?>
			</div>
			<div style="margin-top: 48px; text-align: center;">
				<?php the_posts_pagination( array( 'prev_text' => '← Neuere', 'next_text' => 'Ältere →' ) ); ?>
			</div>
		<?php else : ?>
			<p class="nw-muted">Hier erscheinen bald unsere ersten Artikel.</p>
		<?php endif; ?>
	</div>
</section>

<?php
nw_final_cta(
	'Lieber direkt fragen statt lesen?',
	'Vieles klärt sich in 20 Minuten Gespräch schneller als in 20 Artikeln. Buch dir ein kostenloses Erstgespräch – wir beantworten deine Fragen konkret für dein Unternehmen.'
);
get_footer();
