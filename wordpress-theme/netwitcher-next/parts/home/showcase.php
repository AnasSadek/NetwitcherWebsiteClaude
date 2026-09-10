<?php
/** „Aus dem Studio" (components/home/Showcase.tsx). */
$shots = [
    ['reels', 'Reel-Produktion', 'aspect-[4/5]', ''],
    ['studio', 'Set & Licht, Studio Berlin', 'aspect-[4/3]', 'md:mt-14'],
    ['product', 'Produktfotografie', 'aspect-[4/5]', 'md:mt-6'],
    ['studioClose', 'Kamera am Produkttisch', 'aspect-square', 'md:mt-20'],
];
?>
<section class="relative py-24 md:py-32" aria-labelledby="showcase">
  <div class="mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h2 id="showcase" class="font-boxi text-3xl leading-[1.1] text-ink md:text-5xl">AUS DEM STUDIO.</h2>
        <?php echo nw_button('/portfolio', 'Portfolio ansehen', 'ghost'); ?>
      </div>
    <?php echo nw_reveal_close(); ?>
    <div class="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <?php foreach ($shots as $i => [$key, $label, $aspect, $offset]): ?>
        <?php echo nw_reveal_open($offset, $i * 0.07); ?>
          <figure class="group">
            <div class="overflow-hidden rounded-card <?php echo $aspect; ?> shadow-soft"><?php echo nw_picture(nw_media($key), 'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]', '(min-width: 768px) 24vw, 46vw'); ?></div>
            <figcaption class="mt-3 text-sm font-semibold text-ink-3"><?php echo esc_html($label); ?></figcaption>
          </figure>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
    <?php echo nw_reveal_open('', 0.1); ?>
      <p class="mt-10 max-w-xl text-base leading-relaxed text-ink-2">Alles hier ist bei uns entstanden: eigenes Studio, eigenes Licht, eigener Schnitt. Konkrete Kundencases zeigen wir dir gern im <a href="<?php echo esc_url(nw_url('/kontakt#termin')); ?>" class="font-semibold text-ink underline underline-offset-4 hover:text-violet">Erstgespräch</a>.</p>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>
