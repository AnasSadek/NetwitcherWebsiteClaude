<?php
/**
 * Template Name: Kontakt
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
				'eyebrow' => 'Kontakt',
				'title'   => 'Lass uns über <span class="nw-gradient">dein Wachstum</span> reden',
				'intro'   => 'Erzähl uns kurz, was du vorhast – wir melden uns innerhalb eines Werktags mit einer ehrlichen Einschätzung. Kein Verkaufsdruck, keine Warteschleife.',
			)
		);
		?>
	</div>
</section>

<section class="nw-section" style="padding-top: 24px;">
	<div class="nw-container">
		<div class="nw-split" style="align-items: start;">
			<div class="nw-panel nw-reveal">
				<h2 style="font-size: 20px; margin-bottom: 28px;">Anfrage senden</h2>
				<form class="nw-form" id="nw-contact-form" aria-label="Kontaktformular">
					<div class="nw-form-row">
						<div>
							<label for="nw-name">Name <span class="req">*</span></label>
							<input id="nw-name" name="name" required autocomplete="name" placeholder="Dein Name">
						</div>
						<div>
							<label for="nw-company">Unternehmen</label>
							<input id="nw-company" name="company" autocomplete="organization" placeholder="Dein Unternehmen">
						</div>
						<div>
							<label for="nw-email">E-Mail <span class="req">*</span></label>
							<input id="nw-email" name="email" type="email" required autocomplete="email" placeholder="du@unternehmen.de">
						</div>
						<div>
							<label for="nw-phone">Telefon</label>
							<input id="nw-phone" name="phone" type="tel" autocomplete="tel" placeholder="+49 …">
						</div>
					</div>
					<div>
						<label for="nw-service">Welche Leistung interessiert dich?</label>
						<select id="nw-service" name="service">
							<option value="">Bitte auswählen …</option>
							<?php foreach ( array( 'Content Creation', 'Fotoshooting', 'Social Media', 'Ads', 'Website', 'SEO', 'Branding', 'Support', 'Software', 'Print' ) as $opt ) : ?>
								<option value="<?php echo esc_attr( $opt ); ?>"><?php echo esc_html( $opt ); ?></option>
							<?php endforeach; ?>
						</select>
					</div>
					<div>
						<label for="nw-message">Dein Vorhaben <span class="req">*</span></label>
						<textarea id="nw-message" name="message" required rows="5" placeholder="Erzähl uns kurz, was du vorhast – Ziel, Zielgruppe, Zeitrahmen. Zwei, drei Sätze reichen."></textarea>
					</div>
					<small>Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur Bearbeitung der Anfrage zu. Details in der <a href="<?php echo esc_url( home_url( '/datenschutz/' ) ); ?>">Datenschutzerklärung</a>.</small>
					<div><button class="nw-btn nw-btn--primary" type="submit">Anfrage senden</button></div>
					<p class="nw-form-status" id="nw-form-status" role="status" hidden>Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Alternativ erreichst du uns direkt per WhatsApp oder unter <?php echo esc_html( nw_get_option( 'email' ) ); ?>.</p>
				</form>
			</div>

			<div style="display: grid; gap: 24px;">
				<div class="nw-panel nw-reveal">
					<h2 style="font-size: 20px;">Direkt erreichen</h2>
					<ul class="nw-contactlist">
						<li>
							<a href="<?php echo esc_url( nw_whatsapp_href() ); ?>" target="_blank" rel="noopener noreferrer">
								<span class="nw-contact-ico" style="background: rgba(37,211,102,.15); color: var(--nw-whatsapp);" aria-hidden="true">✆</span>
								<span><strong>WhatsApp</strong><span>Schnellste Antwort – meist innerhalb weniger Stunden</span></span>
							</a>
						</li>
						<li>
							<a href="mailto:<?php echo esc_attr( nw_get_option( 'email' ) ); ?>">
								<span class="nw-contact-ico" style="background: rgba(139,92,246,.15); color: var(--nw-violet);" aria-hidden="true">✉</span>
								<span><strong>E-Mail</strong><span><?php echo esc_html( nw_get_option( 'email' ) ); ?></span></span>
							</a>
						</li>
						<li>
							<a href="<?php echo esc_url( nw_phone_href() ); ?>">
								<span class="nw-contact-ico" style="background: rgba(15,185,242,.15); color: var(--nw-sky);" aria-hidden="true">☎</span>
								<span><strong>Telefon</strong><span><?php echo esc_html( nw_get_option( 'phone' ) ); ?></span></span>
							</a>
						</li>
						<li>
							<span class="nw-contact-static">
								<span class="nw-contact-ico" style="background: rgba(245,211,61,.15); color: var(--nw-sun);" aria-hidden="true">✦</span>
								<span><strong>Studio</strong><span><?php echo esc_html( nw_get_option( 'city' ) ); ?>, Deutschland</span></span>
							</span>
						</li>
					</ul>
				</div>

				<div class="nw-panel nw-reveal" id="termin" style="scroll-margin-top: 112px;">
					<h2 style="font-size: 20px;">Kostenloses Erstgespräch buchen</h2>
					<p class="nw-muted" style="margin-top: 12px; font-size: 14px;">20–30 Minuten, in denen wir dein Vorhaben verstehen und dir eine ehrliche Einschätzung geben – per Video-Call oder Telefon. Wähl einfach einen Termin, der dir passt:</p>
					<p style="margin-top: 24px;">
						<a class="nw-btn nw-btn--primary" style="width: 100%;" href="<?php echo esc_url( nw_get_option( 'calendly' ) ); ?>" target="_blank" rel="noopener noreferrer">Termin über Calendly wählen →</a>
					</p>
					<p class="nw-muted" style="margin-top: 16px; font-size: 12px;">Kein Calendly? Schreib uns einfach per WhatsApp oder E-Mail zwei Wunschtermine – wir bestätigen den passenden.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<?php
get_footer();
