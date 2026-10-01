/**
 * Diagnose-Logger fürs Kontaktformular: schreibt JEDE Zeile sowohl nach
 * console.log/error (wie bisher) ALS AUCH an eine Log-Datei, weil Plesk/
 * Phusion Passenger stdout/stderr von Node-Apps nicht zuverlässig im Log
 * Browser anzeigt. Eine Zeile, zwei Ziele, ein Zeitstempel.
 *
 * WICHTIG:
 * - Datei-Schreibzugriff ist immer in try/catch gekapselt — ein
 *   Dateisystemfehler (z. B. kein Schreibrecht) darf die Contact-API
 *   niemals zum Absturz bringen, siehe writeToFile().
 * - Nur serverseitig verwenden (node:fs) — niemals aus einer
 *   "use client"-Komponente importieren.
 * - Niemals Secrets übergeben: Aufrufer (route.ts/graph-mailer.ts) dürfen
 *   hier nur bereits sichere Werte hineinreichen (Status-Codes, von Azure/
 *   Graph gelieferte Fehlercode/-Nachricht, Booleans) — dieser Logger prüft
 *   das nicht selbst, er loggt wortwörtlich, was er bekommt.
 */

import { appendFileSync } from "node:fs";

/** Überschreibbar per Env, falls /tmp in der jeweiligen Plesk-Umgebung
 *  nicht nutzbar sein sollte. Standard: /tmp/netwitcher-contact.log. */
const LOG_FILE = process.env.CONTACT_LOG_FILE?.trim() || "/tmp/netwitcher-contact.log";

function writeToFile(line: string): void {
  try {
    appendFileSync(LOG_FILE, `${line}\n`);
  } catch {
    // Datei nicht schreibbar/vorhanden o. Ä. — bewusst stillschweigend
    // ignoriert, console.log/error oben hat die Zeile bereits ausgegeben.
  }
}

function formatLine(message: string): string {
  return `[${new Date().toISOString()}] ${message}`;
}

/** Normale Diagnose-Zeile (console.log + Datei). */
export function logContact(message: string): void {
  const line = formatLine(message);
  console.log(line);
  writeToFile(line);
}

/** Fehler-Diagnose-Zeile (console.error + Datei, gleiches Format). */
export function logContactError(message: string): void {
  const line = formatLine(message);
  console.error(line);
  writeToFile(line);
}
