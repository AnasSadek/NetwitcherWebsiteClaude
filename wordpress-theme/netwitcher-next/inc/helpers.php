<?php
/**
 * Template helpers. Each function mirrors one React component of the
 * Next.js site (components/*.tsx) and emits the identical markup/classes,
 * so the Tailwind build produces the same CSS for both implementations.
 */

defined('ABSPATH') || exit;

/** Internal link: Next.js path ("/leistungen/x") → WordPress URL. */
function nw_url(string $path = '/'): string
{
    if (preg_match('#^(https?:|mailto:|tel:|\#)#', $path)) return $path;
    $hash = '';
    $query = '';
    if (($p = strpos($path, '#')) !== false) { $hash = substr($path, $p); $path = substr($path, 0, $p); }
    if (($p = strpos($path, '?')) !== false) { $query = substr($path, $p); $path = substr($path, 0, $p); }
    $path = '/' . trim($path, '/');
    if ($path !== '/') $path .= '/';
    return home_url($path) . $query . $hash;
}

function nw_asset(string $path): string
{
    return NW_THEME_URI . '/assets/' . ltrim($path, '/');
}

/** Media paths from the data files ("/media/x.avif", "/mascot/…") → theme asset URL. */
function nw_media_url(string $path): string
{
    if (preg_match('#^https?://#', $path)) return $path;
    return nw_asset(ltrim($path, '/'));
}

function nw_attr(array $attrs): string
{
    $out = '';
    foreach ($attrs as $k => $v) {
        if ($v === null || $v === false) continue;
        if ($v === true) { $out .= ' ' . $k; continue; }
        $out .= ' ' . $k . '="' . esc_attr((string) $v) . '"';
    }
    return $out;
}

/* ---------------- Brand marks (components/brand/Logo.tsx) ---------------- */

function nw_star(int $size = 40, string $class = ''): string
{
    static $arm = 'M546.76 440.83L546.76 472.71C546.76 483.87 534.27 490.47 525.05 484.18L464.39 442.82C459.67 439.60 453.46 439.60 448.74 442.81L388.00 484.20C378.78 490.49 366.29 483.88 366.29 472.72L366.29 440.83C366.29 436.24 368.56 431.94 372.36 429.35L448.74 377.31C453.46 374.09 459.67 374.09 464.39 377.31L540.70 429.35C544.49 431.94 546.76 436.24 546.76 440.83Z';
    $colors = ['#F5D33D', '#0FB9F2', '#2EE6C8', '#8B5CF6', '#F468A8'];
    $g = '';
    foreach ($colors as $i => $c) {
        $g .= '<g transform="translate(100 100) rotate(' . ($i * 72) . ') translate(0 65.5) scale(0.46)"><path transform="translate(-456.53 -432.29)" d="' . $arm . '" fill="' . $c . '"/></g>';
    }
    return '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 200 200" aria-hidden="true"' . ($class ? ' class="' . esc_attr($class) . '"' : '') . '>' . $g . '</svg>';
}

