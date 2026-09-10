<?php
/**
 * Assets. One Tailwind CSS file (built by tools/build.mjs from src/app.css)
 * and small per-page ES-module bundles (src/js → assets/js, esbuild).
 * Fonts are self-hosted and preloaded like next/font does.
 */

defined('ABSPATH') || exit;

function nw_asset_ver(string $rel): string
{
    $f = NW_THEME_DIR . '/assets/' . $rel;
    return file_exists($f) ? (string) filemtime($f) : NW_THEME_VERSION;
}

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('nw-app', nw_asset('css/app.css'), [], nw_asset_ver('css/app.css'));

    wp_enqueue_script_module('nw-site', nw_asset('js/site.js'), [], nw_asset_ver('js/site.js'));
    if (is_front_page()) {
        wp_enqueue_script_module('nw-hero', nw_asset('js/hero.js'), [], nw_asset_ver('js/hero.js'));
    }
    if (nw_is_dark_stage()) {
        wp_enqueue_script_module('nw-portfolio', nw_asset('js/portfolio.js'), [], nw_asset_ver('js/portfolio.js'));
    }
    if (is_page('kontakt')) {
        wp_enqueue_script_module('nw-inquiry', nw_asset('js/inquiry.js'), [], nw_asset_ver('js/inquiry.js'));
    }
}, 20);

// Preload fonts + LCP hero poster (Next.js: next/font + fetchPriority="high").
add_action('wp_head', function () {
    $fonts = ['epboxi-display', 'oxanium', 'nunito-sans'];
    foreach ($fonts as $f) {
        echo '<link rel="preload" href="' . esc_url(nw_asset("fonts/$f.woff2")) . '" as="font" type="font/woff2" crossorigin>' . "\n";
    }
    if (is_front_page()) {
        echo '<link rel="preload" as="image" href="' . esc_url(nw_asset('mascot/witch-wide.avif')) . '" media="(min-width: 1024px)" fetchpriority="high">' . "\n";
        echo '<link rel="preload" as="image" href="' . esc_url(nw_asset('mascot/witch-portrait.avif')) . '" media="(max-width: 1023px)" fetchpriority="high">' . "\n";
    }
}, 1);

// Module scripts get "modulepreload" hints instead of blocking the parser.
add_filter('style_loader_tag', function ($tag, $handle) {
    return $tag;
}, 10, 2);
