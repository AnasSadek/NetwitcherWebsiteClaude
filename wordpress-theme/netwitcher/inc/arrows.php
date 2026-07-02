<?php
/**
 * Das Pfeil-/Stern-SVG-System des Netwitcher-Logos.
 *
 * Eine Pfeilform (abgerundeter Chevron), fünffach um je 72° rotiert = Logo-Stern.
 *
 * @package Netwitcher
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const NW_ARROW_PATH = 'M50 14 L74 38 A9 9 0 0 1 76.5 44 L79 66 A7 7 0 0 1 68 72.5 L52 56 A3 3 0 0 0 48 56 L32 72.5 A7 7 0 0 1 21 66 L23.5 44 A9 9 0 0 1 26 38 Z';

/**
 * Farbwerte der fünf Pfeile.
 */
function nw_arrow_colors() {
	return array(
		'mint'   => '#2EE6C8',
		'violet' => '#8B5CF6',
		'pink'   => '#F468A8',
		'sun'    => '#F5D33D',
		'sky'    => '#0FB9F2',
	);
}

/**
 * Reihenfolge im Stern (oben beginnend, im Uhrzeigersinn).
 */
function nw_star_order() {
	return array( 'mint', 'violet', 'pink', 'sun', 'sky' );
}

/**
 * Klick-Ziele der fünf Logo-Pfeile.
 */
function nw_arrow_targets() {
	return array(
		array( 'color' => 'mint', 'label' => 'Webdesign & E-Commerce', 'url' => home_url( '/leistungen/webdesign-ecommerce/' ) ),
		array( 'color' => 'violet', 'label' => 'Strategie & Digital Marketing', 'url' => home_url( '/leistungen/performance-marketing/' ) ),
		array( 'color' => 'pink', 'label' => 'Content Creation', 'url' => home_url( '/studio/' ) ),
		array( 'color' => 'sun', 'label' => 'Studio & Fotografie', 'url' => home_url( '/leistungen/foto-videoproduktion/' ) ),
		array( 'color' => 'sky', 'label' => 'Social Media & Ads', 'url' => home_url( '/leistungen/social-media-management/' ) ),
	);
}

/**
 * Einzelner Logo-Pfeil als Inline-SVG.
 *
 * @param string $color    Farbschlüssel (mint|violet|pink|sun|sky).
 * @param int    $size     Kantenlänge in px.
 * @param int    $rotation Rotation in Grad.
 * @param string $class    Zusätzliche CSS-Klassen.
 */
function nw_arrow_svg( $color = 'mint', $size = 48, $rotation = 0, $class = '' ) {
	$colors = nw_arrow_colors();
	$fill   = isset( $colors[ $color ] ) ? $colors[ $color ] : $colors['mint'];
	printf(
		'<svg width="%1$d" height="%1$d" viewBox="0 0 100 100" fill="none" aria-hidden="true"%2$s><path d="%3$s" fill="%4$s"%5$s/></svg>',
		(int) $size,
		$class ? ' class="' . esc_attr( $class ) . '"' : '',
		esc_attr( NW_ARROW_PATH ),
		esc_attr( $fill ),
		$rotation ? ' transform="rotate(' . (int) $rotation . ' 50 50)"' : ''
	);
}

/**
 * Der komplette Netwitcher-Stern als Inline-SVG.
 *
 * @param int    $size  Kantenlänge in px.
 * @param string $class Zusätzliche CSS-Klassen.
 */
function nw_star_svg( $size = 40, $class = '' ) {
	$colors = nw_arrow_colors();
	$out    = sprintf(
		'<svg width="%1$d" height="%1$d" viewBox="0 0 200 200" fill="none" aria-hidden="true"%2$s>',
		(int) $size,
		$class ? ' class="' . esc_attr( $class ) . '"' : ''
	);
	foreach ( nw_star_order() as $i => $key ) {
		$out .= sprintf(
			'<g transform="rotate(%d 100 100)"><g transform="translate(50 8)"><path d="%s" fill="%s"/></g></g>',
			$i * 72,
			esc_attr( NW_ARROW_PATH ),
			esc_attr( $colors[ $key ] )
		);
	}
	echo $out . '</svg>'; // phpcs:ignore WordPress.Security.EscapeOutput
}

/**
 * Service-Icon (Stroke-SVGs, erben currentColor).
 *
 * @param string $icon  Icon-Schlüssel.
 * @param string $class CSS-Klassen.
 */
function nw_service_icon( $icon, $class = '' ) {
	$paths = array(
		'camera'    => '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.2-1.8c.2-.3.5-.5.9-.5h3.6c.4 0 .7.2.9.5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"/><circle cx="12" cy="12.5" r="3.2"/>',
		'megaphone' => '<path d="M4 10v4a1 1 0 0 0 1 1h2l4 4h1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1L7 9H5a1 1 0 0 0-1 1Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
		'target'    => '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
		'monitor'   => '<rect x="3.5" y="4.5" width="17" height="12" rx="1.5"/><path d="M9.5 20h5M12 16.5V20"/>',
		'search'    => '<circle cx="10.5" cy="10.5" r="6"/><path d="m15.5 15.5 4.5 4.5"/>',
		'sparkles'  => '<path d="M12 4.5 13.6 9l4.4 1.5-4.4 1.5L12 16.5 10.4 12 6 10.5 10.4 9 12 4.5Z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"/>',
		'play'      => '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" stroke="none"/>',
		'code'      => '<path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.2 5.5l-2.4 13"/>',
		'wrench'    => '<path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7a1.8 1.8 0 1 0 2.5 2.5l5.3-5.2a4 4 0 0 0 5-5.3l-2.6 2.6-2.3-2.3 2.6-2.5Z"/>',
		'printer'   => '<path d="M7 8V4.5h10V8M7 16H4.5v-6h15v6H17"/><rect x="7" y="13.5" width="10" height="6" rx="1"/>',
	);
	if ( ! isset( $paths[ $icon ] ) ) {
		return;
	}
	printf(
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"%s>%s</svg>',
		$class ? ' class="' . esc_attr( $class ) . '"' : '',
		$paths[ $icon ] // phpcs:ignore WordPress.Security.EscapeOutput
	);
}

/**
 * Service-Karte rendern.
 *
 * @param array $service Service-Datensatz aus nw_services().
 */
function nw_service_card( $service ) {
	$colors = nw_arrow_colors();
	?>
	<article class="nw-card nw-card--<?php echo esc_attr( $service['color'] ); ?> nw-reveal">
		<a class="nw-card-link" href="<?php echo esc_url( $service['url'] ); ?>" aria-label="<?php echo esc_attr( $service['title'] ); ?>"></a>
		<span class="nw-card-icon nw-c-<?php echo esc_attr( $service['color'] ); ?>">
			<?php nw_service_icon( $service['icon'] ); ?>
		</span>
		<h3><?php echo esc_html( $service['title'] ); ?></h3>
		<p><?php echo esc_html( $service['teaser'] ); ?></p>
		<ul class="nw-taglist">
			<?php foreach ( array_slice( $service['bullets'], 0, 4 ) as $bullet ) : ?>
				<li><?php echo esc_html( $bullet ); ?></li>
			<?php endforeach; ?>
		</ul>
		<span class="nw-arrowlink nw-c-<?php echo esc_attr( $service['color'] ); ?>">
			<?php echo esc_html( $service['cta'] ); ?> <span class="nw-arrowlink-chev" aria-hidden="true">→</span>
		</span>
	</article>
	<?php
}
