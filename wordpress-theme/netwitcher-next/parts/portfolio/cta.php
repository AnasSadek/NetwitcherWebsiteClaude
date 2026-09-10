<?php
/**
 * PortfolioCTA (components/portfolio/PortfolioCTA.tsx). Leads into the
 * inquiry dialog (/kontakt), optionally with a preselected topic.
 * $args: service (string|null)
 */
$service = $args['service'] ?? null;
$href = $service ? '/kontakt?service=' . rawurlencode($service) : '/kontakt';
$wa = nw_whatsapp_href('Hallo Netwitcher! Ich habe euer Portfolio gesehen und würde gern über ein Projekt sprechen.');
?>
<section class="relative overflow-hidden py-28 md:py-40" aria-labelledby="portfolio-cta">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:radial-gradient(50% 60% at 50% 100%, rgba(139,92,246,0.35), transparent 70%), radial-gradient(30% 40% at 15% 80%, rgba(244,104,168,0.18), transparent 70%), radial-gradient(30% 40% at 85% 85%, rgba(15,185,242,0.18), transparent 70%)"></div>
  <div class="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <?php echo nw_star(64, 'mx-auto mb-10 drop-shadow-[0_12px_40px_rgba(139,92,246,0.6)]'); ?>
      <?php echo nw_boxi_title(['as' => 'h2', 'id' => 'portfolio-cta', 'lines' => ['GEFÄLLT DIR,', 'WAS DU SIEHST?'], 'max' => '4.5rem', 'min' => '2rem', 'class' => 'text-center text-white']); ?>
      <p class="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/70">Dann lass uns etwas machen, das man sich merkt.</p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="<?php echo esc_url(nw_url($href)); ?>" class="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:bg-paper-2 sm:w-auto">Projekt starten<svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-1"><path d="<?php echo NW_ARROW_PATH; ?>" fill="currentColor" transform="rotate(90 50 50)"/></svg></a>
        <a href="<?php echo esc_url(nw_url('/kontakt#termin')); ?>" class="inline-flex w-full items-center justify-center rounded-full border-2 border-white/20 px-8 py-4 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:border-white/60 hover:bg-white/5 sm:w-auto">Erstgespräch buchen</a>
      </div>
      <a href="<?php echo esc_url($wa); ?>" target="_blank" rel="noopener noreferrer" class="mt-7 inline-block text-sm text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline">Oder direkt per WhatsApp schreiben</a>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>
