<?php
/** „Fünf Farben, ein Universum" (components/home/Universe.tsx). */
$fields = [
    ['pink', '#fdeef5', 'Content & Studio', 'Foto, Video und Reels aus dem eigenen Studio in Berlin. Geplant, produziert, geschnitten.', ['Produktfotografie', 'Reels & Short Video', 'Werbevideo', 'Creative Direction'], '/studio', true],
    ['sky', '#e9f7fd', 'Social & Ads', 'Wir bringen Content zu den richtigen Menschen: organisch und bezahlt.', ['Social Media Management', 'Meta Ads', 'TikTok Ads', 'Google Ads'], '/leistungen/performance-marketing', true],
    ['mint', '#e9fbf7', 'Web & Shops', 'Websites und E-Commerce, gebaut auf Anfragen.', ['Webdesign', 'Landingpages', 'E-Commerce'], '/leistungen/webdesign-ecommerce', false],
    ['violet', '#f1ecfd', 'Software & KI', 'Individuelle Tools, Portale und Automatisierung.', ['Softwareentwicklung', 'KI-Workflows', 'Technischer Support'], '/leistungen/softwareentwicklung', false],
    ['sun', '#fdf8e4', 'Brand & Design', 'Logo, Design-System und Print, die wiedererkennbar machen.', ['Branding', 'Design-Systeme', 'Print'], '/leistungen/branding-design', false],
];
?>
<section class="relative py-24 md:py-32" aria-labelledby="universum">
  <div class="mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="max-w-2xl">
        <h2 id="universum" class="font-boxi text-3xl leading-[1.1] text-ink md:text-5xl">FÜNF FARBEN.<br>EIN UNIVERSUM.</h2>
        <p class="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">Jeder Arm unseres Sterns steht für eine Disziplin. Zusammen sind sie ein System: Content entsteht, wird verbreitet und landet dort, wo aus Aufmerksamkeit Anfragen werden.</p>
      </div>
    <?php echo nw_reveal_close(); ?>
    <div class="mt-12 grid gap-5 md:grid-cols-6">
      <?php foreach ($fields as $i => [$color, $bg, $title, $copy, $items, $href, $big]): $hex = NW_ARROW_COLORS[$color]; ?>
        <?php echo nw_reveal_open($big ? 'md:col-span-3' : 'md:col-span-2', $i * 0.06); ?>
          <a href="<?php echo esc_url(nw_url($href)); ?>" class="group relative flex h-full flex-col overflow-hidden rounded-card p-7 transition-transform duration-300 hover:-translate-y-1 md:p-8" style="background:<?php echo $bg; ?>">
            <?php echo nw_arrow($color, $big ? 150 : 110, 0, 'absolute -right-6 -top-6 opacity-[0.16] transition-transform duration-500 group-hover:rotate-[14deg] group-hover:scale-110'); ?>
            <?php echo nw_arrow($color, 26); ?>
            <h3 class="mt-5 font-heading text-2xl font-extrabold tracking-tight text-ink"><?php echo esc_html($title); ?></h3>
            <p class="mt-2.5 max-w-sm text-[15px] leading-relaxed text-ink-2"><?php echo esc_html($copy); ?></p>
            <ul class="mt-5 flex flex-wrap gap-2"><?php foreach ($items as $it): ?><li class="rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-ink-2"><?php echo esc_html($it); ?></li><?php endforeach; ?></ul>
            <span class="mt-auto inline-flex items-center gap-2 pt-6 font-heading text-xs font-bold uppercase tracking-[0.15em] text-ink">Mehr dazu<?php echo nw_arrow($color, 10, 90, 'transition-transform duration-200 group-hover:translate-x-1'); ?></span>
          </a>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>
