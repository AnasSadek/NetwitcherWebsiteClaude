<?php
/**
 * Footer mit Leistungs-Links, Rechtlichem, Kontakt & WhatsApp-Float.
 *
 * @package Netwitcher
 */
?>
</main>

<footer class="nw-footer">
	<div class="nw-container">
		<div class="nw-footer-grid">
			<div>
				<a class="nw-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Netwitcher – Startseite">
					<?php nw_star_svg( 42 ); ?>
					<span>NETWITCHER</span>
				</a>
				<p class="nw-footer-slogan">Magic in Every Click</p>
				<p class="nw-footer-desc">Digital Agency &amp; Content-Studio in Berlin. Wir produzieren Content, der Aufmerksamkeit erzeugt – und Kampagnen, die Kunden bringen.</p>
			</div>

			<nav aria-label="Leistungen">
				<h2>Leistungen</h2>
				<ul>
					<li><a href="<?php echo esc_url( home_url( '/studio/' ) ); ?>" style="color: var(--nw-pink);">Content Creation &amp; Studio</a></li>
					<?php foreach ( array_slice( nw_leistungen_services(), 0, 6 ) as $service ) : ?>
						<li><a href="<?php echo esc_url( $service['url'] ); ?>"><?php echo esc_html( $service['nav_title'] ); ?></a></li>
					<?php endforeach; ?>
					<li><a href="<?php echo esc_url( home_url( '/leistungen/' ) ); ?>" style="color: var(--nw-snow);">Alle Leistungen →</a></li>
				</ul>
			</nav>

			<nav aria-label="Unternehmen">
				<h2>Netwitcher</h2>
				<ul>
					<li><a href="<?php echo esc_url( home_url( '/ueber-uns/' ) ); ?>">Über uns</a></li>
					<li><a href="<?php echo esc_url( home_url( '/projekte/' ) ); ?>">Projekte &amp; Cases</a></li>
					<li><a href="<?php echo esc_url( home_url( '/fekrahub/' ) ); ?>">Produkte / FekraHub</a></li>
					<li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a></li>
					<li><a href="<?php echo esc_url( home_url( '/kontakt/' ) ); ?>">Kontakt</a></li>
					<li><a href="<?php echo esc_url( home_url( '/impressum/' ) ); ?>">Impressum</a></li>
					<li><a href="<?php echo esc_url( home_url( '/datenschutz/' ) ); ?>">Datenschutzerklärung</a></li>
					<li><a href="<?php echo esc_url( home_url( '/agb/' ) ); ?>">AGB</a></li>
				</ul>
			</nav>

			<div>
				<h2>Kontakt</h2>
				<ul>
					<li><a href="mailto:<?php echo esc_attr( nw_get_option( 'email' ) ); ?>"><?php echo esc_html( nw_get_option( 'email' ) ); ?></a></li>
					<li><a href="<?php echo esc_url( nw_phone_href() ); ?>"><?php echo esc_html( nw_get_option( 'phone' ) ); ?></a></li>
					<li><a href="<?php echo esc_url( nw_whatsapp_href() ); ?>" target="_blank" rel="noopener noreferrer" style="color: var(--nw-whatsapp);">WhatsApp schreiben</a></li>
					<li><span style="font-size:14px;color:var(--nw-mist);"><?php echo esc_html( nw_get_option( 'city' ) ); ?>, Deutschland</span></li>
				</ul>
				<p style="margin-top:24px;">
					<a class="nw-btn nw-btn--warm" style="padding:10px 20px;font-size:12px;" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Termin buchen</a>
				</p>
			</div>
		</div>

		<div class="nw-footer-bottom">
			<p>© <?php echo esc_html( gmdate( 'Y' ) ); ?> Netwitcher Digital Agency · Berlin</p>
			<p class="nw-magic">Magic in Every Click ✦</p>
		</div>
	</div>
</footer>

<a class="nw-whatsapp-float" href="<?php echo esc_url( nw_whatsapp_href() ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Per WhatsApp schreiben">
	<svg width="28" height="28" viewBox="0 0 24 24" fill="#06060F" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.88-.12-.44-.14-.99-.32-1.7-.63-3-1.29-4.95-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.08 0-1.47.77-2.19 1.04-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.07 1.32 2.37 1.47.3.15.47.12.64-.07.17-.2.74-.86.93-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.42Z"/></svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
