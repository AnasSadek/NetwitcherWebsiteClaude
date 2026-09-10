<?php
/**
 * Helpers for the page templates (templates/page-*.php). Blocks that occur
 * on more than one page of the Next.js app but have no shared React
 * component there (service sections, FAQ) plus components/arrowTargets.ts.
 */

defined('ABSPATH') || exit;

/** components/arrowTargets.ts – click targets of the five logo arms. */
function nw_arrow_targets(): array
{
    return [
        ['color' => 'mint', 'label' => 'Webdesign & E-Commerce', 'href' => '/leistungen/webdesign-ecommerce'],
        ['color' => 'violet', 'label' => 'Strategie & Digital Marketing', 'href' => '/leistungen/performance-marketing'],
        ['color' => 'pink', 'label' => 'Content Creation', 'href' => '/studio'],
        ['color' => 'sun', 'label' => 'Studio & Fotografie', 'href' => '/leistungen/foto-videoproduktion'],
        ['color' => 'sky', 'label' => 'Social Media & Ads', 'href' => '/leistungen/social-media-management'],
    ];
}

/**
 * "Inhalts-Sektionen" grid (app/leistungen/[slug]/page.tsx, app/studio/page.tsx).
 * $accent = key from NW_ARROW_COLORS or CSS colour.
 */
function nw_service_sections(array $sections, string $accent, string $sectionClass = 'py-20'): string
{
    $o = '<section class="' . esc_attr($sectionClass) . '"><div class="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3">';
    foreach ($sections as $i => $sec) {
        $o .= nw_reveal_open('', $i * 0.1);
        $o .= '<div class="h-full rounded border border-line bg-white p-8 backdrop-blur">';
        $o .= nw_arrow($accent, 24, $i * 72, 'mb-5');
        $o .= '<h2 class="font-heading text-lg font-bold leading-snug">' . esc_html($sec['heading']) . '</h2>';
        $o .= '<p class="mt-3.5 text-sm leading-relaxed text-ink-3">' . esc_html($sec['body']) . '</p>';
        $o .= '</div>' . nw_reveal_close();
    }
    return $o . '</div></section>';
}

/** FAQ section "Gut zu wissen" (native <details>, like the Next.js source). */
function nw_faq_section(array $faq, string $sectionClass = 'py-20 md:py-28'): string
{
    $o = '<section class="' . esc_attr($sectionClass) . '"><div class="mx-auto max-w-3xl px-4 sm:px-6">';
    $o .= nw_section_heading(['title' => 'Gut zu wissen']);
    $o .= '<div class="mt-10 space-y-4">';
    foreach ($faq as $f) {
        $o .= nw_reveal_open();
        $o .= '<details class="group rounded border border-line bg-white px-6 py-5 backdrop-blur">';
        $o .= '<summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-bold">' . esc_html($f['q']);
        $o .= '<span aria-hidden="true" class="text-ink-3 transition-transform duration-200 group-open:rotate-45">＋</span></summary>';
        $o .= '<p class="mt-4 text-sm leading-relaxed text-ink-3">' . esc_html($f['a']) . '</p>';
        $o .= '</details>' . nw_reveal_close();
    }
    return $o . '</div></div></section>';
}
