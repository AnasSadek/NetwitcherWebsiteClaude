<?php
/**
 * One-time content seeding on theme activation: pages with their templates,
 * blog posts, portfolio projects, permalinks and front-page settings. Safe to
 * re-run (skips what exists). Also available as WP-CLI: `wp nw seed`.
 */

defined('ABSPATH') || exit;

function nw_seed_page(string $slug, string $title, string $template = '', int $parent = 0, string $content = ''): int
{
    $existing = get_page_by_path(($parent ? get_post_field('post_name', $parent) . '/' : '') . $slug, OBJECT, 'page');
    if ($existing) {
        if ($template) update_post_meta($existing->ID, '_wp_page_template', $template);
        return $existing->ID;
    }
    $id = wp_insert_post([
        'post_type' => 'page', 'post_status' => 'publish', 'post_name' => $slug, 'post_title' => $title,
        'post_parent' => $parent, 'post_content' => $content, 'comment_status' => 'closed', 'ping_status' => 'closed',
    ]);
    if ($template && $id) update_post_meta($id, '_wp_page_template', $template);
    return (int) $id;
}

function nw_seed_content(): void
{
    // Pages
    $home = nw_seed_page('startseite', 'Startseite');
    $leist = nw_seed_page('leistungen', 'Leistungen', 'templates/page-leistungen.php');
    foreach (nw_leistungen_services() as $s) {
        nw_seed_page($s['slug'], $s['title'], 'templates/page-service.php', $leist);
    }
    nw_seed_page('studio', 'Content Creation & Studio Berlin', 'templates/page-studio.php');
    nw_seed_page('ueber-uns', 'Über uns', 'templates/page-ueber-uns.php');
    $prod = nw_seed_page('produkte', 'Produkte', 'templates/page-redirect-fekrahub.php');
    nw_seed_page('fekrahub', 'FekraHub', 'templates/page-fekrahub.php', $prod);
    $blog = nw_seed_page('blog', 'Blog');
    nw_seed_page('projekte', 'Projekte & Case Studies', 'templates/page-projekte.php');
    nw_seed_page('kontakt', 'Kontakt', 'templates/page-kontakt.php');
    nw_seed_page('impressum', 'Impressum', 'templates/page-impressum.php');
    nw_seed_page('datenschutz', 'Datenschutzerklärung', 'templates/page-datenschutz.php');
    nw_seed_page('agb', 'AGB', 'templates/page-agb.php');

    update_option('show_on_front', 'page');
    update_option('page_on_front', $home);
    update_option('page_for_posts', $blog);
    update_option('blogname', 'Netwitcher');
    update_option('blogdescription', 'Digital Agency & Content-Studio in Berlin');
    update_option('timezone_string', 'Europe/Berlin');
    update_option('date_format', 'j. F Y');
    update_option('permalink_structure', '/blog/%postname%/');
    update_option('blog_public', 1);

    // Blog posts (content stored as HTML so the editor can take over)
    foreach (nw_data('blog') as $post) {
        if (get_posts(['name' => $post['slug'], 'post_type' => 'post', 'post_status' => 'any', 'posts_per_page' => 1])) continue;
        $html = '';
        foreach ($post['content'] as $block) {
            if (!empty($block['heading'])) $html .= '<h2>' . esc_html($block['heading']) . '</h2>' . "\n";
            foreach ($block['paragraphs'] as $p) $html .= '<p>' . esc_html($p) . '</p>' . "\n";
        }
        $term = term_exists($post['category'], 'category') ?: wp_insert_term($post['category'], 'category');
        $cat = (int) (is_array($term) ? $term['term_id'] : $term);
        $id = wp_insert_post([
            'post_type' => 'post', 'post_status' => 'publish', 'post_name' => $post['slug'], 'post_title' => $post['title'],
            'post_excerpt' => $post['excerpt'], 'post_content' => $html, 'post_date' => $post['date'] . ' 09:00:00',
            'post_category' => [$cat], 'comment_status' => 'closed',
        ]);
        update_post_meta($id, '_nw_reading_time', $post['readingTime']);
        update_post_meta($id, '_nw_seo_description', $post['seoDescription']);
    }

    // Portfolio projects
    $pf = nw_data('portfolio');
    foreach ($pf['categories'] as $c) {
        if (!term_exists($c['id'], 'portfolio_category')) wp_insert_term($c['label'], 'portfolio_category', ['slug' => $c['id']]);
    }
    foreach ($pf['projects'] as $i => $p) {
        if (get_posts(['name' => $p['slug'], 'post_type' => 'portfolio', 'post_status' => 'any', 'posts_per_page' => 1])) continue;
        $id = wp_insert_post([
            'post_type' => 'portfolio', 'post_status' => 'publish', 'post_name' => $p['slug'], 'post_title' => $p['title'],
            'post_excerpt' => $p['summary'] ?? '', 'menu_order' => $i, 'post_date' => (preg_match('/(\d{4})/', (string) ($p['year'] ?? ''), $m) ? $m[1] : date('Y')) . '-06-01 09:00:00', 'comment_status' => 'closed',
        ]);
        update_post_meta($id, '_nw_project', wp_json_encode($p, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        wp_set_object_terms($id, $p['categories'], 'portfolio_category');
    }

    // Remove WordPress sample content so the site matches the Next.js routes 1:1.
    foreach ([['hello-world', 'post'], ['sample-page', 'page'], ['privacy-policy', 'page']] as [$slug, $type]) {
        foreach (get_posts(['name' => $slug, 'post_type' => $type, 'post_status' => 'any', 'posts_per_page' => 1]) as $old) wp_delete_post($old->ID, true);
    }

    flush_rewrite_rules();
}

add_action('after_switch_theme', function () {
    nw_seed_content();
    // Rewrite rules for the CPT are registered on init; flush again on the next request.
    update_option('nw_flush_rewrite', 1);
});
add_action('init', function () {
    if (get_option('nw_flush_rewrite')) {
        delete_option('nw_flush_rewrite');
        flush_rewrite_rules();
    }
}, 99);

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('nw seed', function () {
        nw_seed_content();
        WP_CLI::success('Netwitcher content seeded.');
    });
}
