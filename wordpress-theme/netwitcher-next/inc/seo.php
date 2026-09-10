<?php
/**
 * SEO: mirrors the Next.js metadata objects (title template, description,
 * Open Graph, robots, JSON-LD) without a plugin.
 */

defined('ABSPATH') || exit;

const NW_TITLE_DEFAULT = 'Netwitcher, Digital Agency & Content-Studio Berlin';
const NW_DESC_DEFAULT = 'Netwitcher ist deine Digital Agency und dein Content-Studio in Berlin: Produktfotografie, Reels, Videoproduktion, Social Media, Ads, Webdesign und SEO, Content, der Anfragen bringt.';

/** Per-route metadata; templates can override via nw_set_seo() before wp_head. */
function nw_seo(): array
{
    static $seo = null;
    if ($seo !== null) return $seo;
    $seo = ['title' => null, 'description' => NW_DESC_DEFAULT, 'og_image' => null, 'noindex' => false];

    if (is_front_page()) {
        $seo['title'] = 'Netwitcher, Digital Agency Berlin: Content, Ads, Web & Software';
        $seo['description'] = 'Netwitcher macht Magie aus deiner Marke: Foto & Video aus dem eigenen Studio Berlin, Social Media & Ads, Websites, Shops und Software. Magic in Every Click.';
    } elseif (is_page()) {
        $slug = get_post_field('post_name', get_queried_object_id());
        $map = [
            'leistungen' => ['Leistungen, Content, Marketing, Web & Design aus Berlin', 'Alle Leistungen von Netwitcher Berlin: Content Creation, Foto- & Videoproduktion, Social Media, Performance Marketing, Webdesign, SEO, Branding, Software, Support und Print.'],
            'ueber-uns' => ['Über uns. Das Team hinter Netwitcher', 'Netwitcher ist ein Berliner Studio für Content, Design, Technik und Marketing. Lerne das Team kennen, das Content als Verkaufswerkzeug denkt, nicht als Dekoration.'],
            'projekte' => ['Projekte & Case Studies, Content, Websites & Kampagnen', 'So arbeitet Netwitcher: Case Studies aus Food, Beauty, E-Commerce, Handwerk und B2B: Herausforderung, Lösung und Ergebnis pro Projekt. Aus Berlin, für ganz Deutschland.'],
            'kontakt' => ['Kontakt und Anfrage', 'Erzähl uns in drei kurzen Schritten, was ansteht: Content, Fotoshooting, Social Media, Ads, Website, SEO, Branding oder Software. Antwort innerhalb eines Werktags. Aus Berlin.'],
            'fekrahub' => ['FekraHub, unsere Plattform für Bildungseinrichtungen', 'FekraHub ist die von Netwitcher entwickelte Verwaltungsplattform für Schulen und Bildungseinrichtungen: Anmeldungen, Kurse, Kommunikation und Berichte an einem Ort.'],
            'impressum' => ['Impressum', 'Impressum der Netwitcher Digital Agency, Berlin.'],
            'datenschutz' => ['Datenschutzerklärung', 'Datenschutzerklärung der Netwitcher Digital Agency, Berlin.'],
            'agb' => ['AGB, Allgemeine Geschäftsbedingungen', 'Allgemeine Geschäftsbedingungen der Netwitcher Digital Agency, Berlin.'],
        ];
        if (isset($map[$slug])) {
            [$seo['title'], $seo['description']] = $map[$slug];
        } elseif ($svc = nw_service($slug)) {
            $seo['title'] = $svc['seo']['title'];
            $seo['description'] = $svc['seo']['description'];
        }
        if (in_array($slug, ['impressum', 'datenschutz', 'agb'], true)) $seo['noindex'] = true;
    } elseif (is_home()) {
        $seo['title'] = 'Blog, Praxiswissen zu Content, Foto & Marketing';
        $seo['description'] = 'Der Netwitcher-Blog: ehrliches Praxiswissen zu Content Creation, Produktfotografie, Social Media und Performance Marketing. Aus unserem Studio in Berlin.';
    } elseif (is_singular('post')) {
        $seo['title'] = get_the_title();
        $seo['description'] = get_post_meta(get_the_ID(), '_nw_seo_description', true) ?: get_the_excerpt();
    } elseif (is_post_type_archive('portfolio')) {
        $seo['title'] = 'Unsere Arbeiten';
        $seo['description'] = 'Ausgewählte Websites, Social-Media-Kampagnen, Videos, Designs, Software und digitale Erlebnisse von Netwitcher, Digital Agency & Content-Studio Berlin.';
    } elseif (is_singular('portfolio')) {
        $p = nw_project_data(get_the_ID());
        $seo['title'] = ($p['client'] ?? '') . ': ' . ($p['title'] ?? get_the_title());
        $seo['description'] = $p['description'] ?? ($p['summary'] ?? '');
    } elseif (is_404()) {
        $seo['title'] = 'Seite nicht gefunden';
        $seo['noindex'] = true;
    }
    return $seo;
}

add_filter('pre_get_document_title', function () {
    $t = nw_seo()['title'];
    return $t ? $t . ' | Netwitcher Berlin' : NW_TITLE_DEFAULT;
});

add_action('wp_head', function () {
    $seo = nw_seo();
    $site = nw_site();
    $title = $seo['title'] ? $seo['title'] . ' | Netwitcher Berlin' : NW_TITLE_DEFAULT;
    $url = home_url(add_query_arg([], $GLOBALS['wp']->request ? '/' . $GLOBALS['wp']->request . '/' : '/'));
    echo '<meta name="description" content="' . esc_attr($seo['description']) . '">' . "\n";
    echo '<meta name="robots" content="' . ($seo['noindex'] ? 'noindex, follow' : 'index, follow') . '">' . "\n";
    echo '<link rel="canonical" href="' . esc_url($url) . '">' . "\n";
    echo '<meta property="og:type" content="' . (is_singular('portfolio') ? 'article' : 'website') . '">' . "\n";
    echo '<meta property="og:locale" content="de_DE">' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr($site['name']) . '">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($seo['description']) . '">' . "\n";
    echo '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="theme-color" content="' . (nw_is_dark_stage() ? '#0b0620' : '#faf8ff') . '">' . "\n";
    echo '<link rel="icon" href="' . esc_url(nw_asset('brand/icon.svg')) . '" type="image/svg+xml">' . "\n";
}, 2);

/** JSON-LD like app/layout.tsx (printed at the top of <body>). */
function nw_json_ld(): string
{
    $s = nw_site();
    $ld = [
        '@context' => 'https://schema.org',
        '@type' => 'ProfessionalService',
        'name' => $s['name'],
        'slogan' => $s['slogan'],
        'description' => 'Digital Agency und Content-Studio in Berlin: Content Creation, Produktfotografie, Videoproduktion, Social Media Management, Performance Marketing, Webdesign, SEO, Branding, Softwareentwicklung und Printdesign.',
        'url' => $s['url'],
        'email' => $s['email'],
        'telephone' => $s['phone'],
        'address' => ['@type' => 'PostalAddress', 'addressLocality' => $s['city'], 'addressCountry' => 'DE'],
        'areaServed' => ['Berlin', 'Deutschland'],
        'sameAs' => [$s['instagram'], $s['linkedin'], $s['tiktok']],
        'knowsAbout' => ['Content Creation', 'Produktfotografie', 'Videoproduktion', 'Social Media Marketing', 'Performance Marketing', 'Webdesign', 'SEO', 'Branding'],
    ];
    return '<script type="application/ld+json">' . wp_json_encode($ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';
}
