<?php
/**
 * Startseite: 10 Conversion-Sektionen.
 *
 * @package Netwitcher
 */

get_header();
$nw_colors = nw_arrow_colors();
?>

<!-- 1 · HERO -->
<section class="nw-hero">
	<div class="nw-hero-bg" aria-hidden="true">
		<?php if ( nw_get_option( 'hero_video' ) ) : ?>
			<video autoplay muted loop playsinline preload="metadata" src="<?php echo esc_url( nw_get_option( 'hero_video' ) ); ?>"></video>
		<?php endif; ?>
	</div>
	<div class="nw-container nw-hero-inner">
		<div>
			<p class="nw-eyebrow nw-reveal">Digital Agency &amp; Content-Studio · Berlin</p>
			<h1 class="nw-reveal">Content, der <span class="nw-gradient-warm">auffällt</span>.<br>Marketing, das <span class="nw-gradient">verkauft</span>.</h1>
			<p class="nw-hero-sub nw-reveal">Netwitcher ist deine Digital Agency und dein Content-Studio in Berlin. Wir produzieren Fotos, Reels, Videos, Kampagnen und Webseiten, die nicht nur gut aussehen – sondern aus Aufmerksamkeit echte Anfragen machen.</p>
			<div class="nw-btn-row nw-reveal">
				<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Kostenloses Erstgespräch buchen</a>
				<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/leistungen/' ) ); ?>">Unsere Leistungen ansehen</a>
				<a class="nw-btn nw-btn--warm" href="<?php echo esc_url( home_url( '/studio/' ) ); ?>">Studio in Berlin entdecken</a>
			</div>
			<ul class="nw-chips nw-reveal" aria-label="Unsere Kernbereiche">
				<li>Content Creation</li><li>Produktfotografie</li><li>Reels &amp; Video</li><li>Social Media Ads</li><li>Webdesign</li><li>SEO</li><li>Berlin Studio</li>
			</ul>
		</div>

		<div class="nw-hero-arrows" role="navigation" aria-label="Service-Kategorien über die Logo-Pfeile">
			<?php
			foreach ( nw_arrow_targets() as $i => $target ) :
				$angle = ( $i * 72 - 90 ) * M_PI / 180;
				$left  = 50 + cos( $angle ) * 34;
				$top   = 50 + sin( $angle ) * 34;
				$size  = 88 - ( $i % 2 ) * 10;
				?>
				<div class="nw-arrow-item" style="left: <?php echo esc_attr( round( $left, 1 ) ); ?>%; top: <?php echo esc_attr( round( $top, 1 ) ); ?>%; --dur: <?php echo esc_attr( 6 + $i * 0.8 ); ?>s; --glow: <?php echo esc_attr( $nw_colors[ $target['color'] ] ); ?>55; --glow-strong: <?php echo esc_attr( $nw_colors[ $target['color'] ] ); ?>;">
					<a href="<?php echo esc_url( $target['url'] ); ?>" aria-label="<?php echo esc_attr( $target['label'] ); ?> entdecken">
						<?php nw_arrow_svg( $target['color'], $size, $i * 72 ); ?>
						<span class="nw-arrow-tip"><?php echo esc_html( $target['label'] ); ?> →</span>
					</a>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- 2 · PROBLEM / HOOK -->
