<?php
/**
 * Case-study sections (components/portfolio/ProjectSections.tsx): Story,
 * Website, Video, Screens, Images, Social, Posters, Results, Testimonial,
 * Links – each renders only when the project has the data.
 * $args: project
 */
$p = $args['project'];
$color = $p['color'];
$hex = NW_ARROW_COLORS[$color];
$m = nw_char0($p['client']);
$kind = nw_project_visual_kind($p);

$wrapOpen = fn(?string $id = null) => '<section' . ($id ? ' aria-labelledby="' . $id . '"' : '') . ' class="py-14 md:py-20"><div class="mx-auto max-w-[1500px] px-5 sm:px-8">';
$wrapClose = '</div></section>';
$sectionTitle = function (string $id, string $title, ?string $kicker = null): string {
    $o = nw_reveal_open() . '<div class="mb-8 flex items-end justify-between gap-6 md:mb-10"><h2 id="' . $id . '" class="font-boxi text-2xl leading-none text-white md:text-4xl">' . esc_html($title) . '</h2>';
    if ($kicker) $o .= '<p class="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">' . esc_html($kicker) . '</p>';
    return $o . '</div>' . nw_reveal_close();
};
$masonry = function (array $items) use ($color, $m): string {
    $o = '<div class="columns-2 gap-4 md:columns-3 md:gap-6 [&>*]:mb-4 md:[&>*]:mb-6">';
    foreach ($items as $i => $img) {
        $o .= nw_reveal_open('break-inside-avoid', min($i * 0.05, 0.25)) . '<figure>' . nw_smart_image($img, $color, ['sizes' => '(min-width: 768px) 33vw, 50vw', 'monogram' => $m, 'rounded' => 'rounded-xl md:rounded-2xl']);
        if (!empty($img['caption'])) $o .= '<figcaption class="mt-2 text-xs text-white/45">' . esc_html($img['caption']) . '</figcaption>';
        $o .= '</figure>' . nw_reveal_close();
    }
    return $o . '</div>';
};
$linkCls = 'group inline-flex items-center gap-2.5 rounded-full border-2 border-white/15 px-6 py-3 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:border-white/50 hover:bg-white/5';
$linkArrow = '<svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform group-hover:translate-x-1"><path d="' . NW_ARROW_PATH . '" fill="' . $hex . '" transform="rotate(90 50 50)"/></svg>';

/* ---- Story ---- */
if (!empty($p['story'])) {
    echo $wrapOpen('story') . '<h2 id="story" class="sr-only">Über das Projekt</h2><div class="grid gap-10 md:grid-cols-12">';
    foreach ($p['story'] as $i => $s) {
        echo nw_reveal_open('md:col-span-6 lg:col-span-5 lg:odd:col-start-2', $i * 0.08);
        echo '<p class="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">' . str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) . ' · ' . esc_html($s['heading']) . '</p>';
        echo '<p class="mt-4 text-lg leading-relaxed text-white/80 md:text-xl">' . esc_html($s['body']) . '</p>';
        echo nw_reveal_close();
    }
    echo '</div>' . $wrapClose;
}

/* ---- Website ---- */
if ($kind === 'website' && !empty($p['website'])) {
    $w = $p['website'];
    $url = $w['url'] ?? null;
    echo $wrapOpen('website') . $sectionTitle('website', 'DIE WEBSITE.', $url ? preg_replace('#^https?://#', '', $url) : null);
    echo '<div class="grid gap-6 lg:grid-cols-12 lg:items-start">';
    echo nw_reveal_open('lg:col-span-9') . nw_browser_frame($w['desktop'] ?? $p['cover'], $color, ['url' => $url, 'sizes' => '(min-width: 1500px) 1100px, 100vw', 'monogram' => $m]) . nw_reveal_close();
    echo nw_reveal_open('mx-auto w-[56%] max-w-[260px] lg:col-span-3 lg:mt-12 lg:w-full lg:max-w-none', 0.1) . nw_phone_frame($w['mobile'] ?? ['alt' => $p['client'] . ', mobile Ansicht'], $color, ['sizes' => '(min-width: 1024px) 22vw, 56vw', 'monogram' => $m]) . nw_reveal_close();
    echo '</div>';
    if ($url) {
        echo nw_reveal_open() . '<div class="mt-8 flex justify-center"><a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer" class="' . $linkCls . '">Website besuchen' . $linkArrow . '</a></div>' . nw_reveal_close();
    }
    echo $wrapClose;
}

