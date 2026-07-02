import { whatsappHref, defaultWhatsappText } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref(defaultWhatsappText)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Per WhatsApp schreiben"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-[0_8px_30px_rgba(37,211,102,.35)] transition-transform duration-200 hover:scale-110 motion-reduce:hover:scale-100"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-whatsapp/60 animate-pulse-ring motion-reduce:hidden"
      />
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="#06060F"
        aria-hidden="true"
        className="relative"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.83 14.12c-.25.7-1.45 1.33-2.02 1.42-.52.08-1.17.11-1.88-.12-.44-.14-.99-.32-1.7-.63-3-1.29-4.95-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.08 0-1.47.77-2.19 1.04-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.07 1.32 2.37 1.47.3.15.47.12.64-.07.17-.2.74-.86.93-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.42Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-line bg-night-800 px-4 py-2 text-xs font-medium text-snow opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">
        Direkt per WhatsApp schreiben
      </span>
    </a>
  );
}