function nw_wordmark(int $height = 20, string $class = ''): string
{
    $w = round($height * 200 / 26, 2);
    $paths = '<path d="M371.86 286.81L382.69 286.81L386.71 290.82L386.71 300.97L382.69 300.97L382.69 291.88C382.69 291.59 382.59 291.34 382.38 291.13C382.17 290.92 381.92 290.82 381.63 290.82L372.92 290.82C372.63 290.82 372.38 290.92 372.17 291.13C371.96 291.34 371.86 291.59 371.86 291.88L371.86 300.97L367.85 300.97L367.85 290.82L371.86 286.81Z"/><path d="M388.40 286.81L407.26 286.81L407.26 290.82L392.41 290.82L392.41 291.88L407.26 291.88L407.26 295.90L392.41 295.90C392.41 296.19 392.51 296.44 392.72 296.64C392.93 296.85 393.18 296.96 393.47 296.96L407.26 296.96L407.26 300.97L392.41 300.97L388.40 296.96L388.40 286.81Z"/><path d="M427.78 287.04L420.35 287.04L416.34 287.04L408.92 287.04L408.92 291.05L416.34 291.05L416.34 301.20L420.35 301.20L420.35 291.05L427.78 291.05L427.78 287.04Z"/><path d="M429.44 287.04L433.46 287.04L433.46 296.13C433.46 296.42 433.56 296.67 433.77 296.87C433.97 297.08 434.22 297.19 434.52 297.19L438.42 297.19C438.71 297.19 438.96 297.08 439.17 296.87C439.38 296.67 439.48 296.42 439.48 296.13L439.48 287.04L443.49 287.04L443.49 296.13C443.49 296.42 443.60 296.67 443.80 296.87C444.01 297.08 444.26 297.19 444.55 297.19L448.45 297.19C448.74 297.19 448.99 297.08 449.20 296.87C449.41 296.67 449.51 296.42 449.51 296.13L449.51 287.04L453.53 287.04L453.53 297.19L449.51 301.20L443.49 301.20L441.48 299.19L439.48 301.20L433.46 301.20L429.44 297.19L429.44 287.04Z"/><path d="M455.34 285.04L454.64 285.28C454.39 285.36 454.16 285.13 454.23 284.88L454.69 283.24C454.73 283.11 454.68 282.98 454.58 282.90L453.22 281.86C453.01 281.70 453.07 281.38 453.31 281.30L454.02 281.07C454.12 281.03 454.23 281.05 454.31 281.12L456.02 282.42C456.13 282.50 456.17 282.63 456.14 282.76L455.55 284.82C455.52 284.93 455.44 285.01 455.34 285.04Z"/><path d="M454.07 280.90L453.64 280.30C453.48 280.10 453.63 279.80 453.88 279.79L455.59 279.73C455.72 279.73 455.84 279.64 455.88 279.52L456.45 277.91C456.54 277.66 456.86 277.61 457.01 277.82L457.45 278.42C457.51 278.51 457.53 278.62 457.50 278.72L456.78 280.74C456.74 280.87 456.62 280.95 456.49 280.96L454.35 281.03C454.24 281.04 454.14 280.99 454.07 280.90Z"/><path d="M459.67 285.13L459.67 285.87C459.67 286.13 459.38 286.28 459.17 286.13L457.76 285.17C457.65 285.10 457.51 285.10 457.40 285.17L455.99 286.13C455.77 286.28 455.48 286.13 455.48 285.87L455.48 285.13C455.48 285.02 455.53 284.92 455.62 284.86L457.40 283.65C457.51 283.58 457.65 283.58 457.76 283.65L459.53 284.86C459.62 284.92 459.67 285.02 459.67 285.13Z"/><path d="M455.59 286.78H459.52V300.94H455.59ZZ"/><path d="M457.63 278.41L458.06 277.81C458.22 277.60 458.54 277.64 458.63 277.88L459.21 279.49C459.25 279.61 459.37 279.70 459.50 279.70L461.21 279.75C461.47 279.75 461.61 280.05 461.46 280.26L461.03 280.86C460.97 280.94 460.87 280.99 460.76 280.99L458.61 280.93C458.48 280.93 458.36 280.85 458.32 280.72L457.59 278.70C457.55 278.60 457.57 278.49 457.63 278.41Z"/><path d="M461.10 281.02L461.80 281.25C462.05 281.33 462.10 281.65 461.90 281.81L460.55 282.86C460.45 282.94 460.40 283.08 460.44 283.20L460.92 284.84C460.99 285.09 460.76 285.32 460.51 285.24L459.81 285.01C459.71 284.98 459.63 284.90 459.60 284.80L458.99 282.74C458.96 282.61 459.00 282.47 459.11 282.39L460.80 281.08C460.88 281.01 461.00 280.99 461.10 281.02Z"/><path transform="translate(20.5 0)" d="M465.72 287.04L480.54 287.04L480.54 291.05L466.78 291.05C466.49 291.05 466.24 291.15 466.03 291.36C465.82 291.57 465.72 291.82 465.72 292.11L465.72 296.13C465.72 296.42 465.82 296.67 466.03 296.87C466.24 297.08 466.49 297.19 466.78 297.19L480.54 297.19L480.54 301.20L465.72 301.20L461.71 297.19L461.71 291.05L465.72 287.04Z"/><path transform="translate(20.5 0)" d="M482.94 287.04L486.96 287.04L486.96 292.11L497.79 292.11L497.79 287.04L501.80 287.04L501.80 301.20L497.79 301.20L497.79 296.13L486.96 296.13L486.96 301.20L482.94 301.20L482.94 287.04Z"/><path transform="translate(20.5 0)" d="M504.20 287.04L523.06 287.04L523.06 291.05L508.22 291.05L508.22 292.11L523.06 292.11L523.06 296.13L508.22 296.13C508.22 296.42 508.32 296.67 508.53 296.87C508.74 297.08 508.99 297.19 509.28 297.19L523.06 297.19L523.06 301.20L508.22 301.20L504.20 297.19L504.20 287.04Z"/><path transform="translate(20.5 0)" d="M529.48 291.05L529.48 292.11L540.34 292.11C540.34 291.82 540.23 291.57 540.02 291.36C539.82 291.15 539.57 291.05 539.27 291.05L529.48 291.05M525.46 287.04L540.34 287.04L544.35 291.05L544.35 292.11L542.34 294.12L544.35 296.13L544.35 301.20L540.34 301.20L540.34 297.19C540.34 296.90 540.23 296.64 540.02 296.44C539.82 296.23 539.57 296.13 539.27 296.13L529.48 296.13L529.48 301.20L525.46 301.20L525.46 287.04Z"/><path transform="translate(53.0 0)" d="M427.78 287.04L420.35 287.04L416.34 287.04L408.92 287.04L408.92 291.05L416.34 291.05L416.34 301.20L420.35 301.20L420.35 291.05L427.78 291.05L427.78 287.04Z"/>';
    return '<svg width="' . $w . '" height="' . $height . '" viewBox="366.5 276.5 200 26" fill="currentColor" aria-hidden="true"' . ($class ? ' class="' . esc_attr($class) . '"' : '') . '>' . $paths . '</svg>';
}

