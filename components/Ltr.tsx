/**
 * Isoliert lateinische/technische Einschübe (Gesetzeszitate, E-Mail-Adressen,
 * URLs, Telefonnummern, Firmennamen) in arabischem RTL-Fließtext. Der
 * `dir`-Attributwert löst laut HTML-Spezifikation `unicode-bidi: isolate`
 * aus, sodass die Zeichenfolge intern stets in ihrer eigenen Reihenfolge
 * dargestellt wird, unabhängig vom umgebenden RTL-Kontext.
 */
export function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr">{children}</span>;
}
