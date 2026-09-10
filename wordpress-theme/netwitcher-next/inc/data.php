<?php
/**
 * Content data. The JSON files are generated from the Next.js source
 * (lib/*.ts) by tools/export-data.ts so both implementations share one
 * source of truth during the experiment. In a real migration these would
 * live in post meta / options; the portfolio already does (see inc/cpt.php).
 */

defined('ABSPATH') || exit;

function nw_data(string $name): array
{
    static $cache = [];
    if (!isset($cache[$name])) {
        $file = NW_THEME_DIR . '/data/' . $name . '.json';
        $cache[$name] = file_exists($file) ? (json_decode(file_get_contents($file), true) ?: []) : [];
    }
    return $cache[$name];
}

function nw_site(): array
{
    return nw_data('site');
}

/** All services (incl. "studio"), as in lib/services.ts */
function nw_services(): array
{
    return nw_data('services');
}

/** Services shown under /leistungen (everything but "studio"). */
function nw_leistungen_services(): array
{
    return array_values(array_filter(nw_services(), fn($s) => $s['slug'] !== 'studio'));
}

function nw_service(string $slug): ?array
{
    foreach (nw_services() as $s) {
        if ($s['slug'] === $slug) return $s;
    }
    return null;
}

function nw_cases(): array
{
    return nw_data('cases');
}

function nw_media(string $key): array
{
    return nw_data('media')[$key];
}

function nw_headturn_manifest(): array
{
    return nw_data('headturn.manifest');
}

function nw_whatsapp_href(?string $text = null): string
{
    $s = nw_site();
    return 'https://wa.me/' . $s['whatsappNumber'] . ($text ? '?text=' . rawurlencode($text) : '');
}

/** Brand colours in the order of the logo arms (components/arrows.tsx). */
const NW_ARROW_COLORS = [
    'mint' => '#2EE6C8',
    'violet' => '#8B5CF6',
    'pink' => '#F468A8',
    'sun' => '#F5D33D',
    'sky' => '#0FB9F2',
];
const NW_STAR_ORDER = ['mint', 'violet', 'pink', 'sun', 'sky'];
const NW_ARROW_PATH = 'M50 14 L74 38 A9 9 0 0 1 76.5 44 L79 66 A7 7 0 0 1 68 72.5 L52 56 A3 3 0 0 0 48 56 L32 72.5 A7 7 0 0 1 21 66 L23.5 44 A9 9 0 0 1 26 38 Z';
