<?php
/**
 * Portfolio helpers: PHP ports of the presentational pieces in
 * components/portfolio/* (BoxiTitle, Placeholder, SmartImage, Frames,
 * VideoPlayer, ProjectVisual) plus the data helpers of lib/portfolio.ts
 * that the templates need (stripMedia, projectKind, the work-grid rhythm).
 * Markup and classes are identical to the TSX; behaviour lives in
 * src/js/portfolio.js.
 */

defined('ABSPATH') || exit;

/* ---------------- Data (lib/portfolio.ts) ---------------- */

/** projectKind(): decided by the media a project ships, exactly like the source. */
function nw_project_visual_kind(array $p): string
{
    if (!empty($p['website'])) return 'website';
    if (!empty($p['videos'])) return 'video';
    if (!empty($p['screens'])) return 'software';
    return 'visual';
}

function nw_category_label(string $id): string
{
    return nw_portfolio_category($id)['label'] ?? $id;
}

/** categoriesInUse() incl. counts (WorkIndex chips, ServiceSpectrum). */
function nw_categories_with_count(): array
{
    $projects = nw_projects();
    $out = [];
    foreach (nw_portfolio_categories() as $c) {
        $n = count(array_filter($projects, fn($p) => in_array($c['id'], $p['categories'] ?? [], true)));
        if ($n > 0) $out[] = $c + ['count' => $n];
    }
    return $out;
}

/** stripMedia(): cover + two more media per project for the film strip. */
function nw_strip_media(): array
{
    $items = [];
    foreach (nw_projects() as $p) {
        $base = ['slug' => $p['slug'], 'client' => $p['client'], 'color' => $p['color']];
        $items[] = $base + ['ratio' => $p['cover']['ratio'] ?? '16/10', 'src' => $p['cover']['src'] ?? null, 'alt' => $p['cover']['alt'], 'kind' => 'image'];
        $extra = [];
        foreach (array_slice($p['videos'] ?? [], 0, 1) as $v) {
            $extra[] = $base + ['ratio' => $v['ratio'] ?? '9/16', 'src' => $v['poster'] ?? null, 'alt' => $v['title'], 'kind' => 'video'];
        }
        if (!empty($p['website']['mobile'])) {
            $extra[] = $base + ['ratio' => '9/16', 'src' => $p['website']['mobile']['src'] ?? null, 'alt' => $p['website']['mobile']['alt'], 'kind' => 'image'];
        }
        $pool = array_merge($p['socialPosts'] ?? [], $p['images'] ?? [], $p['screens'] ?? []);
        foreach (array_slice($pool, 0, max(0, 2 - count($extra))) as $m) {
            $extra[] = $base + ['ratio' => $m['ratio'] ?? '4/5', 'src' => $m['src'] ?? null, 'alt' => $m['alt'], 'kind' => 'image'];
        }
        array_push($items, ...$extra);
    }
    return $items;
}

/** WorkIndex.tsx arrange(): spreads for featured projects, tiles in 7/5 · 5/7 · 4/4/4 rows. */
const NW_WORK_ROWS = [[7, 5], [5, 7], [4, 4, 4]];
const NW_WORK_SPAN_CLASS = [12 => 'md:col-span-12', 7 => 'md:col-span-7', 6 => 'md:col-span-6', 5 => 'md:col-span-5', 4 => 'md:col-span-4'];
const NW_WORK_RATIO_CLASS = [12 => 'aspect-[4/5] md:aspect-[21/9]', 7 => 'aspect-[4/5] md:aspect-[16/10]', 6 => 'aspect-[4/5] md:aspect-[4/3]', 5 => 'aspect-[4/5]', 4 => 'aspect-[4/5] md:aspect-square'];
const NW_WORK_SIZES = [
    12 => '(min-width: 1500px) 1400px, 100vw',
    7 => '(min-width: 1500px) 820px, (min-width: 768px) 58vw, 100vw',
    6 => '(min-width: 1500px) 700px, (min-width: 768px) 50vw, 100vw',
    5 => '(min-width: 1500px) 580px, (min-width: 768px) 42vw, 100vw',
    4 => '(min-width: 1500px) 460px, (min-width: 768px) 33vw, 100vw',
];

