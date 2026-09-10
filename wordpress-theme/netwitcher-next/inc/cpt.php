<?php
/**
 * Portfolio: real WordPress content. Each project is a `portfolio` post;
 * the structured data from lib/portfolio.ts (client, year, media, sections,
 * links…) lives in post meta `_nw_project` (JSON), the category in the
 * `portfolio_category` taxonomy. Templates read it via nw_project_data().
 */

defined('ABSPATH') || exit;

add_action('init', function () {
    register_post_type('portfolio', [
        'labels' => ['name' => 'Portfolio', 'singular_name' => 'Projekt', 'add_new_item' => 'Projekt hinzufügen', 'edit_item' => 'Projekt bearbeiten'],
        'public' => true,
        'has_archive' => 'portfolio',
        'rewrite' => ['slug' => 'portfolio', 'with_front' => false],
        'menu_icon' => 'dashicons-portfolio',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'page-attributes'],
        'show_in_rest' => true,
    ]);
    register_taxonomy('portfolio_category', 'portfolio', [
        'labels' => ['name' => 'Kategorien', 'singular_name' => 'Kategorie'],
        'public' => true,
        'hierarchical' => false,
        'rewrite' => ['slug' => 'portfolio/kategorie', 'with_front' => false],
        'show_in_rest' => true,
    ]);
    register_post_meta('portfolio', '_nw_project', ['type' => 'string', 'single' => true, 'show_in_rest' => false]);
});

// Archive order = menu_order (the curated order from lib/portfolio.ts), all projects on one page.
add_action('pre_get_posts', function (WP_Query $q) {
    if (is_admin() || !$q->is_main_query()) return;
    if ($q->is_post_type_archive('portfolio') || $q->is_tax('portfolio_category')) {
        $q->set('orderby', 'menu_order');
        $q->set('order', 'ASC');
        $q->set('posts_per_page', -1);
    }
});

function nw_portfolio_categories(): array
{
    return nw_data('portfolio')['categories'];
}

function nw_portfolio_category(string $id): ?array
{
    foreach (nw_portfolio_categories() as $c) if ($c['id'] === $id) return $c;
    return null;
}

/** Full project record (same shape as PortfolioProject in lib/portfolio.ts). */
function nw_project_data(int $post_id): array
{
    static $cache = [];
    if (!isset($cache[$post_id])) {
        $json = get_post_meta($post_id, '_nw_project', true);
        $data = $json ? (json_decode($json, true) ?: []) : [];
        $data['slug'] = get_post_field('post_name', $post_id);
        $data['title'] = $data['title'] ?? get_the_title($post_id);
        $data['permalink'] = get_permalink($post_id);
        $cache[$post_id] = $data;
    }
    return $cache[$post_id];
}

/** All projects in curated order (archive + strips + adjacent navigation). */
function nw_projects(): array
{
    static $list = null;
    if ($list === null) {
        $posts = get_posts(['post_type' => 'portfolio', 'posts_per_page' => -1, 'orderby' => 'menu_order', 'order' => 'ASC', 'post_status' => 'publish']);
        $list = array_map(fn($p) => nw_project_data($p->ID), $posts);
    }
    return $list;
}

function nw_categories_in_use(): array
{
    $used = [];
    foreach (nw_projects() as $p) foreach ($p['categories'] ?? [] as $c) $used[$c] = true;
    return array_values(array_filter(nw_portfolio_categories(), fn($c) => isset($used[$c['id']])));
}

function nw_adjacent_projects(string $slug): array
{
    $list = nw_projects();
    $n = count($list);
    foreach ($list as $i => $p) {
        if ($p['slug'] === $slug) {
            return ['prev' => $list[($i - 1 + $n) % $n], 'next' => $list[($i + 1) % $n]];
        }
    }
    return ['prev' => null, 'next' => null];
}

/** "website" | "video" | "software" | "visual" – by media present, as in lib/portfolio.ts projectKind(). */
function nw_project_kind(array $p): string
{
    if (!empty($p['website'])) return 'website';
    if (!empty($p['videos'])) return 'video';
    if (!empty($p['screens'])) return 'software';
    return 'visual';
}

function nw_ratio_value(?string $r): string
{
    return str_replace('/', ' / ', $r ?: '16/10');
}
