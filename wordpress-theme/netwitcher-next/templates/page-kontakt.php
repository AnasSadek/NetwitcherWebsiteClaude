<?php /* Template Name: Kontakt */
/**
 * app/kontakt/page.tsx + components/contact/InquiryFlow.tsx.
 * The three steps are rendered server-side (all Tailwind classes live here);
 * src/js/inquiry.js drives state, validation and the mailto/WhatsApp hand-off.
 * ?service=… is resolved here (like useSearchParams on first render) so the
 * preselected step is in the initial HTML – no flash of step 1.
 */
get_header();
$site = nw_site();

$topics = [
    ['id' => 'content-studio', 'label' => 'Content & Studio', 'hint' => 'Regelmäßiger Content aus dem Studio Berlin', 'accent' => 'pink'],
    ['id' => 'foto-video', 'label' => 'Foto & Video', 'hint' => 'Produkt-, Team- oder Imageproduktion', 'accent' => 'pink'],
    ['id' => 'social-media', 'label' => 'Social Media', 'hint' => 'Kanäle aufbauen, betreuen, wachsen lassen', 'accent' => 'sky'],
    ['id' => 'ads', 'label' => 'Ads', 'hint' => 'Meta, Google & TikTok mit Budgetverantwortung', 'accent' => 'sky'],
    ['id' => 'website', 'label' => 'Website', 'hint' => 'Neue Website, Relaunch oder Onlineshop', 'accent' => 'mint'],
    ['id' => 'seo', 'label' => 'SEO', 'hint' => 'Sichtbar werden, wenn jemand sucht', 'accent' => 'mint'],
    ['id' => 'branding', 'label' => 'Branding', 'hint' => 'Logo, Design-System, Print', 'accent' => 'violet'],
    ['id' => 'software', 'label' => 'Software', 'hint' => 'Individuelle Tools, Portale, Automatisierung', 'accent' => 'violet'],
    ['id' => 'anderes', 'label' => 'Etwas anderes', 'hint' => 'Erzähl es uns einfach in eigenen Worten', 'accent' => 'sun'],
];
$timings = [
    ['id' => 'asap', 'label' => 'So schnell wie möglich'],
    ['id' => 'wochen', 'label' => 'In den nächsten Wochen'],
    ['id' => 'planung', 'label' => 'Noch in Planung'],
];
// topicFromParam(): exact id/label first, then the first matching keyword wins.
$keywords = [
    [['foto', 'video', 'shooting', 'film'], 'foto-video'],
    [['content', 'studio', 'reel'], 'content-studio'],
    [['social', 'instagram', 'tiktok'], 'social-media'],
    [['ads', 'performance', 'marketing', 'kampagne'], 'ads'],
    [['seo', 'suchmaschine'], 'seo'],
    [['web', 'shop', 'commerce', 'landing'], 'website'],
    [['brand', 'logo', 'design', 'print', 'druck'], 'branding'],
    [['software', 'support', 'entwicklung', 'app', 'portal'], 'software'],
];
$preselected = null;
if (isset($_GET['service']) && ($p = mb_strtolower(wp_unslash((string) $_GET['service']))) !== '') {
    $id = null;
    foreach ($topics as $t) if ($t['id'] === $p || mb_strtolower($t['label']) === $p) { $id = $t['id']; break; }
    if ($id === null) foreach ($keywords as [$words, $tid]) {
        foreach ($words as $w) if (str_contains($p, $w)) { $id = $tid; break 2; }
    }
    foreach ($topics as $t) if ($t['id'] === $id) { $preselected = $t; break; }
}
$step = $preselected ? 1 : 0;
$stepLabels = ['Thema', 'Vorhaben', 'Kontakt'];
$inputCls = 'w-full rounded border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors hover:border-ink/20 focus:border-mint focus:outline-none';
$headingCls = 'font-heading text-2xl font-black tracking-tight focus:outline-none md:text-3xl';
$arrow = fn(string $color, string $class = '') => '<svg width="12" height="12" viewBox="0 0 100 100" aria-hidden="true"' . ($class ? ' class="' . esc_attr($class) . '"' : '') . '><path d="' . NW_ARROW_PATH . '" fill="' . esc_attr($color) . '" transform="rotate(90 50 50)"/></svg>';
?>
<section class="pt-32 pb-20 md:pt-40 md:pb-28">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <header class="max-w-2xl">
      <h1 class="font-heading text-4xl font-black leading-[1.03] tracking-tight md:text-6xl">Lass uns loslegen.</h1>
      <p class="mt-5 max-w-md text-base leading-relaxed text-ink-3">Drei kurze Schritte, danach wissen wir genug für eine ehrliche Einschätzung. Kein Fragebogen, kein Verkaufsdruck.</p>
    </header>

    <div class="mt-16 grid gap-14 border-t border-line pt-12 lg:grid-cols-[minmax(0,58%)_minmax(0,42%)] lg:gap-20 md:mt-20">
      <!-- Anfrage-Dialog (InquiryFlow) -->
      <div data-inquiry data-step="<?php echo $step; ?>" data-topic="<?php echo esc_attr($preselected['id'] ?? ''); ?>" data-email="<?php echo esc_attr($site['email']); ?>" data-whatsapp="<?php echo esc_attr($site['whatsappNumber']); ?>">
        <p aria-live="polite" data-progress class="font-heading text-xs font-bold uppercase tracking-[0.25em] text-ink-3">Schritt <?php echo $step + 1; ?> von 3: <?php echo $stepLabels[$step]; ?></p>
        <div class="mt-3 flex gap-1.5" aria-hidden="true">
          <?php foreach ($stepLabels as $i => $label): ?>
            <span data-bar class="h-0.5 flex-1 transition-colors duration-300 <?php echo $i <= $step ? 'bg-mint' : 'bg-ink/10'; ?>"></span>
          <?php endforeach; ?>
        </div>

        <form data-inquiry-form novalidate class="mt-8">
          <!-- ---------- Schritt 1: Thema ---------- -->
          <div class="nw-step" data-step-panel="0"<?php echo $step === 0 ? '' : ' hidden'; ?>>
            <div>
              <h2 tabindex="-1" data-step-heading class="<?php echo $headingCls; ?>">Wobei können wir helfen?</h2>
              <p class="mt-3 text-sm text-ink-3">Wähl das, was am ehesten passt. Alles Weitere klären wir im Gespräch.</p>
              <ul class="mt-7 grid gap-2 sm:grid-cols-2">
                <?php foreach ($topics as $t): ?>
                  <li>
                    <button type="button" data-topic-id="<?php echo esc_attr($t['id']); ?>" data-topic-label="<?php echo esc_attr($t['label']); ?>" data-topic-color="<?php echo esc_attr(NW_ARROW_COLORS[$t['accent']]); ?>" class="group flex w-full items-start gap-3 rounded border border-ink/10 bg-white px-4 py-4 text-left transition-colors hover:border-ink/35 hover:bg-ink/5">
                      <?php echo $arrow(NW_ARROW_COLORS[$t['accent']], 'mt-1.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1'); ?>
                      <span>
                        <span class="block font-heading text-base font-bold tracking-tight"><?php echo esc_html($t['label']); ?></span>
                        <span class="mt-0.5 block text-sm leading-snug text-ink-3"><?php echo esc_html($t['hint']); ?></span>
                      </span>
                    </button>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>
          </div>

          <!-- ---------- Schritt 2: Vorhaben ---------- -->
          <div class="nw-step" data-step-panel="1"<?php echo $step === 1 ? '' : ' hidden'; ?>>
            <div>
              <h2 tabindex="-1" data-step-heading class="<?php echo $headingCls; ?>">Was steht an?</h2>
              <p class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-3">
                <span class="inline-flex items-center gap-2 text-ink"><?php echo $arrow(NW_ARROW_COLORS[$preselected['accent'] ?? 'mint']); ?><span data-topic-name><?php echo esc_html($preselected['label'] ?? ''); ?></span></span>
                <button type="button" data-go="0" class="underline underline-offset-4 transition-colors hover:text-ink">ändern</button>
              </p>

              <div class="mt-7">
                <label for="message" class="mb-2 block text-sm font-medium">Zwei, drei Sätze genügen</label>
                <textarea id="message" name="message" required rows="5" class="<?php echo $inputCls; ?>" placeholder="Zum Beispiel: Wir bringen im Herbst eine neue Produktlinie raus und brauchen Fotos und Reels dafür."></textarea>
              </div>

              <fieldset class="mt-7">
                <legend class="mb-3 text-sm font-medium">Wann soll es losgehen? <span class="text-ink-3">(optional)</span></legend>
                <div class="flex flex-wrap gap-2">
                  <?php foreach ($timings as $t): ?>
                    <label data-timing class="cursor-pointer rounded border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-mint border-ink/10 text-ink-3 hover:border-ink/35">
                      <input type="radio" name="timing" value="<?php echo esc_attr($t['id']); ?>" data-timing-label="<?php echo esc_attr($t['label']); ?>" class="sr-only">
                      <?php echo esc_html($t['label']); ?>
                    </label>
                  <?php endforeach; ?>
                </div>
              </fieldset>

              <div class="mt-9 flex items-center gap-6">
                <button type="button" data-next class="group inline-flex items-center justify-center gap-2.5 rounded bg-ink px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:bg-paper-2">
                  Weiter
                  <?php echo $arrow('currentColor', 'transition-transform duration-200 group-hover:translate-x-1'); ?>
                </button>
                <button type="button" data-go="0" class="text-sm text-ink-3 underline underline-offset-4 transition-colors hover:text-ink">Zurück</button>
              </div>
            </div>
          </div>

          <!-- ---------- Schritt 3: Kontakt ---------- -->
          <div class="nw-step" data-step-panel="2"<?php echo $step === 2 ? '' : ' hidden'; ?>>
            <div>
              <h2 tabindex="-1" data-step-heading class="<?php echo $headingCls; ?>">Wie erreichen wir dich?</h2>
              <p class="mt-3 text-sm text-ink-3">Wir antworten innerhalb eines Werktags, mit einer ehrlichen Einschätzung, nicht mit einem Verkaufsgespräch.</p>

              <div class="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="name" class="mb-2 block text-sm font-medium">Name</label>
                  <input id="name" name="name" required autocomplete="name" class="<?php echo $inputCls; ?>" placeholder="Dein Name">
                </div>
                <div>
                  <label for="email" class="mb-2 block text-sm font-medium">E-Mail</label>
                  <input id="email" name="email" type="email" required autocomplete="email" class="<?php echo $inputCls; ?>" placeholder="du@unternehmen.de">
                </div>
                <div>
                  <label for="company" class="mb-2 block text-sm font-medium">Unternehmen <span class="text-ink-3">(optional)</span></label>
                  <input id="company" name="company" autocomplete="organization" class="<?php echo $inputCls; ?>" placeholder="Firma oder Marke">
                </div>
                <div>
                  <label for="phone" class="mb-2 block text-sm font-medium">Telefon <span class="text-ink-3">(optional)</span></label>
                  <input id="phone" name="phone" type="tel" autocomplete="tel" class="<?php echo $inputCls; ?>" placeholder="+49 …">
                </div>
              </div>

              <p class="mt-6 text-xs leading-relaxed text-ink-3">Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur Bearbeitung der Anfrage zu. Details in der <a href="<?php echo esc_url(nw_url('/datenschutz')); ?>" class="underline underline-offset-2 hover:text-ink">Datenschutzerklärung</a>.</p>

              <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="submit" class="group inline-flex items-center justify-center gap-2.5 rounded bg-ink px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:bg-paper-2">
                  Anfrage senden
                  <?php echo $arrow('currentColor', 'transition-transform duration-200 group-hover:translate-x-1'); ?>
                </button>
                <button type="button" data-whatsapp-submit class="text-sm text-whatsapp underline underline-offset-4 transition-colors hover:text-ink">Lieber per WhatsApp schicken</button>
                <button type="button" data-go="1" class="text-sm text-ink-3 underline underline-offset-4 transition-colors hover:text-ink">Zurück</button>
              </div>

              <p role="status" data-sent hidden class="mt-6 border-l-2 border-mint pl-4 text-sm leading-relaxed text-ink-3"><span data-sent-text></span> Klappt das nicht, erreichst du uns direkt unter <a href="mailto:<?php echo esc_attr($site['email']); ?>" class="text-ink underline underline-offset-2"><?php echo esc_html($site['email']); ?></a>.</p>
            </div>
          </div>
        </form>
      </div>

      <!-- Direkter Weg, bewusst schmal und ruhig -->
      <aside>
        <h2 class="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">Lieber direkt?</h2>
        <ul class="mt-6 divide-y divide-line border-y border-line text-sm">
          <li>
            <a href="<?php echo esc_url(nw_whatsapp_href($site['defaultWhatsappText'])); ?>" target="_blank" rel="noopener noreferrer" class="group flex items-baseline justify-between gap-4 py-4 transition-colors">
              <span class="font-heading font-bold text-whatsapp">WhatsApp</span>
              <span class="text-right text-ink-3 transition-colors group-hover:text-ink">Meist Antwort am selben Tag</span>
            </a>
          </li>
          <li>
            <a href="mailto:<?php echo esc_attr($site['email']); ?>" class="group flex items-baseline justify-between gap-4 py-4 transition-colors">
              <span class="font-heading font-bold">E-Mail</span>
              <span class="text-right text-ink-3 transition-colors group-hover:text-ink"><?php echo esc_html($site['email']); ?></span>
            </a>
          </li>
          <li>
            <a href="<?php echo esc_attr($site['phoneHref']); ?>" class="group flex items-baseline justify-between gap-4 py-4 transition-colors">
              <span class="font-heading font-bold">Telefon</span>
              <span class="text-right text-ink-3 transition-colors group-hover:text-ink"><?php echo esc_html($site['phone']); ?></span>
            </a>
          </li>
          <li class="flex items-baseline justify-between gap-4 py-4">
            <span class="font-heading font-bold">Studio</span>
            <span class="text-right text-ink-3"><?php echo esc_html($site['city']); ?>, <?php echo esc_html($site['country']); ?></span>
          </li>
        </ul>

        <div id="termin" class="mt-12 scroll-mt-32">
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.2em] text-ink">Erstgespräch</h2>
          <p class="mt-4 text-sm leading-relaxed text-ink-3">20-30 Minuten per Video-Call oder Telefon. Wir hören zu, ordnen ein und sagen dir, was sich lohnt und was nicht. Kostenlos.</p>
          <a href="<?php echo esc_url($site['calendlyUrl']); ?>" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center justify-center gap-2.5 rounded border border-ink/20 px-7 py-3.5 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:border-ink/60 hover:bg-ink/5">Erstgespräch buchen</a>
          <p class="mt-4 text-xs leading-relaxed text-ink-3">Passt kein Termin? Schick uns zwei Wunschzeiten per WhatsApp, wir bestätigen den passenden.</p>
        </div>
      </aside>
    </div>
  </div>
</section>
<?php get_footer();