function nw_arrange_work(array $list, bool $spreads = true): array
{
    $out = [];
    $run = [];
    $row = 0;
    $spreadCount = 0;
    $flush = function () use (&$out, &$run, &$row) {
        while ($run) {
            $pattern = NW_WORK_ROWS[$row % count(NW_WORK_ROWS)];
            if (count($run) === 1) $pattern = [12];
            elseif (count($run) < count($pattern)) $pattern = [6, 6];
            foreach ($pattern as $span) {
                $p = array_shift($run);
                if ($p) $out[] = ['type' => 'tile', 'project' => $p, 'span' => $span];
            }
            $row++;
        }
    };
    foreach ($list as $p) {
        if ($spreads && !empty($p['featured'])) {
            $flush();
            $out[] = ['type' => 'spread', 'project' => $p, 'flip' => $spreadCount % 2 === 1];
            $spreadCount++;
        } else {
            $run[] = $p;
        }
    }
    $flush();
    return $out;
}

/** JS `client.charAt(0)` (WorkItems) – ProjectVisual additionally trims + upper-cases. */
function nw_char0(string $s): string
{
    return mb_substr($s, 0, 1);
}

/* ---------------- BoxiTitle ---------------- */

/** $a: as, lines (string | ['text'=>..,'sweep'=>bool]), max, min, id, class, style, fitLines */
function nw_boxi_title(array $a): string
{
    $tag = $a['as'] ?? 'h2';
    $lines = $a['lines'];
    $fitLines = !empty($a['fitLines']);
    $texts = array_map(fn($l) => is_array($l) ? $l['text'] : $l, $lines);
    $lens = [1];
    foreach ($texts as $t) {
        if ($fitLines) $lens[] = mb_strlen($t);
        else foreach (preg_split('/\s+/u', $t) as $w) $lens[] = mb_strlen($w);
    }
    $fit = number_format(100 / (max($lens) * 0.86), 2, '.', ''); // CHAR_WIDTH 0.86 em per capital
    $style = 'font-size:clamp(' . ($a['min'] ?? '1.75rem') . ', ' . $fit . 'cqw, ' . ($a['max'] ?? '6rem') . ')' . (isset($a['style']) ? ';' . $a['style'] : '');
    $o = '<div class="@container w-full"><' . $tag . nw_attr(['id' => $a['id'] ?? null, 'lang' => 'de', 'class' => 'font-boxi leading-[0.94] hyphens-auto [overflow-wrap:anywhere] ' . ($a['class'] ?? ''), 'style' => $style]) . '>';
    foreach ($lines as $l) {
        $text = esc_html(is_array($l) ? $l['text'] : $l);
        $o .= '<span class="block">' . (is_array($l) && !empty($l['sweep']) ? '<span class="brand-sweep bg-clip-text text-transparent">' . $text . '</span>' : $text) . '</span>';
    }
    return $o . '</' . $tag . '></div>';
}

/* ---------------- Placeholder ---------------- */

/** $a: color, label (string | false | null), ratio, kind, monogram, class, attrs (extra attributes) */
function nw_placeholder(array $a = []): string
{
    $hex = NW_ARROW_COLORS[$a['color'] ?? 'violet'];
    $label = $a['label'] ?? null;
    $kind = $a['kind'] ?? 'image';
    $o = '<div' . nw_attr(($a['attrs'] ?? []) + [
        'aria-hidden' => 'true',
        'class' => trim('dot-grid relative h-full w-full overflow-hidden bg-void-3 ' . ($a['class'] ?? '')),
        'style' => 'background-color:#1b1140;background-image:radial-gradient(120% 90% at 20% 0%, ' . $hex . '2e, transparent 60%), radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px);background-size:auto, 22px 22px',
    ]) . '>';
    $o .= '<svg viewBox="0 0 100 100" class="absolute -right-[12%] -bottom-[14%] h-[70%] w-auto opacity-[0.12]" aria-hidden="true"><path d="' . NW_ARROW_PATH . '" fill="' . $hex . '" transform="rotate(-30 50 50)"/></svg>';
    if (!empty($a['monogram'])) {
        $o .= '<span class="absolute left-4 top-4 font-boxi text-[clamp(1.25rem,4cqw,2.5rem)] leading-none text-white/25 sm:left-5 sm:top-5">' . esc_html($a['monogram']) . '</span>';
    }
    if ($label !== false) {
        $o .= '<span class="absolute bottom-4 left-4 flex items-center gap-2 font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 sm:bottom-5 sm:left-5"><span class="h-1.5 w-1.5 rounded-full" style="background-color:' . $hex . '"></span>';
        $o .= esc_html($label ?? ($kind === 'video' ? 'Video folgt' : 'Bild folgt'));
        if (!empty($a['ratio'])) $o .= '<span class="text-white/30">· ' . esc_html($a['ratio']) . '</span>';
        $o .= '</span>';
    }
    return $o . '</div>';
}

