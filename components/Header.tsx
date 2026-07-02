"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { StarMark } from "./arrows";
import { leistungenServices } from "@/lib/services";

const navItems = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen", dropdown: true },
  { href: "/studio", label: "Studio" },
  { href: "/projekte", label: "Projekte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          aria-label="Netwitcher – Startseite"
        >
          <StarMark
            size={38}
            className="transition-transform duration-500 group-hover:rotate-[36deg]"
          />
          <span className="font-heading text-lg font-extrabold tracking-wider text-snow">
            NETWITCHER
          </span>
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
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith("/leistungen")
                      ? "text-snow"
                      : "text-mist hover:text-snow"
                  }`}
                >
                  {item.label} <span aria-hidden="true">▾</span>
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
                      <div className="rounded-2xl border border-line bg-night-800/95 p-2 shadow-2xl backdrop-blur-xl">
                        <Link
                          href="/studio"
                          className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-pink transition-colors hover:bg-white/5"
                        >
                          Content Creation & Studio Berlin
                        </Link>
                        {leistungenServices.map((s) => (
                          <Link
                            key={s.slug}
                            href={s.href}
                            className="block rounded-xl px-4 py-2.5 text-sm text-mist transition-colors hover:bg-white/5 hover:text-snow"
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
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
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
            className="hidden rounded-full bg-gradient-to-r from-violet to-sky px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-night shadow-glow-violet transition-all duration-200 hover:-translate-y-0.5 sm:inline-flex"
          >
            Kostenloses Erstgespräch
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line lg:hidden"
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
                  className="block rounded-xl px-4 py-3 text-base font-medium text-mist transition-colors hover:bg-white/5 hover:text-snow"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/kontakt"
                className="mt-3 block rounded-full bg-gradient-to-r from-violet to-sky px-5 py-3 text-center font-heading text-sm font-bold text-night"
              >
                Kostenloses Erstgespräch
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
