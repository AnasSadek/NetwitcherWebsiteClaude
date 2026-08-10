"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandStar, BrandWordmark } from "./brand/Logo";
import { leistungenServices } from "@/lib/services";
import { ARROW_PATH } from "./arrows";

const navItems = [
  { href: "/leistungen", label: "Leistungen", dropdown: true },
  { href: "/studio", label: "Studio" },
  { href: "/projekte", label: "Projekte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Sentinel statt Scroll-Listener: der Beobachter feuert nur beim Übertritt,
  // nicht bei jedem Scroll-Frame.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:24px;height:1px;width:1px;";
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-night/85 py-2 backdrop-blur-xl"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Netwitcher, Startseite"
        >
          <BrandStar
            size={38}
            className="transition-transform duration-500 group-hover:rotate-[36deg]"
          />
          <BrandWordmark height={14} className="text-snow" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
          {navItems.map((item) =>
            item.dropdown ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  aria-expanded={servicesOpen}
                  onFocus={() => setServicesOpen(true)}
                  className={`rounded px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    pathname.startsWith("/leistungen")
                      ? "text-snow"
                      : "text-mist hover:text-snow"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    <svg width="9" height="9" viewBox="0 0 100 100" aria-hidden="true" className="opacity-70">
                      <path d={ARROW_PATH} fill="currentColor" transform="rotate(180 50 50)" />
                    </svg>
                  </span>
                </Link>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
                    >
                      <div className="rounded border border-line bg-night-800/95 p-2 shadow-2xl backdrop-blur-xl">
                        <Link
                          href="/studio"
                          className="block rounded px-4 py-2.5 text-sm font-semibold text-pink transition-colors hover:bg-white/5"
                        >
                          Content Creation & Studio Berlin
                        </Link>
                        {leistungenServices.map((s) => (
                          <Link
                            key={s.slug}
                            href={s.href}
                            className="block rounded px-4 py-2.5 text-sm text-mist transition-colors hover:bg-white/5 hover:text-snow"
                          >
                            {s.navTitle}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-snow" : "text-mist hover:text-snow"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/kontakt"
            className="hidden rounded bg-snow px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-night transition-colors duration-200 hover:bg-white sm:inline-flex"
          >
            Projekt starten
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded border border-line lg:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-snow transition-transform ${
                mobileOpen ? "translate-y-1 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-snow transition-transform ${
                mobileOpen ? "-translate-y-1 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            aria-label="Mobile Navigation"
            className="overflow-hidden border-t border-line bg-night/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded px-4 py-3 text-base font-medium text-mist transition-colors hover:bg-white/5 hover:text-snow"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/kontakt"
                className="mt-3 block rounded bg-snow px-5 py-3 text-center font-heading text-sm font-bold text-night"
              >
                Projekt starten
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
