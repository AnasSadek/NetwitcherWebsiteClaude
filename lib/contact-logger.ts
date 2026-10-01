/**
 * Diagnose-Logger fürs Kontaktformular: schreibt JEDE Zeile sowohl nach
 * console.log/error (wie bisher) ALS AUCH an eine Log-Datei, weil Plesk/
 * Phusion Passenger stdout/stderr von Node-Apps nicht zuverlässig im Log
 * Browser anzeigt. Eine Zeile, zwei Ziele, ein Zeitstempel.
 *
 * Standardpfad liegt bewusst im Arbeitsverzeichnis der App
 * (process.cwd()) statt unter /tmp: Passenger sandboxt /tmp oft pro App in
 * einem eigenen Mount-Namespace, der im Plesk File Manager (der nur den
 * tatsächlichen vHost-Ordnerbaum zeigt) gar nicht sichtbar ist. cwd() ist
 * exakt der App-Root, den Plesk für die Node-App konfiguriert hat — also
 * derselbe Ordner, den der File Manager für die Domain anzeigt.
 *
 * WICHTIG:
 * - Nur ein TEMPORÄRES Diagnose-Hilfsmittel. Sobald der Graph-Versand wieder
 *   funktioniert, diese Datei auf dem Server löschen (sie liegt im App-Root,
 *   ggf. auch über die Domain erreichbar, falls der Webserver .log-Dateien
 *   nicht blockt — enthält aber nie Secrets/PII, siehe unten).
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
import { join } from "node:path";

/** Überschreibbar per Env (absoluter oder relativer Pfad). Standard: eine
 *  Datei direkt im App-Arbeitsverzeichnis, das Plesk File Manager für die
 *  Domain anzeigt — siehe Begründung oben. */
const LOG_FILE = process.env.CONTACT_LOG_FILE?.trim() || join(process.cwd(), "contact-debug.log");

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
