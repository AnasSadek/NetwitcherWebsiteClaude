<?php
/**
 * Lokale Vorschau-Harness (NICHT Teil des Themes – wird nicht mit ausgeliefert).
 * Stellt minimale WordPress-Stubs bereit, um die Templates ohne WP zu rendern:
 *   php -S localhost:8088 _preview.php   → /?tpl=front|leistungen|service|studio|kontakt|...
 */

error_reporting( E_ALL & ~E_DEPRECATED );

// Statische Assets direkt ausliefern.
$uri = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
if ( preg_match( '/\.(css|js|png|woff2|svg)$/', $uri ) && file_exists( __DIR__ . $uri ) ) {
	return false;
}

define( 'ABSPATH', __DIR__ . '/' );
define( 'OBJECT', 'OBJECT' );

$GLOBALS['nw_slug'] = isset( $_GET['slug'] ) ? $_GET['slug'] : 'performance-marketing';

function get_template_directory() { return __DIR__; }
function get_template_directory_uri() { return ''; }
function get_stylesheet_uri() { return '/style.css'; }
function home_url( $p = '' ) { return 'http://localhost:8088' . $p; }
function add_action( ...$a ) {}
function add_theme_support( ...$a ) {}
function register_nav_menus( ...$a ) {}
function load_theme_textdomain( ...$a ) {}
function __( $s, $d = '' ) { return $s; }
function wp_enqueue_style( ...$a ) {}
function wp_enqueue_script( ...$a ) {}
function wp_localize_script( ...$a ) {}
function get_theme_mod( $k, $d = '' ) { return $d; }
function set_theme_mod( ...$a ) {}
function esc_url( $u ) { return htmlspecialchars( $u, ENT_QUOTES ); }
function esc_url_raw( $u ) { return $u; }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
function wp_json_encode( $d, $f = 0 ) { return json_encode( $d, $f ); }
function wp_parse_args( $args, $defaults ) { return array_merge( $defaults, $args ); }
function wp_kses_post( $s ) { return $s; }
function language_attributes() { echo 'lang="de-DE"'; }
function bloginfo( $k ) { echo 'charset' === $k ? 'UTF-8' : 'Netwitcher'; }
function get_bloginfo( $k ) { return ''; }
function body_class() { echo 'class="preview"'; }
function wp_body_open() {}
function wp_head() {
	echo '<title>Netwitcher Preview</title><link rel="stylesheet" href="/style.css">';
	nw_head_meta();
}
function wp_footer() { echo '<script src="/assets/js/main.js"></script>'; }
function get_post_field( $f, $id = 0 ) { return $GLOBALS['nw_slug']; }
function wp_nav_menu( $args ) { call_user_func( $args['fallback_cb'] ); }
function get_header() { require __DIR__ . '/header.php'; }
function get_footer() { require __DIR__ . '/footer.php'; }
function is_front_page() { return 'front' === ( $_GET['tpl'] ?? 'front' ); }
function is_singular() { return false; }
function is_home() { return true; }
function has_excerpt() { return false; }
function get_the_excerpt() { return ''; }
function have_posts() { return false; }
function sanitize_text_field( $s ) { return $s; }

$tpl = $_GET['tpl'] ?? 'front';
require __DIR__ . '/functions.php';

$map = array(
	'front'      => 'front-page.php',
	'leistungen' => 'page-templates/template-leistungen.php',
	'service'    => 'page-templates/template-service.php',
	'studio'     => 'page-templates/template-studio.php',
	'projekte'   => 'page-templates/template-projekte.php',
	'ueber-uns'  => 'page-templates/template-ueber-uns.php',
	'fekrahub'   => 'page-templates/template-fekrahub.php',
	'kontakt'    => 'page-templates/template-kontakt.php',
	'404'        => '404.php',
);
require __DIR__ . '/' . ( $map[ $tpl ] ?? $map['front'] );
