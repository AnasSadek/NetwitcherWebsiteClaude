<?php
/**
 * Hero (components/mascot/Hero.tsx + HeroStage.tsx). Markup and classes are
 * identical to the React tree; the motion values are driven by src/js/hero.js.
 */
$m = nw_headturn_manifest();
$cardCls = 'pointer-events-auto block rounded-card bg-white/10 p-5 backdrop-blur-md transition-colors duration-200 hover:bg-white/15';
?>
<section class="bg-paper pt-20 md:pt-24" aria-label="Netwitcher, Digital Agency Berlin">
  <div class="mx-auto w-full max-w-[1560px] px-4 pb-10 sm:px-6 lg:pb-14">
    <div class="relative">
      <div class="relative z-10 mx-auto mb-6 max-w-xl text-center lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20 lg:mx-0 lg:mb-0 lg:flex lg:max-w-none lg:items-center lg:text-left">
        <div class="lg:max-w-xl lg:pl-12 xl:pl-16">
          <p class="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-ink-3 lg:text-white/70">Digital Agency · Berlin</p>
          <h1 class="mt-4 font-boxi text-[9.5vw] leading-[1.05] text-ink sm:text-5xl lg:mt-5 lg:text-[3.1rem] lg:text-white xl:text-[3.7rem]">WIR MACHEN<br><span class="bg-clip-text text-transparent brand-sweep">MAGIE</span> AUS<br>DEINER MARKE.</h1>
          <p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-2 sm:text-lg lg:mx-0 lg:mt-5 lg:max-w-sm lg:text-white/75">Content, Kampagnen, Websites und Software aus einem Team. Magic in Every Click.</p>
          <div class="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-8 lg:justify-start">
            <?php echo nw_button('/kontakt', 'Projekt starten', 'primary', 'lg:!bg-white lg:!text-ink lg:hover:!bg-paper-2'); ?>
            <?php echo nw_button('/leistungen', 'Was wir können', 'ghost', 'lg:!border-white/25 lg:!text-white lg:hover:!border-white/60 lg:hover:!bg-white/10'); ?>
          </div>
        </div>
      </div>

      <div class="nw-hero is-asleep relative overflow-hidden rounded-[32px] bg-deep shadow-lift md:rounded-[40px]" data-hero data-headturn-base="<?php echo esc_url(nw_asset('mascot/headturn')); ?>">
        <script type="application/json" data-headturn-manifest><?php echo wp_json_encode($m); ?></script>
        <div aria-hidden="true" class="absolute inset-0" data-witch="glow"></div>

        <div data-witch="char" class="witch-stage @container relative mx-auto aspect-[4/5] w-full max-w-[560px] [perspective:1000px] sm:max-w-[640px] lg:aspect-[16/9] lg:max-w-none">
          <div class="h-full w-full motion-safe:animate-float">
            <div class="h-full w-full" data-witch="body">
              <div class="relative h-full w-full will-change-transform" data-witch="pose">
                <div class="h-full w-full">
                  <picture>
                    <source media="(min-width: 1024px)" type="image/avif" srcset="<?php echo esc_url(nw_asset('mascot/witch-wide.avif')); ?>">
                    <source media="(min-width: 1024px)" srcset="<?php echo esc_url(nw_asset('mascot/witch-wide.webp')); ?>">
                    <source type="image/avif" srcset="<?php echo esc_url(nw_asset('mascot/witch-portrait.avif')); ?>">
                    <img src="<?php echo esc_url(nw_asset('mascot/witch-portrait.webp')); ?>" alt="WITCH, das Netwitcher-Maskottchen: eine Figur mit Kamera-Kopf im lila Hoodie" class="h-full w-full object-cover" fetchpriority="high" width="1600" height="900">
                  </picture>
                </div>

                <canvas data-witch="headturn" aria-hidden="true" class="pointer-events-none absolute" hidden style="left:<?php echo $m['crop']['x'] * 100; ?>%;top:<?php echo $m['crop']['y'] * 100; ?>%;width:<?php echo $m['crop']['w'] * 100; ?>%;height:<?php echo $m['crop']['h'] * 100; ?>%"></canvas>

                <div data-witch="eye" class="absolute will-change-transform" style="left:var(--eye-x);top:var(--eye-y);width:var(--eye-s);margin-left:calc(var(--eye-s) / -2);margin-top:calc(var(--eye-s) / -2)">
                  <div aria-hidden="true" data-witch="focus" class="absolute -inset-[35%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.85),rgba(139,92,246,0)_65%)]" style="opacity:0"></div>
                  <div aria-hidden="true" data-witch="ignite" class="absolute -inset-[45%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),rgba(139,92,246,0.7)_35%,rgba(139,92,246,0)_65%)]"></div>
                  <div data-witch="iris" class="relative">
                    <div data-witch="star"><?php echo nw_star(999, 'h-auto w-full [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.55))_drop-shadow(0_0_18px_rgba(139,92,246,0.9))]'); ?></div>
                  </div>
                  <div aria-hidden="true" data-witch="glint" class="pointer-events-none absolute left-[18%] top-[14%] h-[22%] w-[22%] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.95),rgba(255,255,255,0)_70%)]" style="opacity:.25"></div>
                </div>

                <div aria-hidden="true" data-witch="sparks" class="pointer-events-none absolute" style="left:var(--eye-x);top:var(--eye-y)"></div>

                <button type="button" data-witch="trigger" aria-label="WITCH macht ein Foto" class="absolute inset-0 z-10 cursor-pointer rounded-[32px] focus-visible:outline-offset-[-6px] md:rounded-[40px]"></button>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true" data-witch="flash" class="pointer-events-none absolute inset-0 z-[15] bg-white"></div>

        <div class="pointer-events-none absolute inset-y-0 right-10 z-20 hidden w-[300px] flex-col justify-center gap-4 lg:flex xl:right-14">
          <?php foreach ([
              ['/studio', 'pink', 'Content & Studio', 'Foto, Video und Reels aus dem Studio Berlin', 1],
              ['/leistungen/performance-marketing', 'sky', 'Social & Ads', 'Meta, TikTok und Google, organisch und bezahlt', 2],
          ] as [$href, $color, $title, $text, $n]): ?>
          <div data-witch="card<?php echo $n; ?>"><div data-magnet-wrap>
            <a href="<?php echo esc_url(nw_url($href)); ?>" data-magnet class="<?php echo $cardCls; ?>">
              <?php echo nw_arrow($color, 22); ?>
              <p class="mt-3 font-heading text-base font-extrabold text-white"><?php echo esc_html($title); ?></p>
              <p class="mt-1 text-sm leading-snug text-white/65"><?php echo esc_html($text); ?></p>
              <span class="mt-3 inline-flex rounded-full bg-white px-3.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-ink">Go</span>
            </a>
          </div></div>
          <?php endforeach; ?>
        </div>

        <div data-witch="name" class="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-full bg-white/10 px-4 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm lg:bottom-6">
          <span data-main>Witch · Head of Attention</span><span data-alt aria-hidden="true">✦ Magic in Every Click</span>
        </div>
      </div>
    </div>
  </div>
</section>
