"use client";

import { useLayoutEffect } from "react";

/**
 * Schaltet <html> für die Dauer der Portfolio-Routen auf die dunkle Bühne,
 * damit auch Overscroll- und Ladeflächen nicht papierweiß aufblitzen.
 */
export function DarkStage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-stage", "dark");
    return () => root.removeAttribute("data-stage");
  }, []);
  return null;
}