/* ---------------- SmartImage ---------------- */

/** Intrinsic size of a local media file (next/image knows it at build time). */
function nw_image_size(string $src): ?array
{
    static $cache = [];
    if (!array_key_exists($src, $cache)) {
        $file = NW_THEME_DIR . '/assets/' . ltrim($src, '/');
        $s = is_file($file) ? @getimagesize($file) : false;
        $cache[$src] = $s ? [$s[0], $s[1]] : null;
    }
    return $cache[$src];
}

/** $o: ratio, ratioClass, sizes, priority, monogram, label, class, imgClass, rounded, attrs */
function nw_smart_image(array $image, string $color, array $o = []): string
{
    $r = $o['ratio'] ?? $image['ratio'] ?? '16/10';
    $ratioClass = $o['ratioClass'] ?? null;
    $priority = !empty($o['priority']);
    $out = '<div' . nw_attr(($o['attrs'] ?? []) + [
        'class' => trim('relative w-full overflow-hidden bg-void-2 ' . ($o['rounded'] ?? 'rounded-2xl') . ' ' . ($ratioClass ?? '') . ' ' . ($o['class'] ?? '')),
        'style' => $ratioClass ? null : 'aspect-ratio:' . nw_ratio_value($r),
        'data-work-ratio' => $ratioClass ? true : null,
    ]) . '>';
    if (!empty($image['src'])) {
        $src = $image['src'];
        $attrs = ['alt' => $image['alt'] ?? '', 'loading' => $priority ? 'eager' : 'lazy', 'decoding' => 'async', 'class' => trim('absolute inset-0 h-full w-full object-cover ' . ($o['imgClass'] ?? ''))];
        if (str_starts_with($src, 'http')) {
            $out .= '<img' . nw_attr(['src' => $src] + $attrs) . '>';
        } else {
            $size = nw_image_size($src);
            $out .= '<img' . nw_attr(['src' => nw_media_url($src), 'width' => $size[0] ?? null, 'height' => $size[1] ?? null, 'sizes' => $o['sizes'] ?? '100vw', 'fetchpriority' => $priority ? 'high' : null, 'style' => 'color:transparent', 'data-work-img' => $ratioClass ? true : null] + $attrs) . '>';
        }
    } else {
        $out .= nw_placeholder(['color' => $color, 'ratio' => str_replace('/', ':', $r), 'monogram' => $o['monogram'] ?? null, 'label' => $o['label'] ?? null]);
    }
    return $out . '</div>';
}

/* ---------------- Frames ---------------- */

/** BrowserFrame. $o: url, sizes, priority, monogram, class */
function nw_browser_frame(array $image, string $color, array $o = []): string
{
    $url = $o['url'] ?? '';
    $host = $url ? preg_replace('#/$#', '', preg_replace('#^https?://#', '', $url)) : '';
    $out = '<div class="overflow-hidden rounded-2xl border border-white/10 bg-void-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] md:rounded-3xl ' . esc_attr($o['class'] ?? '') . '">';
    $out .= '<div class="flex items-center gap-3 border-b border-white/10 px-4 py-2.5"><span class="flex gap-1.5" aria-hidden="true"><i class="block h-2.5 w-2.5 rounded-full bg-white/15"></i><i class="block h-2.5 w-2.5 rounded-full bg-white/15"></i><i class="block h-2.5 w-2.5 rounded-full bg-white/15"></i></span>';
    $out .= '<span class="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md bg-white/[0.06] font-heading text-[10px] font-semibold tracking-wide text-white/45">' . ($host ? esc_html($host) : ' ') . '</span></div>';
    $out .= '<div class="scroll-preview">' . nw_smart_image($image, $color, ['sizes' => $o['sizes'] ?? null, 'priority' => $o['priority'] ?? false, 'monogram' => $o['monogram'] ?? null, 'label' => 'Desktop-Screenshot folgt', 'rounded' => 'rounded-none']) . '</div>';
    return $out . '</div>';
}