/* ---- Video ---- */
if (!empty($p['videos'])) {
    $videos = $p['videos'];
    $reels = array_values(array_filter($videos, fn($v) => ($v['ratio'] ?? '9/16') === '9/16' || ($v['ratio'] ?? '') === '4/5'));
    $wide = array_values(array_filter($videos, fn($v) => !in_array($v, $reels, true)));
    echo $wrapOpen('video') . $sectionTitle('video', $reels ? 'REELS & VIDEOS.' : 'VIDEO.', 'Tippen zum Abspielen');
    if ($reels) {
        echo '<div class="-mx-5 sm:-mx-8"><ul class="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 md:gap-6">';
        foreach ($reels as $v) echo '<li class="w-[72%] shrink-0 snap-center sm:w-[44%] md:w-[30%] lg:w-[22%] xl:w-[19%]">' . nw_video_player($v, $color, ['monogram' => $m, 'rounded' => 'rounded-2xl md:rounded-3xl']) . '</li>';
        echo '</ul></div>';
    }
    if ($wide) {
        echo '<div class="grid gap-6 ' . ($reels ? 'mt-10' : '') . ' ' . (count($wide) > 1 ? 'md:grid-cols-2' : '') . '">';
        foreach ($wide as $v) echo nw_reveal_open() . nw_video_player($v, $color, ['monogram' => $m, 'sizes' => '(min-width: 1500px) 1400px, 100vw', 'rounded' => 'rounded-2xl md:rounded-3xl']) . nw_reveal_close();
        echo '</div>';
    }
    echo $wrapClose;
}

/* ---- Screens (software) ---- */
if (!empty($p['screens'])) {
    $screens = $p['screens'];
    $wideS = array_values(array_filter($screens, fn($s) => ($s['ratio'] ?? '') !== '9/16'));
    $phones = array_values(array_filter($screens, fn($s) => ($s['ratio'] ?? '') === '9/16'));
    echo $wrapOpen('produkt') . $sectionTitle('produkt', 'DAS PRODUKT.', !empty($p['tech']) ? implode(' · ', $p['tech']) : null);
    echo '<div class="grid gap-6 md:grid-cols-12 md:gap-8">';
    foreach ($wideS as $i => $s) {
        echo nw_reveal_open($i === 0 ? 'md:col-span-12' : 'md:col-span-6', 0.05) . '<figure><div class="overflow-hidden rounded-2xl border border-white/10 md:rounded-3xl">';
        echo nw_smart_image($s, $color, ['ratio' => '16/10', 'sizes' => $i === 0 ? '(min-width: 1500px) 1400px, 100vw' : '(min-width: 768px) 50vw, 100vw', 'monogram' => $m, 'label' => !empty($s['caption']) ? $s['caption'] . ' · Screenshot folgt' : 'Screenshot folgt', 'rounded' => 'rounded-none']);
        echo '</div>';
        if (!empty($s['caption'])) echo '<figcaption class="mt-3 font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">' . esc_html($s['caption']) . '</figcaption>';
        echo '</figure>' . nw_reveal_close();
    }
    if ($phones) {
        echo '<div class="flex flex-wrap justify-center gap-6 md:col-span-12 md:gap-10">';
        foreach ($phones as $i => $s) {
            echo nw_reveal_open('w-[58%] max-w-[260px] sm:w-[40%] md:w-[24%]', $i * 0.08) . '<figure>' . nw_phone_frame($s, $color, ['sizes' => '(min-width: 768px) 24vw, 58vw', 'monogram' => $m, 'label' => !empty($s['caption']) ? $s['caption'] . ' · folgt' : 'Mobile-Screenshot folgt']);
            if (!empty($s['caption'])) echo '<figcaption class="mt-3 text-center font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">' . esc_html($s['caption']) . '</figcaption>';
            echo '</figure>' . nw_reveal_close();
        }
        echo '</div>';
    }
    echo '</div>' . $wrapClose;
}

