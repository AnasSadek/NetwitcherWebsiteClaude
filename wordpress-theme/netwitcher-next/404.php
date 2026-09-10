<?php /** app/not-found.tsx */ get_header(); status_header(404); ?>
<section class="flex min-h-[80vh] items-center justify-center pt-24">
  <div class="mx-auto max-w-xl px-4 text-center sm:px-6">
    <?php echo nw_star(72, 'mx-auto mb-8'); ?>
    <h1 class="font-heading text-5xl font-extrabold tracking-tight">404</h1>
    <p class="mt-4 text-lg font-bold">Diese Seite hat sich entzaubert.</p>
    <p class="mt-3 text-sm leading-relaxed text-ink-3">Die gesuchte Seite existiert nicht (mehr). Aber keine Sorge, die Magie findest du auf der Startseite oder in unseren Leistungen.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4"><?php echo nw_button('/', 'Zur Startseite') . nw_button('/leistungen', 'Leistungen ansehen', 'ghost'); ?></div>
  </div>
</section>
<?php get_footer();
