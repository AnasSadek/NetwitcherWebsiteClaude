<?php
/** „Vom Blick zum Klick" (components/home/Journey.tsx). */
$steps = [
    ['pink', 'Auffallen', 'Konzept und Produktion: Fotos, Reels und Videos, die im Feed stoppen.'],
    ['sky', 'Verbreiten', 'Social Media und Ads bringen den Content zu den richtigen Menschen.'],
    ['mint', 'Ankommen', 'Website, Landingpage oder Shop: ein Ziel, das aus Besuch Absicht macht.'],
    ['violet', 'Bewirken', 'Anfragen, Termine, Verkäufe. Messbar, nicht gefühlt.'],
];
?>
<section class="relative bg-paper-2 py-24 md:py-32" aria-labelledby="journey">
  <div class="mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h2 id="journey" class="font-boxi text-3xl leading-[1.1] text-ink md:text-5xl">VOM BLICK<br>ZUM KLICK.</h2>
        <p class="max-w-sm text-base leading-relaxed text-ink-2">Kein Bauchladen, ein Weg. Jede Leistung zahlt auf die nächste Station ein.</p>
      </div>
    <?php echo nw_reveal_close(); ?>
    <div class="relative mt-14" data-journey>
      <div aria-hidden="true" class="nw-journey-line absolute left-[13px] top-4 hidden h-[3px] w-[calc(100%-26px)] origin-left rounded-full brand-sweep md:block"></div>
      <ol class="grid gap-10 md:grid-cols-4 md:gap-6">
        <?php foreach ($steps as $i => [$color, $title, $copy]): ?>
          <?php echo nw_reveal_open('relative', 0.12 + $i * 0.14, 'li'); ?>
            <div class="flex items-center gap-3 md:block">
              <span class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper-2"><?php echo nw_arrow($color, 22, 90); ?></span>
              <h3 class="font-heading text-xl font-extrabold tracking-tight text-ink md:mt-5"><span class="mr-2 text-sm font-bold text-ink-3">0<?php echo $i + 1; ?></span><?php echo esc_html($title); ?></h3>
            </div>
            <p class="mt-3 max-w-[17rem] text-[15px] leading-relaxed text-ink-2"><?php echo esc_html($copy); ?></p>
          <?php echo nw_reveal_close('li'); ?>
        <?php endforeach; ?>
      </ol>
    </div>
  </div>
</section>