/** One logo arm (components/arrows.tsx <Arrow/>). $color = key or CSS colour. */
function nw_arrow(string $color, int $size = 48, int $rotation = 0, string $class = '', string $style = ''): string
{
    $fill = NW_ARROW_COLORS[$color] ?? $color;
    return '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 100 100" aria-hidden="true"'
        . ($class ? ' class="' . esc_attr($class) . '"' : '') . ($style ? ' style="' . esc_attr($style) . '"' : '')
        . '><path d="' . NW_ARROW_PATH . '" fill="' . esc_attr($fill) . '"' . ($rotation ? ' transform="rotate(' . $rotation . ' 50 50)"' : '') . '/></svg>';
}

/* ---------------- Buttons (components/Button.tsx) ---------------- */

function nw_button_classes(string $variant = 'primary'): string
{
    $base = 'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-heading text-sm font-bold tracking-wide transition-all duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 active:translate-y-px';
    return match ($variant) {
        'studio' => "$base bg-sun px-7 py-3.5 text-ink hover:brightness-105",
        'ghost' => "$base border-2 border-ink/15 px-7 py-3.5 text-ink hover:border-ink/40 hover:bg-ink/5",
        'whatsapp' => "$base bg-whatsapp px-7 py-3.5 text-white hover:brightness-105",
        'light' => "$base bg-white px-7 py-3.5 text-ink hover:bg-paper-2",
        'link' => 'group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:text-violet',
        default => "$base bg-ink px-7 py-3.5 text-white hover:bg-deep-2",
    };
}

function nw_chevron(string $color = 'currentColor'): string
{
    return '<svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" class="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"><path d="' . NW_ARROW_PATH . '" fill="' . esc_attr($color) . '" transform="rotate(90 50 50)"/></svg>';
}