<section class="nw-section">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Warum die meisten Posts nichts bringen',
				'title'   => 'Guter Content ist kein Zufall. <span class="nw-gradient">Er ist ein System.</span>',
				'intro'   => 'Viele Unternehmen posten regelmäßig – aber ohne Strategie, ohne starke Bilder und ohne klare Botschaft. Das Ergebnis: wenig Reichweite, schwache Anfragen und Werbung, die Budget verbrennt. Wir verbinden Strategie, Produktion und Performance, damit dein Content sichtbar wird und deine Kampagnen besser funktionieren.',
			)
		);
		$hook_cards = array(
			array( 'mint', 'Sichtbarkeit', 'Content, der sofort auffällt – mit Hooks, starken Bildern und Formaten, die der Algorithmus belohnt.' ),
			array( 'violet', 'Vertrauen', 'Fotos und Videos, die professionell wirken – und deine Marke in der Preisklasse zeigen, in die sie gehört.' ),
			array( 'pink', 'Anfragen', 'Kampagnen, die auf Conversion optimiert sind – mit sauberem Tracking und klaren nächsten Schritten.' ),
		);
		?>
		<div class="nw-grid nw-grid--3">
			<?php foreach ( $hook_cards as $card ) : ?>
				<div class="nw-card nw-reveal">
					<?php nw_arrow_svg( $card[0], 28 ); ?>
					<h3 style="margin-top: 20px;"><?php echo esc_html( $card[1] ); ?></h3>
					<p><?php echo esc_html( $card[2] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- 3 · STUDIO BERLIN -->
<section class="nw-section nw-section--alt nw-aurora">
	<div class="nw-container">
		<div class="nw-split">
			<div class="nw-figure nw-reveal">
				<img src="<?php echo esc_url( nw_get_option( 'img_studio' ) ); ?>" alt="Content-Studio in Berlin: Produktfotografie-Setup mit Softboxen, Kamera und Neon-Akzentlicht in Lila und Cyan" loading="lazy" width="1024" height="576">
				<span class="nw-badge" style="color: var(--nw-sun);">✦ Neu in Berlin</span>
			</div>
			<div>
				<?php
				nw_section_head(
					array(
						'align'         => 'left',
						'eyebrow'       => 'Produktfotografie · Reels · Werbevideos',
						'eyebrow_class' => 'nw-eyebrow--pink',
						'title'         => 'Unser neues <span class="nw-gradient-warm">Content-Studio</span> in Berlin',
						'intro'         => 'In unserem Studio in Berlin produzieren wir professionelle Produktfotos, Social-Media-Reels, Werbevideos, UGC-Content, Kampagnenmaterial und Markenbilder – schnell, hochwertig und passend zu deiner Zielgruppe.',
					)
				);
				$studio_blocks = array( 'Produktfotografie', 'Food & Beverage Shoots', 'Beauty & Kosmetik Content', 'E-Commerce Produktbilder', 'Reels für Instagram & TikTok', 'Werbevideos für Ads', 'Behind-the-Scenes Content', 'Content für Webseiten & Landingpages' );
				$color_keys    = nw_star_order();
				?>
				<ul class="nw-checklist nw-checklist--2 nw-reveal">
					<?php foreach ( $studio_blocks as $i => $block ) : ?>
						<li><?php nw_arrow_svg( $color_keys[ $i % 5 ], 13, 90 ); ?><?php echo esc_html( $block ); ?></li>
					<?php endforeach; ?>
				</ul>
				<div class="nw-btn-row nw-reveal">
					<a class="nw-btn nw-btn--warm" href="<?php echo esc_url( home_url( '/kontakt/?service=Fotoshooting' ) ); ?>">Studio-Shooting anfragen</a>
					<a class="nw-arrowlink" style="padding: 14px 0;" href="<?php echo esc_url( home_url( '/studio/' ) ); ?>">Mehr über das Studio <span class="nw-arrowlink-chev" aria-hidden="true">→</span></a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 4 · LEISTUNGEN -->
<section class="nw-section">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Alles für dein Wachstum – aus einer Hand',
				'title'   => 'Unsere <span class="nw-gradient">Leistungen</span>',
				'intro'   => 'Von der ersten Aufnahme bis zur skalierten Kampagne: Zehn Bereiche, ein Team, ein Ziel – mehr Anfragen für dein Unternehmen.',
			)
		);
		?>
		<div class="nw-grid nw-grid--3">
			<?php foreach ( nw_services() as $service ) : ?>
				<?php nw_service_card( $service ); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- 5 · WARUM NETWITCHER -->
