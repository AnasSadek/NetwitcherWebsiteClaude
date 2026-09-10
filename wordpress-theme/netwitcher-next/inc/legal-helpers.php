<?php
/**
 * Helpers for the legal pages and the blog templates.
 *  nw_legal_open()/nw_legal_close()  = components/LegalPage.tsx
 *  nw_post_date_de()/nw_post_meta()  = the Intl.DateTimeFormat("de-DE") + post
 *                                      fields used by app/blog/page.tsx and
 *                                      app/blog/[slug]/page.tsx
 */

defined('ABSPATH') || exit;

/* ---------------- LegalPage (components/LegalPage.tsx) ---------------- */

function nw_legal_open(string $title): string
{
    return '<section class="pt-36 pb-24 md:pt-44"><div class="mx-auto max-w-3xl px-4 sm:px-6">'
        . nw_reveal_open()
        . '<h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">' . esc_html($title) . '</h1>'
        . '<div class="legal mt-10 space-y-6 text-sm leading-relaxed text-ink-3 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">';
}

function nw_legal_close(): string
{
    return '</div>' . nw_reveal_close() . '</div></section>';
}

/* ---------------- Blog post meta (home.php / single.php) ---------------- */

/**
 * Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" })
 * → "10. Juni 2026", independent of the WordPress locale.
 */
function nw_post_date_de(?WP_Post $post = null): string
{
    static $months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    $ts = get_post_time('U', false, $post);
    return sprintf('%02d. %s %s', (int) date('j', $ts), $months[(int) date('n', $ts) - 1], date('Y', $ts));
}

/** The fields the Next.js BlogPost object carried: excerpt, date, readingTime, category, seoDescription. */
function nw_post_meta(?WP_Post $post = null): array
{
    $post = get_post($post);
    $cats = get_the_category($post->ID);
    return [
        'date' => get_post_time('Y-m-d', false, $post),
        'dateLabel' => nw_post_date_de($post),
        'readingTime' => (string) get_post_meta($post->ID, '_nw_reading_time', true),
        'category' => $cats ? $cats[0]->name : '',
        'seoDescription' => (string) (get_post_meta($post->ID, '_nw_seo_description', true) ?: get_the_excerpt($post)),
    ];
}
