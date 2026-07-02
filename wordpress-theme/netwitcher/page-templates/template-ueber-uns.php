<?php
/**
 * Template Name: Über uns
 *
 * @package Netwitcher
 */

get_header();
?>

<section class="nw-page-hero nw-aurora">
	<div class="nw-container">
		<div class="nw-split">
			<div class="nw-reveal">
				<p class="nw-eyebrow">Über uns</p>
				<h1>Wir sind das Studio, das <span class="nw-gradient">Content wie Vertrieb</span> denkt.</h1>
				<p class="nw-muted" style="margin-top: 24px; font-size: 17px;">Netwitcher ist eine Digital Agency und ein Content-Studio aus Berlin. Wir haben Netwitcher gegründet, weil wir zu oft dasselbe gesehen haben: Unternehmen mit starken Produkten, deren Auftritt ihnen nicht gerecht wird – und Agenturen, die schöne Bilder liefern, aber keine Anfragen. Wir machen beides: Content, der auffällt, und Systeme, die daraus Kunden machen.</p>
				<div class="nw-btn-row">
					<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Lern uns kennen – kostenloses Erstgespräch</a>
					<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/studio/' ) ); ?>">Unser Studio in Berlin</a>
				</div>
			</div>
			<div class="nw-reveal" style="display: flex; justify-content: center;">
				<?php nw_star_svg( 220, 'nw-float' ); ?>
			</div>
		</div>
	</div>
</section>

<section class="nw-section">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Fünf Pfeile, ein Team',
				'title'   => 'Warum unser Logo ein <span class="nw-gradient">Stern aus Pfeilen</span> ist',
				'intro'   => 'Jeder Pfeil steht für eine Disziplin – Webdesign, Strategie, Content, Fotografie, Social Media. Einzeln sind sie Werkzeuge. Zusammengesetzt ergeben sie den Stern: Marketing, das aus einem Guss funktioniert. Genau so arbeiten wir.',
			)
		);
		?>
		<div class="nw-grid nw-grid--5">
			<?php foreach ( nw_arrow_targets() as $i => $target ) : ?>
				<div class="nw-card nw-reveal" style="text-align: center; align-items: center;">
					<?php nw_arrow_svg( $target['color'], 34, $i * 72 ); ?>
					<h3 style="margin-top: 16px; font-size: 14px;"><?php echo esc_html( $target['label'] ); ?></h3>
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
				'eyebrow' => 'Wofür wir stehen',
				'title'   => 'Vier Prinzipien, an denen du uns messen kannst',
			)
		);
		$nw_werte = array(
			array( 'Ehrlichkeit vor Verkauf', 'Wenn eine Leistung dir nichts bringt, sagen wir das – auch wenn wir sie im Angebot haben. Langfristige Kunden sind uns wichtiger als schnelle Abschlüsse.' ),
			array( 'Ergebnisse vor Ästhetik', 'Schön ist Pflicht, wirksam ist das Ziel. Wir messen unsere Arbeit an Anfragen, Verkäufen und Sichtbarkeit – nicht an Design-Preisen.' ),
			array( 'Tempo mit Substanz', 'Eigenes Studio, kurze Wege, eingespieltes Team: Wir liefern schnell, ohne dass Strategie und Qualität hinten runterfallen.' ),
			array( 'Verständnis für Vielfalt', 'Berlin ist mehrsprachig – wir auch. Wir verstehen Zielgruppen in Deutschland kulturell wie sprachlich und bauen Botschaften, die wirklich ankommen.' ),
		);
		?>
		<div class="nw-grid nw-grid--2">
			<?php foreach ( $nw_werte as $i => $wert ) : ?>
				<div class="nw-card nw-reveal">
					<span class="nw-num nw-gradient"><?php echo esc_html( str_pad( $i + 1, 2, '0', STR_PAD_LEFT ) ); ?></span>
					<h3 style="margin-top: 12px;"><?php echo esc_html( $wert[0] ); ?></h3>
					<p><?php echo esc_html( $wert[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nw-section">
	<div class="nw-container">
		<div class="nw-section-head nw-reveal">
			<p class="nw-eyebrow nw-eyebrow--sun">Made in Berlin</p>
			<h2>Berlin ist unser Zuhause – und unser Wettbewerbsvorteil</h2>
			<p class="nw-intro">Mit unserem eigenen Content-Studio in Berlin produzieren wir dort, wo deine Zielgruppe lebt: schnell, flexibel und nah dran an Trends, die anderswo erst Monate später ankommen. Von hier aus betreuen wir Unternehmen in ganz Deutschland – vom lokalen Restaurant bis zur E-Commerce-Marke.</p>
			<p style="margin-top: 36px;"><a class="nw-btn nw-btn--warm" href="<?php echo esc_url( home_url( '/studio/' ) ); ?>">Studio entdecken</a></p>
		</div>
	</div>
</section>

<?php
nw_final_cta(
	'Klingt nach dem richtigen Team?',
	'Dann lass uns reden. Im Erstgespräch lernst du uns kennen, wir dein Unternehmen – und du bekommst eine ehrliche Einschätzung, was für dich funktioniert.'
);
get_footer();
