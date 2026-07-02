import { ARROW_COLORS, ARROW_PATH, STAR_ORDER } from "./arrows";
import { Reveal } from "./Reveal";

const steps = [
  {
    title: "Erstgespräch",
    text: "Wir verstehen dein Unternehmen, deine Zielgruppe und dein Ziel – kostenlos und ohne Verpflichtung.",
  },
  {
    title: "Strategie",
    text: "Wir entwickeln eine klare Content- und Marketingrichtung: Botschaften, Formate, Kanäle, Prioritäten.",
  },
  {
    title: "Produktion",
    text: "Wir produzieren Fotos, Videos, Reels, Designs und Landingpages – im Studio Berlin oder bei dir vor Ort.",
  },
  {
    title: "Kampagnen",
    text: "Wir bringen den Content live: über Social Media, Ads, SEO oder deine Website – messbar eingerichtet.",
  },
  {
    title: "Optimierung",
    text: "Wir analysieren Ergebnisse, verstärken, was funktioniert, und verbessern kontinuierlich weiter.",
  },
];

export function ProcessSteps() {
  return (
    <ol className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-5">
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-mint via-violet to-pink opacity-40 md:block"
      />
      {steps.map((step, i) => {
        const color = STAR_ORDER[i];
        return (
          <Reveal as="li" key={step.title} delay={i * 0.1} className="relative">
            <div className="flex items-center gap-4 md:flex-col md:items-start">
              <span
                className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-night-700"
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 100 100">
                  <path d={ARROW_PATH} fill={ARROW_COLORS[color]} transform={`rotate(${i * 72} 50 50)`} />
                </svg>
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-night-600 font-heading text-[11px] font-bold text-snow">
                  {i + 1}
                </span>
              </span>
              <div>
                <h3 className="font-heading text-base font-bold md:mt-4">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
