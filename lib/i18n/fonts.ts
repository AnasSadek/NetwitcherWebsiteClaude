import { Cairo, Tajawal } from "next/font/google";

/* Arabische Pendants zu EP Boxi/Oxanium (Überschriften) und Nunito Sans
 * (Fliesstext) — siehe app/globals.css [dir="rtl"] für die Zuordnung. */
export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});