/* ---- Images ---- */
if (!empty($p['images'])) {
    echo $wrapOpen('bilder') . $sectionTitle('bilder', 'BILDER.', count($p['images']) . ' Motive') . $masonry($p['images']) . $wrapClose;
}

/* ---- Social ---- */
if (!empty($p['socialPosts'])) {
    echo $wrapOpen('social') . $sectionTitle('social', 'SOCIAL MEDIA.', 'Feed-Auswahl') . '<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">';
    foreach ($p['socialPosts'] as $i => $img) {
        echo nw_reveal_open('', min($i * 0.05, 0.25), 'li') . nw_smart_image($img, $color, ['ratio' => $img['ratio'] ?? '4/5', 'sizes' => '(min-width: 1024px) 25vw, 50vw', 'monogram' => $m, 'rounded' => 'rounded-xl md:rounded-2xl', 'label' => 'Post folgt']) . nw_reveal_close('li');
    }
    echo '</ul>' . $wrapClose;
}

/* ---- Posters ---- */
if (!empty($p['posters'])) {
    echo $wrapOpen('print') . $sectionTitle('print', 'POSTER & PRINT.') . $masonry($p['posters']) . $wrapClose;
}

/* ---- Results ---- */
if (!empty($p['results'])) {
    echo $wrapOpen('ergebnisse') . $sectionTitle('ergebnisse', 'ERGEBNIS.') . '<dl class="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">';
    foreach ($p['results'] as $i => $r) {
        echo nw_reveal_open('bg-void-2 p-7 md:p-9', $i * 0.06) . '<dd class="font-boxi text-4xl leading-none md:text-5xl" style="color:' . $hex . '">' . esc_html($r['value']) . '</dd><dt class="mt-3 text-sm text-white/60">' . esc_html($r['label']) . '</dt>' . nw_reveal_close();
    }
    echo '</dl>' . $wrapClose;
}

/* ---- Testimonial ---- */
if (!empty($p['testimonial'])) {
    $t = $p['testimonial'];
    echo $wrapOpen('stimme') . nw_reveal_open() . '<figure class="mx-auto max-w-3xl text-center"><blockquote class="font-heading text-2xl font-bold leading-snug text-white md:text-3xl">„' . esc_html($t['quote']) . '"</blockquote>';
    echo '<figcaption class="mt-6 text-sm text-white/55"><span class="font-semibold text-white/80">' . esc_html($t['name']) . '</span>' . (!empty($t['role']) ? ' · ' . esc_html($t['role']) : '') . '</figcaption></figure>' . nw_reveal_close() . $wrapClose;
}

/* ---- Links ---- */
$links = array_merge(!empty($p['website']['url']) ? [['label' => 'Website besuchen', 'href' => $p['website']['url']]] : [], $p['links'] ?? []);
if ($links) {
    echo $wrapOpen() . nw_reveal_open() . '<ul class="flex flex-wrap justify-center gap-3">';
    foreach ($links as $l) {
        $ext = str_starts_with($l['href'], 'http');
        echo '<li><a href="' . esc_url($ext ? $l['href'] : nw_url($l['href'])) . '"' . ($ext ? ' target="_blank" rel="noopener noreferrer"' : '') . ' class="' . $linkCls . '">' . esc_html($l['label']) . ' ' . $linkArrow . '</a></li>';
    }
    echo '</ul>' . nw_reveal_close() . $wrapClose;
}