/** PhoneFrame. $o: sizes, monogram, class, label */
function nw_phone_frame(array $image, string $color, array $o = []): string
{
    return '<div class="relative rounded-[2rem] border border-white/15 bg-void-3 p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] md:rounded-[2.4rem] md:p-2 ' . esc_attr($o['class'] ?? '') . '">'
        . '<span aria-hidden="true" class="absolute left-1/2 top-3 z-10 h-1.5 w-1/4 -translate-x-1/2 rounded-full bg-black/60 md:top-4"></span>'
        . nw_smart_image($image, $color, ['ratio' => '9/16', 'sizes' => $o['sizes'] ?? null, 'monogram' => $o['monogram'] ?? null, 'label' => $o['label'] ?? 'Mobile-Screenshot folgt', 'rounded' => 'rounded-[1.6rem] md:rounded-[1.9rem]'])
        . '</div>';
}

/* ---------------- VideoPlayer (thumbnail state; src/js/portfolio.js swaps in the media) ---------------- */

/** $o: sizes, monogram, class, rounded */
function nw_video_player(array $video, string $color, array $o = []): string
{
    $ratio = $video['ratio'] ?? '9/16';
    $src = $video['src'] ?? '';
    $has = $src !== '';
    $hex = NW_ARROW_COLORS[$color];
    $resolved = $has && in_array($video['source'] ?? 'local', ['local', 'url'], true) ? nw_media_url($src) : $src;
    $thumb = ['data-video-thumb' => true]; // hidden by portfolio.js while the media element plays
    $out = '<div' . nw_attr([
        'class' => trim('group relative w-full overflow-hidden bg-black ' . ($o['rounded'] ?? 'rounded-2xl') . ' ' . ($o['class'] ?? '')),
        'style' => 'aspect-ratio:' . nw_ratio_value($ratio),
        'data-video' => true,
        'data-video-source' => $video['source'] ?? 'local',
        'data-video-src' => $has ? $resolved : null,
        'data-video-poster' => !empty($video['poster']) ? nw_media_url($video['poster']) : null,
        'data-video-title' => $video['title'],
    ]) . '>';
    if (!empty($video['poster'])) {
        $out .= nw_smart_image(['src' => $video['poster'], 'alt' => $video['title'], 'ratio' => $ratio], $color, ['sizes' => $o['sizes'] ?? '(min-width: 768px) 30vw, 70vw', 'rounded' => 'rounded-none', 'class' => 'absolute inset-0 h-full', 'imgClass' => 'transition-transform duration-700 ease-out group-hover:scale-[1.03]', 'attrs' => $thumb]);
    } else {
        $out .= nw_placeholder(['color' => $color, 'kind' => 'video', 'ratio' => str_replace('/', ':', $ratio), 'monogram' => $o['monogram'] ?? null, 'attrs' => $thumb]);
    }
    $out .= '<div data-video-thumb aria-hidden="true" class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>';
    $out .= '<button' . nw_attr(['type' => 'button', 'data-video-thumb' => true, 'data-video-play' => true, 'disabled' => !$has, 'aria-label' => $has ? $video['title'] . ' abspielen' : $video['title'] . ', Video folgt', 'class' => 'absolute inset-0 flex items-end justify-between p-4 text-left disabled:cursor-default']) . '>';
    $out .= '<span class="min-w-0"><span class="block truncate font-heading text-sm font-bold text-white">' . esc_html($video['title']) . '</span>';
    if (!empty($video['duration'])) $out .= '<span class="mt-0.5 block text-xs text-white/60">' . esc_html($video['duration']) . '</span>';
    $out .= '</span><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform duration-300 ' . ($has ? 'group-hover:scale-110' : 'opacity-50') . '" style="box-shadow:0 0 0 6px ' . $hex . '33"><svg width="14" height="14" viewBox="0 0 100 100" aria-hidden="true" class="ml-0.5"><path d="' . NW_ARROW_PATH . '" fill="currentColor" transform="rotate(90 50 50)"/></svg></span></button>';
    return $out . '</div>';
}

/* ---------------- ProjectVisual ---------------- */