<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Was uns anders macht',
				'title'   => 'Warum Netwitcher?',
				'intro'   => 'Wir denken Content nicht als Dekoration, sondern als Verkaufswerkzeug. Jede Aufnahme, jedes Reel, jede Anzeige und jede Landingpage hat ein klares Ziel: Aufmerksamkeit gewinnen, Vertrauen aufbauen und Anfragen erzeugen.',
			)
		);
		$why_cards = array(
			array( 'Strategie vor Produktion', 'Kein Shooting ohne Konzept: Erst Zielgruppe und Ziel, dann Kamera. So hat jedes Asset einen Job.' ),
			array( 'Eigenes Studio in Berlin', 'Kurze Wege, schnelle Produktionen, konstante Qualität – ohne Mietstudio-Aufschlag und Terminchaos.' ),
			array( 'Content + Ads aus einer Hand', 'Die Creatives kommen aus demselben Team, das die Kampagnen steuert. Learnings fließen direkt zurück in die Produktion.' ),
			array( 'Mehrsprachiges Zielgruppen-Verständnis', 'Wir sprechen die Sprachen deiner Kunden in Deutschland – kulturell wie sprachlich. Das macht Botschaften präziser.' ),
			array( 'Schnelle Umsetzung', 'Vom Erstgespräch zur ersten Produktion in Tagen statt Monaten – mit klaren Timelines und festen Ansprechpartnern.' ),
			array( 'Design, Technik & Marketing in einem Team', 'Website, Content und Kampagnen greifen ineinander, weil sie am selben Tisch entstehen – ohne Reibungsverluste zwischen drei Dienstleistern.' ),
		);
		?>
		<div class="nw-grid nw-grid--3">
			<?php foreach ( $why_cards as $i => $card ) : ?>
				<div class="nw-card nw-reveal">
					<span class="nw-num nw-gradient"><?php echo esc_html( str_pad( $i + 1, 2, '0', STR_PAD_LEFT ) ); ?></span>
					<h3 style="margin-top: 12px; font-size: 16px;"><?php echo esc_html( $card[0] ); ?></h3>
					<p><?php echo esc_html( $card[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- 6 · INTERAKTIVE PFEILE / STERN-ASSEMBLY -->
<section class="nw-section" style="overflow: hidden;">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Magic in Every Click',
				'title'   => 'Fünf Pfeile. <span class="nw-gradient">Ein Ziel: dein Wachstum.</span>',
				'intro'   => 'Die fünf Pfeile unseres Logos stehen für die fünf Wege, auf denen wir Marken nach vorn bringen. Scroll, sieh zu, wie sie sich zum Stern verbinden – und klick den Bereich an, der dich weiterbringt.',
			)
		);
		?>
		<div class="nw-assembly" id="nw-assembly">
			<div class="nw-assembly-glow" aria-hidden="true"></div>
			<?php foreach ( nw_arrow_targets() as $i => $target ) : ?>
				<div class="nw-assembly-arrow">
					<a href="<?php echo esc_url( $target['url'] ); ?>" aria-label="<?php echo esc_attr( $target['label'] ); ?> entdecken">
						<?php nw_arrow_svg( $target['color'], 92 ); ?>
					</a>
				</div>
			<?php endforeach; ?>
		</div>
		<ul class="nw-assembly-legend">
			<?php foreach ( nw_arrow_targets() as $target ) : ?>
				<li>
					<a href="<?php echo esc_url( $target['url'] ); ?>">
						<?php nw_arrow_svg( $target['color'], 14 ); ?>
						<?php echo esc_html( $target['label'] ); ?> <span aria-hidden="true">→</span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<!-- 7 · PROZESS -->
<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Klar, schnell, transparent',
				'title'   => 'So läuft die Zusammenarbeit',
				'intro'   => 'Fünf Schritte von der ersten Idee bis zur laufenden Optimierung – du weißt in jeder Phase, was passiert und warum.',
			)
		);
		$steps = array(
			array( 'Erstgespräch', 'Wir verstehen dein Unternehmen, deine Zielgruppe und dein Ziel – kostenlos und ohne Verpflichtung.' ),
			array( 'Strategie', 'Wir entwickeln eine klare Content- und Marketingrichtung: Botschaften, Formate, Kanäle, Prioritäten.' ),
			array( 'Produktion', 'Wir produzieren Fotos, Videos, Reels, Designs und Landingpages – im Studio Berlin oder bei dir vor Ort.' ),
			array( 'Kampagnen', 'Wir bringen den Content live: über Social Media, Ads, SEO oder deine Website – messbar eingerichtet.' ),
			array( 'Optimierung', 'Wir analysieren Ergebnisse, verstärken, was funktioniert, und verbessern kontinuierlich weiter.' ),
		);
		$order = nw_star_order();
		?>
		<ol class="nw-process">
			<?php foreach ( $steps as $i => $step ) : ?>
				<li class="nw-reveal">
					<span class="nw-process-icon"><?php nw_arrow_svg( $order[ $i ], 22, $i * 72 ); ?></span>
					<div>
						<h3><?php echo esc_html( $step[0] ); ?></h3>
						<p><?php echo esc_html( $step[1] ); ?></p>
					</div>
				</li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>

<!-- 8 · PROJEKTE / CASES -->
<section class="nw-section">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Branchen, die wir bewegen',
				'title'   => 'Projekte & <span class="nw-gradient">Case Studies</span>',
				'intro'   => 'Von Food-Content bis B2B-Website: So gehen wir Herausforderungen an. Konkrete Kennzahlen ergänzen wir nach Freigabe unserer Kunden.',
			)
		);
		?>
		<div class="nw-grid nw-grid--3">
			<?php foreach ( nw_cases() as $case ) : ?>
				<?php nw_case_card( $case ); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- 9 · PAKETE -->
<section class="nw-section nw-section--alt">
	<div class="nw-container">
		<?php
		nw_section_head(
			array(
				'eyebrow' => 'Planbarer Content, planbares Wachstum',
				'title'   => 'Content-Pakete für <span class="nw-gradient">jede Wachstumsphase</span>',
				'intro'   => nw_packages_note(),
			)
		);
		?>
		<div class="nw-grid nw-grid--4">
			<?php foreach ( nw_packages() as $pkg ) : ?>
				<?php nw_package_card( $pkg ); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<!-- 10 · FINAL CTA -->
<?php
nw_final_cta();
get_footer();
