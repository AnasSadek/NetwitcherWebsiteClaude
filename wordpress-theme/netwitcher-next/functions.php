<?php
/**
 * Netwitcher Next – experimental WordPress port of the Next.js site.
 *
 * Structure
 *  inc/data.php      JSON content exported from lib/*.ts (tools/export-data.ts)
 *  inc/helpers.php   brand SVGs, buttons, reveal, media helpers (= React components)
 *  inc/assets.php    CSS/JS enqueue (Tailwind v4 build, ES-module bundles)
 *  inc/seo.php       titles, meta, Open Graph, JSON-LD
 *  inc/cpt.php       "portfolio" custom post type + taxonomy
 *  inc/portfolio-helpers.php  components/portfolio/* (BoxiTitle, SmartImage, frames, player, visual)
 *  inc/setup-content.php  one-time seeding on activation (pages, posts, projects)
 */

defined('ABSPATH') || exit;

define('NW_THEME_VERSION', '0.1.0');
define('NW_THEME_DIR', get_template_directory());
define('NW_THEME_URI', get_template_directory_uri());

require_once NW_THEME_DIR . '/inc/data.php';
require_once NW_THEME_DIR . '/inc/helpers.php';
require_once NW_THEME_DIR . '/inc/page-helpers.php';
require_once NW_THEME_DIR . '/inc/assets.php';
require_once NW_THEME_DIR . '/inc/seo.php';
require_once NW_THEME_DIR . '/inc/cpt.php';
require_once NW_THEME_DIR . '/inc/portfolio-helpers.php';
require_once NW_THEME_DIR . '/inc/setup-content.php';
require_once NW_THEME_DIR . '/inc/legal-helpers.php';

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('post-thumbnails');
    load_theme_textdomain('netwitcher-next', NW_THEME_DIR . '/languages');
    // No classic editor styles, no block patterns, no widgets: the theme is code-first.
    remove_theme_support('widgets-block-editor');
});

// Lean <head>: the Next.js site ships none of this.
add_action('init', function () {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'wp_resource_hints', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    add_filter('emoji_svg_url', '__return_false');
});

// Global block-library CSS is not needed: templates are hand-written.
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
}, 100);
add_filter('should_load_separate_core_block_assets', '__return_true');
add_filter('wp_lazy_loading_enabled', '__return_true');