function nw_button(string $href, string $label, string $variant = 'primary', string $class = '', array $opts = []): string
{
    $external = $opts['external'] ?? false;
    $withArrow = $opts['arrow'] ?? true;
    $attrs = [
        'href' => $external ? $href : nw_url($href),
        'class' => trim(nw_button_classes($variant) . ' ' . $class),
        'aria-label' => $opts['ariaLabel'] ?? null,
    ];
    if ($external) { $attrs['target'] = '_blank'; $attrs['rel'] = 'noopener noreferrer'; }
    return '<a' . nw_attr($attrs) . '>' . esc_html($label) . ($withArrow ? nw_chevron() : '') . '</a>';
}

function nw_arrow_link(string $href, string $label, string $color = 'violet', string $class = ''): string
{
    return '<a href="' . esc_url(nw_url($href)) . '" class="' . esc_attr(trim(nw_button_classes('link') . ' ' . $class)) . '">' . nw_chevron(NW_ARROW_COLORS[$color]) . esc_html($label) . '</a>';
}

/* ---------------- Reveal (components/Reveal.tsx) ---------------- */

/** Opens a reveal wrapper; JS (site.js) adds .is-shown once it enters the viewport. */
function nw_reveal_open(string $class = '', float $delay = 0, string $tag = 'div', array $extra = []): string
{
    $attrs = array_merge(['class' => trim('nw-reveal ' . $class), 'data-reveal' => true], $extra);
    if ($delay > 0) $attrs['style'] = '--reveal-delay:' . $delay . 's' . (isset($extra['style']) ? ';' . $extra['style'] : '');
    return '<' . $tag . nw_attr($attrs) . '>';
}

function nw_reveal_close(string $tag = 'div'): string
{
    return '</' . $tag . '>';
}

/* ---------------- SectionHeading (components/SectionHeading.tsx) ---------------- */

function nw_section_heading(array $a): string
{
    $align = $a['align'] ?? 'center';
    $tag = $a['as'] ?? 'h2';
    $eyebrowColor = $a['eyebrowColor'] ?? 'text-mint';
    $alignCls = $align === 'center' ? 'text-center mx-auto' : 'text-left';
    $out = nw_reveal_open('max-w-3xl ' . ($align === 'center' ? 'mx-auto' : ''));
    $out .= '<div class="' . $alignCls . '">';
    if (!empty($a['eyebrow'])) {
        $out .= '<p class="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] ' . esc_attr($eyebrowColor) . '">' . esc_html($a['eyebrow']) . '</p>';
    }
    $out .= '<' . $tag . ' class="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">' . ($a['titleHtml'] ?? esc_html($a['title'])) . '</' . $tag . '>';
    if (!empty($a['intro'])) {
        $out .= '<p class="mt-5 text-base leading-relaxed text-ink-3 md:text-lg">' . esc_html($a['intro']) . '</p>';
    }
    $out .= '</div>' . nw_reveal_close();
    return $out;
}

/* ---------------- Media (components/ui/Media.tsx) ---------------- */

function nw_picture(array $asset, string $class = '', ?string $sizes = null, bool $priority = false): string
{
    $sz = $sizes ? ' sizes="' . esc_attr($sizes) . '"' : '';
    return '<picture>'
        . '<source srcset="' . esc_url(nw_media_url($asset['avif'])) . '" type="image/avif"' . $sz . '>'
        . '<source srcset="' . esc_url(nw_media_url($asset['webp'])) . '" type="image/webp"' . $sz . '>'
        . '<img src="' . esc_url(nw_media_url($asset['webp'])) . '" alt="' . esc_attr($asset['alt']) . '" width="' . (int) $asset['width'] . '" height="' . (int) $asset['height'] . '" loading="' . ($priority ? 'eager' : 'lazy') . '" decoding="' . ($priority ? 'sync' : 'async') . '" fetchpriority="' . ($priority ? 'high' : 'auto') . '"' . ($class ? ' class="' . esc_attr($class) . '"' : '') . '>'
        . '</picture>';
}

/* ---------------- Service icons (components/icons.tsx) ---------------- */

