<?php /** Finale (components/home/Finale.tsx). */ ?>
<section class="px-5 pb-24 sm:px-8 md:pb-32" aria-labelledby="finale">
  <div class="stage-glow relative mx-auto max-w-[1500px] overflow-hidden rounded-[40px] bg-deep px-6 py-20 text-center shadow-lift md:py-28">
    <?php echo nw_reveal_open(); ?>
      <?php echo nw_star(84, 'mx-auto mb-9 drop-shadow-[0_12px_40px_rgba(139,92,246,0.55)]'); ?>
      <h2 id="finale" class="mx-auto max-w-3xl font-boxi text-3xl leading-[1.12] text-white md:text-5xl">DEINE MARKE HAT<br>MAGIE VERDIENT.</h2>
      <p class="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/70">Erzähl uns in drei kurzen Schritten, was ansteht. Antwort innerhalb eines Werktags.</p>
      <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
        <?php echo nw_button('/kontakt', 'Projekt starten', 'light'); ?>
        <a href="<?php echo esc_url(nw_url('/kontakt#termin')); ?>" class="font-heading text-sm font-bold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">Erstgespräch buchen</a>
      </div>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>