function nw_project_visual(array $p, bool $priority = false, string $sizes = '(min-width: 1024px) 60vw, 100vw'): string
{
    $kind = nw_project_visual_kind($p);
    $m = mb_strtoupper(mb_substr(trim($p['client']), 0, 1));
    $color = $p['color'];

    if ($kind === 'website' && !empty($p['website'])) {
        $w = $p['website'];
        return '<div class="relative pr-[14%] pb-[8%] sm:pr-[18%]">'
            . nw_browser_frame($w['desktop'] ?? $p['cover'], $color, ['url' => $w['url'] ?? null, 'sizes' => $sizes, 'priority' => $priority, 'monogram' => $m])
            . '<div class="absolute bottom-0 right-0 w-[30%] max-w-[210px] sm:w-[27%]">'
            . nw_phone_frame($w['mobile'] ?? ['alt' => $p['client'] . ', mobile Ansicht'], $color, ['sizes' => '(min-width: 1024px) 14vw, 30vw', 'monogram' => $m])
            . '</div></div>';
    }

    if ($kind === 'video' && !empty($p['videos'])) {
        $reels = array_slice(array_values(array_filter($p['videos'], fn($v) => ($v['ratio'] ?? '9/16') === '9/16')), 0, 3);
        $items = $reels ?: array_slice($p['videos'], 0, 3);
        $o = '<div class="flex items-end justify-center gap-3 px-2 sm:gap-5">';
        foreach ($items as $i => $v) {
            $center = count($items) === 3 ? $i === 1 : $i === 0;
            $pos = $center ? 'z-10 scale-[1.06] md:w-[36%]' : ($i === 0 ? '-rotate-3 translate-y-4' : 'rotate-3 translate-y-4');
            $o .= '<div class="relative w-[38%] max-w-[240px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] transition-transform duration-500 md:rounded-3xl ' . $pos . '" style="aspect-ratio:9 / 16">';
            $o .= !empty($v['poster'])
                ? nw_smart_image(['src' => $v['poster'], 'alt' => $v['title'], 'ratio' => '9/16'], $color, ['ratio' => '9/16', 'sizes' => '(min-width: 1024px) 18vw, 38vw', 'priority' => $priority && $center, 'rounded' => 'rounded-none'])
                : nw_placeholder(['color' => $color, 'kind' => 'video', 'ratio' => '9:16', 'monogram' => $center ? $m : null]);
            $o .= '<span class="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">' . esc_html($v['title']) . '</span></div>';
        }
        return $o . '</div>';
    }

    if ($kind === 'software' && !empty($p['screens'])) {
        [$main, $second] = [$p['screens'][0], $p['screens'][1] ?? null];
        $o = '<div class="relative pb-[10%] pr-[10%]"><div class="overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] md:rounded-3xl">'
            . nw_smart_image($main, $color, ['ratio' => '16/10', 'sizes' => $sizes, 'priority' => $priority, 'monogram' => $m, 'label' => $main['caption'] ?? 'Screenshot folgt', 'rounded' => 'rounded-none']) . '</div>';
        if ($second) {
            $phone = ($second['ratio'] ?? '') === '9/16';
            $o .= '<div class="absolute bottom-0 right-0 w-[46%] overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] md:rounded-2xl">'
                . nw_smart_image($second, $color, ['ratio' => $phone ? '9/16' : '16/10', 'sizes' => '(min-width: 1024px) 28vw, 46vw', 'label' => $second['caption'] ?? 'Screenshot folgt', 'rounded' => 'rounded-none', 'class' => $phone ? 'max-h-[70%]' : ''])
                . '</div>';
        }
        return $o . '</div>';
    }

    $companion = $p['images'][0] ?? $p['posters'][0] ?? $p['socialPosts'][0] ?? null;
    $o = '<div class="relative pb-[8%] pr-[12%]">'
        . nw_smart_image($p['cover'], $color, ['sizes' => $sizes, 'priority' => $priority, 'monogram' => $m, 'rounded' => 'rounded-2xl md:rounded-3xl', 'class' => 'shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]']);
    if ($companion) {
        $o .= nw_smart_image($companion, $color, ['ratio' => '4/5', 'sizes' => '(min-width: 1024px) 18vw, 36vw', 'rounded' => 'rounded-xl md:rounded-2xl', 'class' => 'absolute bottom-0 right-0 w-[34%] border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]']);
    }
    return $o . '</div>';
}

/* ---------------- Head extras (app/portfolio/layout.tsx + opengraph) ---------------- */

// og:image only when the project ships a real cover (generated OG images are out of scope).
add_action('wp_head', function () {
    if (!is_singular('portfolio')) return;
    $p = nw_project_data(get_the_ID());
    if (!empty($p['cover']['src'])) {
        echo '<meta property="og:image" content="' . esc_url(nw_media_url($p['cover']['src'])) . '">' . "\n";
    }
}, 3);