function nw_service_icon(string $icon, string $class = 'h-7 w-7'): string
{
    $paths = [
        'camera' => '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.2-1.8c.2-.3.5-.5.9-.5h3.6c.4 0 .7.2.9.5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"/><circle cx="12" cy="12.5" r="3.2"/>',
        'megaphone' => '<path d="M4 10v4a1 1 0 0 0 1 1h2l4 4h1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1L7 9H5a1 1 0 0 0-1 1Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
        'target' => '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
        'monitor' => '<rect x="3.5" y="4.5" width="17" height="12" rx="1.5"/><path d="M9.5 20h5M12 16.5V20"/>',
        'search' => '<circle cx="10.5" cy="10.5" r="6"/><path d="m15.5 15.5 4.5 4.5"/>',
        'sparkles' => '<path d="M12 4.5 13.6 9l4.4 1.5-4.4 1.5L12 16.5 10.4 12 6 10.5 10.4 9 12 4.5Z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"/>',
        'play' => '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" stroke="none"/>',
        'code' => '<path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.2 5.5l-2.4 13"/>',
        'wrench' => '<path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7a1.8 1.8 0 1 0 2.5 2.5l5.3-5.2a4 4 0 0 0 5-5.3l-2.6 2.6-2.3-2.3 2.6-2.5Z"/>',
        'printer' => '<path d="M7 8V4.5h10V8M7 16H4.5v-6h15v6H17"/><rect x="7" y="13.5" width="10" height="6" rx="1"/>',
    ];
    return '<svg viewBox="0 0 24 24" class="' . esc_attr($class) . '" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' . ($paths[$icon] ?? '') . '</svg>';
}

/* ---------------- Cards (ServiceCard.tsx / CaseCard.tsx) ---------------- */

function nw_service_card(array $s, float $delay = 0): string
{
    $accentText = ['mint' => 'text-mint', 'violet' => 'text-violet', 'pink' => 'text-pink', 'sun' => 'text-sun', 'sky' => 'text-sky'][$s['color']];
    $accentBorder = ['mint' => 'hover:border-mint/50', 'violet' => 'hover:border-violet/50', 'pink' => 'hover:border-pink/50', 'sun' => 'hover:border-sun/50', 'sky' => 'hover:border-sky/50'][$s['color']];
    $hex = NW_ARROW_COLORS[$s['color']];
    $o = nw_reveal_open('h-full', $delay);
    $o .= '<a href="' . esc_url(nw_url($s['href'])) . '" class="group relative flex h-full flex-col overflow-hidden rounded border border-line bg-white p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 ' . $accentBorder . '">';
    $o .= '<div aria-hidden="true" class="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25" style="background-color:' . $hex . '"></div>';
    $o .= '<div class="mb-5 flex items-center justify-between"><span class="inline-flex h-13 w-13 items-center justify-center rounded border border-line bg-ink/5 p-3 transition-transform duration-300 group-hover:scale-110 ' . $accentText . '">' . nw_service_icon($s['icon']) . '</span>';
    $o .= nw_arrow($s['color'], 18, 0, 'opacity-40 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100') . '</div>';
    $o .= '<h3 class="text-lg font-bold leading-snug">' . esc_html($s['title']) . '</h3>';
    $o .= '<p class="mt-3 flex-1 text-sm leading-relaxed text-ink-3">' . esc_html($s['teaser']) . '</p>';
    $o .= '<ul class="mt-4 flex flex-wrap gap-1.5">';
    foreach (array_slice($s['bullets'], 0, 4) as $b) $o .= '<li class="rounded border border-line px-2.5 py-1 text-[11px] text-ink-3">' . esc_html($b) . '</li>';
    $o .= '</ul>';
    $o .= '<span class="mt-6 inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest ' . $accentText . '">' . esc_html($s['cta']) . '<svg width="10" height="10" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-1"><path d="' . NW_ARROW_PATH . '" fill="currentColor" transform="rotate(90 50 50)"/></svg></span>';
    $o .= '</a>' . nw_reveal_close();
    return $o;
}

