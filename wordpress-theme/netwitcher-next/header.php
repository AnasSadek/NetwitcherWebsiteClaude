<?php
/**
 * Document head + fixed header (components/Header.tsx).
 * The dark variant is decided server-side (html[data-stage="dark"]), so the
 * portfolio stage never flashes light – Next.js does this via DarkStage on
 * the client.
 */
$dark = nw_is_dark_stage();
$site = nw_site();
$path = '/' . trim((string) ($GLOBALS['wp']->request ?? ''), '/');
$is = fn(string $p) => $path === $p || str_starts_with($path, $p . '/');
$nav = [
    ['href' => '/leistungen', 'label' => 'Leistungen', 'dropdown' => true],
    ['href' => '/studio', 'label' => 'Studio'],
    ['href' => '/portfolio', 'label' => 'Portfolio'],
    ['href' => '/ueber-uns', 'label' => 'Über uns'],
    ['href' => '/blog', 'label' => 'Blog'],
];
?><!DOCTYPE html>
<html <?php language_attributes(); ?><?php echo $dark ? ' data-stage="dark"' : ''; ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php echo nw_json_ld(); ?>
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm">Zum Inhalt springen</a>

<header id="site-header" data-header<?php echo $dark ? ' data-dark' : ''; ?> class="fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-transparent py-4">
  <div class="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="group flex items-center gap-2.5" aria-label="Netwitcher, Startseite">
      <?php echo nw_star(38, 'transition-transform duration-500 group-hover:rotate-[36deg]'); ?>
      <?php echo nw_wordmark(14, $dark ? 'text-white' : 'text-ink'); ?>
    </a>

    <nav class="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
      <?php foreach ($nav as $item):
          $active = $is($item['href']);
          $cls = $active ? ($dark ? 'text-white' : 'text-ink') : ($dark ? 'text-white/60 hover:text-white' : 'text-ink-3 hover:text-ink');
          if (!empty($item['dropdown'])): ?>
        <div class="relative" data-dropdown>
          <a href="<?php echo esc_url(nw_url($item['href'])); ?>" aria-expanded="false" data-dropdown-trigger class="rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors <?php echo $cls; ?>">
            <span class="inline-flex items-center gap-1.5"><?php echo esc_html($item['label']); ?><svg width="9" height="9" viewBox="0 0 100 100" aria-hidden="true" class="opacity-70"><path d="<?php echo NW_ARROW_PATH; ?>" fill="currentColor" transform="rotate(180 50 50)"/></svg></span>
          </a>
          <div data-dropdown-panel class="nw-dropdown absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3" hidden>
            <div class="rounded-card border border-line bg-white p-2 shadow-lift">
              <a href="<?php echo esc_url(nw_url('/studio')); ?>" class="block rounded-xl px-4 py-2.5 text-sm font-bold text-pink transition-colors hover:bg-paper-2">Content Creation &amp; Studio Berlin</a>
              <?php foreach (nw_leistungen_services() as $s): ?>
                <a href="<?php echo esc_url(nw_url($s['href'])); ?>" class="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"><?php echo esc_html($s['navTitle']); ?></a>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
      <?php else: ?>
        <a href="<?php echo esc_url(nw_url($item['href'])); ?>" class="rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors <?php echo $cls; ?>"><?php echo esc_html($item['label']); ?></a>
      <?php endif; endforeach; ?>
    </nav>

    <div class="flex items-center gap-3">
      <a href="<?php echo esc_url(nw_url('/kontakt')); ?>" class="hidden rounded-full px-5 py-2.5 font-heading text-xs font-bold tracking-wide transition-colors duration-200 sm:inline-flex <?php echo $dark ? 'bg-white text-ink hover:bg-paper-2' : 'bg-ink text-white hover:bg-deep-2'; ?>">Projekt starten</a>
      <button type="button" data-menu-toggle aria-expanded="false" aria-label="Menü öffnen" aria-controls="mobile-nav" class="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border lg:hidden <?php echo $dark ? 'border-white/15 bg-white/10' : 'border-line bg-white/70'; ?>">
        <span data-bar="1" class="h-0.5 w-5 transition-transform <?php echo $dark ? 'bg-white' : 'bg-ink'; ?>"></span>
        <span data-bar="2" class="h-0.5 w-5 transition-transform <?php echo $dark ? 'bg-white' : 'bg-ink'; ?>"></span>
      </button>
    </div>
  </div>

  <nav id="mobile-nav" data-mobile-nav aria-label="Mobile Navigation" hidden class="nw-mobile-nav overflow-hidden border-t backdrop-blur-xl lg:hidden <?php echo $dark ? 'border-white/10 bg-void/95' : 'border-line bg-paper/95'; ?>">
    <div class="space-y-1 px-4 py-4">
      <?php foreach ($nav as $item): ?>
        <a href="<?php echo esc_url(nw_url($item['href'])); ?>" class="block rounded-xl px-4 py-3 text-base font-semibold transition-colors <?php echo $dark ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-ink-2 hover:bg-white hover:text-ink'; ?>"><?php echo esc_html($item['label']); ?></a>
      <?php endforeach; ?>
      <a href="<?php echo esc_url(nw_url('/kontakt')); ?>" class="mt-3 block rounded-full px-5 py-3 text-center font-heading text-sm font-bold <?php echo $dark ? 'bg-white text-ink' : 'bg-ink text-white'; ?>">Projekt starten</a>
    </div>
  </nav>
</header>
<main id="main">
