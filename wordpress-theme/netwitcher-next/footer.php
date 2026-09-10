<?php
/** Footer (components/Footer.tsx) + WhatsApp button (components/WhatsAppButton.tsx). */
$site = nw_site();
?>
</main>
<footer class="relative bg-deep text-white">
  <div aria-hidden="true" class="brand-sweep h-1.5 w-full"></div>
  <div class="mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
    <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center gap-2.5" aria-label="Netwitcher, Startseite"><?php echo nw_star(42) . nw_wordmark(14, 'text-white'); ?></a>
        <p class="mt-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-sun"><?php echo esc_html($site['slogan']); ?></p>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-white/65">Digital Agency &amp; Content-Studio in Berlin. Wir produzieren Content, der Aufmerksamkeit erzeugt, und Kampagnen, die Kunden bringen.</p>
      </div>
      <nav aria-label="Leistungen">
        <h2 class="font-heading text-sm font-bold uppercase tracking-widest text-white">Leistungen</h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li><a href="<?php echo esc_url(nw_url('/studio')); ?>" class="text-white/65 transition-colors hover:text-pink">Content Creation &amp; Studio</a></li>
          <?php foreach (array_slice(nw_leistungen_services(), 0, 6) as $s): ?>
            <li><a href="<?php echo esc_url(nw_url($s['href'])); ?>" class="text-white/65 transition-colors hover:text-white"><?php echo esc_html($s['navTitle']); ?></a></li>
          <?php endforeach; ?>
          <li><a href="<?php echo esc_url(nw_url('/leistungen')); ?>" class="font-semibold text-white underline-offset-4 hover:underline">Alle Leistungen</a></li>
        </ul>
      </nav>
      <nav aria-label="Unternehmen">
        <h2 class="font-heading text-sm font-bold uppercase tracking-widest text-white">Netwitcher</h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <?php foreach ([['/ueber-uns', 'Über uns'], ['/portfolio', 'Portfolio'], ['/produkte/fekrahub', 'Produkte / FekraHub'], ['/blog', 'Blog'], ['/kontakt', 'Kontakt'], ['/impressum', 'Impressum'], ['/datenschutz', 'Datenschutzerklärung'], ['/agb', 'AGB']] as [$h, $l]): ?>
            <li><a href="<?php echo esc_url(nw_url($h)); ?>" class="text-white/65 transition-colors hover:text-white"><?php echo esc_html($l); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </nav>
      <div>
        <h2 class="font-heading text-sm font-bold uppercase tracking-widest text-white">Kontakt</h2>
        <ul class="mt-4 space-y-2.5 text-sm text-white/65">
          <li><a href="mailto:<?php echo esc_attr($site['email']); ?>" class="transition-colors hover:text-white"><?php echo esc_html($site['email']); ?></a></li>
          <li><a href="<?php echo esc_attr($site['phoneHref']); ?>" class="transition-colors hover:text-white"><?php echo esc_html($site['phone']); ?></a></li>
          <li><a href="<?php echo esc_url(nw_whatsapp_href($site['defaultWhatsappText'])); ?>" target="_blank" rel="noopener noreferrer" class="text-whatsapp transition-colors hover:text-white">WhatsApp schreiben</a></li>
          <li>Berlin, Deutschland</li>
        </ul>
        <a href="<?php echo esc_url(nw_url('/kontakt#termin')); ?>" class="mt-6 inline-flex rounded-full bg-sun px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-ink transition-all hover:brightness-105">Erstgespräch buchen</a>
      </div>
    </div>
    <div class="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row">
      <p>© <?php echo date('Y'); ?> <?php echo esc_html($site['legalName']); ?> · Berlin</p>
      <p class="font-heading uppercase tracking-[0.25em]">Magic in Every Click</p>
    </div>
  </div>
</footer>

<a href="<?php echo esc_url(nw_whatsapp_href($site['defaultWhatsappText'])); ?>" target="_blank" rel="noopener noreferrer" aria-label="Per WhatsApp schreiben" class="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-[0_8px_30px_rgba(37,211,102,.35)] transition-transform duration-200 hover:scale-110 motion-reduce:hover:scale-100">
  <span aria-hidden="true" class="absolute inset-0 rounded-full bg-whatsapp/60 animate-pulse-ring motion-reduce:hidden"></span>
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#06060F" aria-hidden="true" class="relative"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.88-.12-.44-.14-.99-.32-1.7-.63-3-1.29-4.95-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.08 0-1.47.77-2.19 1.04-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.07 1.32 2.37 1.47.3.15.47.12.64-.07.17-.2.74-.86.93-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.42Z"/></svg>
  <span class="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded border border-line bg-paper-2 px-4 py-2 text-xs font-medium text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">Direkt per WhatsApp schreiben</span>
</a>
<?php wp_footer(); ?>
</body>
</html>
