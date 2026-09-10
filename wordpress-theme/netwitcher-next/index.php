<?php
/** Fallback template (never used by the seeded routes). */
get_header();
echo '<section class="pt-36 pb-24 md:pt-44"><div class="mx-auto max-w-3xl px-4 sm:px-6">';
if (have_posts()) {
    while (have_posts()) { the_post();
        echo '<article class="mb-12"><h1 class="text-3xl font-extrabold tracking-tight md:text-4xl"><a href="' . esc_url(get_permalink()) . '">' . esc_html(get_the_title()) . '</a></h1><div class="mt-6 text-ink-3">' . wp_kses_post(get_the_excerpt()) . '</div></article>';
    }
} else {
    echo '<h1 class="text-3xl font-extrabold">Nichts gefunden.</h1>';
}
echo '</div></section>';
get_footer();
