<?php
/**
 * Netwitcher Theme – Setup & Hooks
 *
 * @package Netwitcher
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NW_VERSION', '1.0.0' );

require_once get_template_directory() . '/inc/arrows.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/services-data.php';
require_once get_template_directory() . '/inc/cases-data.php';
require_once get_template_directory() . '/inc/packages-data.php';
require_once get_template_directory() . '/inc/setup-content.php';

/**
 * Theme-Setup.
 */
function nw_setup() {
	load_theme_textdomain( 'netwitcher', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );

	register_nav_menus(
		array(
			'primary' => __( 'Hauptmenü', 'netwitcher' ),
		)
	);
}
add_action( 'after_setup_theme', 'nw_setup' );

/**
 * Styles & Scripts.
 */
function nw_enqueue() {
	wp_enqueue_style( 'netwitcher-style', get_stylesheet_uri(), array(), NW_VERSION );
	wp_enqueue_script( 'netwitcher-main', get_template_directory_uri() . '/assets/js/main.js', array(), NW_VERSION, true );
	wp_localize_script(
		'netwitcher-main',
		'nwConfig',
		array(
			'email' => nw_get_option( 'email' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'nw_enqueue' );

/**
 * Kontakt-/Firmendaten (Customizer mit Defaults).
 */
function nw_get_option( $key ) {
	$defaults = array(
		'email'        => 'info@netwitcher.de',
		'phone'        => '+49 30 12345678',
		'whatsapp'     => '4915112345678',
		'city'         => 'Berlin',
		'street'       => 'Musterstraße 1',
		'zip'          => '10115',
		'calendly'     => 'https://calendly.com/netwitcher/erstgespraech',
		'instagram'    => 'https://www.instagram.com/netwitcher',
		'linkedin'     => 'https://www.linkedin.com/company/netwitcher',
		'tiktok'       => 'https://www.tiktok.com/@netwitcher',
		'hero_video'   => 'https://d8j0ntlcm91z4.cloudfront.net/user_39Y11T2lLRMNMkZy9mFemYRLqw0/hf_20260702_143035_8d3c0321-25df-46e0-80bb-89c17170bc74.mp4',
		'img_studio'   => 'https://d8j0ntlcm91z4.cloudfront.net/user_39Y11T2lLRMNMkZy9mFemYRLqw0/hf_20260702_143041_fc61ab0b-a727-4540-8fe4-4c0708d2046e.png',
		'img_product'  => 'https://d8j0ntlcm91z4.cloudfront.net/user_39Y11T2lLRMNMkZy9mFemYRLqw0/hf_20260702_143046_0077f601-7b8a-445a-a699-96106b7a45b3.png',
		'img_reels'    => 'https://d8j0ntlcm91z4.cloudfront.net/user_39Y11T2lLRMNMkZy9mFemYRLqw0/hf_20260702_143052_4d7c7849-a2d7-4aaa-97cd-9adaa21ee7af.png',
	);
	$value = get_theme_mod( 'nw_' . $key, '' );
	return $value ? $value : ( isset( $defaults[ $key ] ) ? $defaults[ $key ] : '' );
}

/**
 * WhatsApp-Link mit vorbefülltem Text.
 */
function nw_whatsapp_href( $text = '' ) {
	if ( '' === $text ) {
		$text = 'Hallo Netwitcher! Ich interessiere mich für Content & Marketing und hätte gern ein kostenloses Erstgespräch.';
	}
	return 'https://wa.me/' . rawurlencode( nw_get_option( 'whatsapp' ) ) . '?text=' . rawurlencode( $text );
}

/**
 * Telefon-Link.
 */
function nw_phone_href() {
	return 'tel:' . preg_replace( '/[^0-9+]/', '', nw_get_option( 'phone' ) );
}

/**
 * Meta-Description + JSON-LD im <head>.
 */
function nw_head_meta() {
	$desc = get_bloginfo( 'description' );

	if ( is_front_page() ) {
		$desc = 'Content, der auffällt. Marketing, das verkauft. Netwitcher produziert Produktfotos, Reels, Videos, Kampagnen und Webseiten in Berlin – aus Aufmerksamkeit werden echte Anfragen.';
	} elseif ( is_singular() ) {
		$service = nw_get_service( get_post_field( 'post_name' ) );
		if ( $service ) {
			$desc = $service['seo_description'];
		} elseif ( has_excerpt() ) {
			$desc = wp_strip_all_tags( get_the_excerpt() );
		}
	}

	if ( $desc ) {
		echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
	}

	$jsonld = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'ProfessionalService',
		'name'        => 'Netwitcher',
		'slogan'      => 'Magic in Every Click',
		'description' => 'Digital Agency und Content-Studio in Berlin: Content Creation, Produktfotografie, Videoproduktion, Social Media Management, Performance Marketing, Webdesign, SEO, Branding, Softwareentwicklung und Printdesign.',
		'url'         => home_url( '/' ),
		'email'       => nw_get_option( 'email' ),
		'telephone'   => nw_get_option( 'phone' ),
		'address'     => array(
			'@type'           => 'PostalAddress',
			'addressLocality' => nw_get_option( 'city' ),
			'addressCountry'  => 'DE',
		),
		'areaServed'  => array( 'Berlin', 'Deutschland' ),
		'sameAs'      => array_values( array_filter( array( nw_get_option( 'instagram' ), nw_get_option( 'linkedin' ), nw_get_option( 'tiktok' ) ) ) ),
	);
	echo '<script type="application/ld+json">' . wp_json_encode( $jsonld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'nw_head_meta', 5 );

/**
 * Fallback-Navigation, falls (noch) kein Menü zugewiesen ist.
 */
function nw_nav_fallback() {
	$items = array(
		home_url( '/' )            => 'Startseite',
		home_url( '/leistungen/' ) => 'Leistungen',
		home_url( '/studio/' )     => 'Studio',
		home_url( '/projekte/' )   => 'Projekte',
		home_url( '/ueber-uns/' )  => 'Über uns',
		home_url( '/blog/' )       => 'Blog',
		home_url( '/kontakt/' )    => 'Kontakt',
	);
	echo '<ul>';
	foreach ( $items as $url => $label ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $url ), esc_html( $label ) );
	}
	echo '</ul>';
}

/**
 * Wiederverwendbare Sektion: Final CTA.
 */
function nw_final_cta( $title = '', $text = '' ) {
	if ( '' === $title ) {
		$title = 'Bereit für Content, der verkauft?';
	}
	if ( '' === $text ) {
		$text = 'Erzähl uns kurz, was du vorhast – wir zeigen dir, welche Inhalte, Kampagnen und digitalen Schritte für dein Wachstum am meisten Sinn machen. Kostenlos, ehrlich und ohne Agentur-Sprech.';
	}
	?>
	<section class="nw-finalcta">
		<div class="nw-container nw-reveal">
			<?php nw_star_svg( 64, 'nw-float' ); ?>
			<h2><?php echo esc_html( $title ); ?></h2>
			<p><?php echo esc_html( $text ); ?></p>
			<div class="nw-btn-row">
				<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/#termin' ) ); ?>">Kostenloses Erstgespräch buchen</a>
				<a class="nw-btn nw-btn--whatsapp" href="<?php echo esc_url( nw_whatsapp_href() ); ?>" target="_blank" rel="noopener noreferrer">WhatsApp schreiben</a>
				<a class="nw-btn nw-btn--secondary" href="<?php echo esc_url( home_url( '/kontakt/?service=Fotoshooting' ) ); ?>">Studio-Shooting anfragen</a>
			</div>
		</div>
	</section>
	<?php
}

/**
 * Sektions-Kopf.
 */
function nw_section_head( $args = array() ) {
	$args = wp_parse_args(
		$args,
		array(
			'eyebrow'       => '',
			'eyebrow_class' => '',
			'title'         => '',
			'intro'         => '',
			'align'         => 'center',
			'tag'           => 'h2',
		)
	);
	$cls  = 'nw-section-head' . ( 'left' === $args['align'] ? ' nw-section-head--left' : '' );
	$tag  = in_array( $args['tag'], array( 'h1', 'h2' ), true ) ? $args['tag'] : 'h2';
	?>
	<div class="<?php echo esc_attr( $cls ); ?> nw-reveal">
		<?php if ( $args['eyebrow'] ) : ?>
			<p class="nw-eyebrow <?php echo esc_attr( $args['eyebrow_class'] ); ?>"><?php echo esc_html( $args['eyebrow'] ); ?></p>
		<?php endif; ?>
		<<?php echo $tag; // phpcs:ignore ?>><?php echo wp_kses_post( $args['title'] ); ?></<?php echo $tag; // phpcs:ignore ?>>
		<?php if ( $args['intro'] ) : ?>
			<p class="nw-intro"><?php echo esc_html( $args['intro'] ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}