function nw_case_card(array $c, float $delay = 0): string
{
    $accent = NW_ARROW_COLORS[$c['color']];
    $o = nw_reveal_open('h-full', $delay, 'article');
    $o .= '<div class="group flex h-full flex-col overflow-hidden rounded border border-line bg-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">';
    $o .= '<div class="relative flex h-36 items-end overflow-hidden p-6" style="background:radial-gradient(400px 160px at 20% 0%, ' . $accent . '33, transparent 70%), linear-gradient(160deg, #12122688, #0B0B1A)">';
    $o .= nw_arrow($c['color'], 120, 0, 'absolute -right-6 -top-6 opacity-15 transition-transform duration-500 group-hover:rotate-12');
    $o .= '<p class="font-heading text-xs font-bold tracking-wide" style="color:' . $accent . '">' . esc_html($c['category']) . '</p></div>';
    $o .= '<div class="flex flex-1 flex-col gap-4 p-6"><h3 class="text-lg font-bold leading-snug">' . esc_html($c['title']) . '</h3><div class="space-y-3 text-sm leading-relaxed">';
    foreach ([['Herausforderung', $c['challenge'], ''], ['Lösung', $c['solution'], ''], ['Ergebnis', $c['result'], 'italic ']] as [$k, $v, $i]) {
        $o .= '<p><span class="font-heading text-[11px] font-bold uppercase tracking-widest text-ink">' . $k . ' · </span><span class="' . $i . 'text-ink-3">' . esc_html($v) . '</span></p>';
    }
    $o .= '</div><ul class="mt-auto flex flex-wrap gap-1.5 pt-2">';
    foreach ($c['services'] as $s) $o .= '<li class="rounded border border-line px-2.5 py-1 text-[11px] text-ink-3">' . esc_html($s) . '</li>';
    $o .= '</ul><a href="' . esc_url(nw_url('/kontakt?service=' . rawurlencode($c['category']))) . '" class="group/link inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest transition-colors" style="color:' . $accent . '">Ähnliches Projekt starten<svg width="10" height="10" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform duration-200 group-hover/link:translate-x-1"><path d="' . NW_ARROW_PATH . '" fill="currentColor" transform="rotate(90 50 50)"/></svg></a></div></div>';
    $o .= nw_reveal_close('article');
    return $o;
}

/* ---------------- FinalCTA (components/FinalCTA.tsx) ---------------- */

function nw_final_cta(string $title = 'Was willst du als Nächstes produzieren?', string $text = 'Erzähl uns kurz, was ansteht. Wir sagen dir ehrlich, was sich lohnt und was nicht.'): string
{
    $o = '<section class="border-t border-line py-24 md:py-32" aria-labelledby="final-cta"><div class="mx-auto max-w-3xl px-5 text-center sm:px-8">' . nw_reveal_open();
    $o .= nw_star(56, 'mx-auto mb-8');
    $o .= '<h2 id="final-cta" class="font-heading text-3xl font-black tracking-tight md:text-4xl">' . esc_html($title) . '</h2>';
    $o .= '<p class="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-3">' . esc_html($text) . '</p>';
    $o .= '<div class="mt-9 flex flex-col items-center gap-5">' . nw_button('/kontakt', 'Erstgespräch buchen');
    $o .= '<p class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-3"><a href="' . esc_url(nw_url('/kontakt?service=Fotoshooting')) . '" class="underline-offset-4 transition-colors hover:text-ink hover:underline">Studio anfragen</a><a href="' . esc_url(nw_whatsapp_href()) . '" target="_blank" rel="noopener noreferrer" class="underline-offset-4 transition-colors hover:text-ink hover:underline">WhatsApp schreiben</a></p></div>';
    $o .= nw_reveal_close() . '</div></section>';
    return $o;
}

/** Is the current request on the dark portfolio stage? */
function nw_is_dark_stage(): bool
{
    return is_post_type_archive('portfolio') || is_singular('portfolio') || is_tax('portfolio_category');
}
