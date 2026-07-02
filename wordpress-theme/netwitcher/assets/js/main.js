/**
 * Netwitcher Theme – Interaktionen & Animationen (Vanilla JS, ohne Abhängigkeiten).
 * Alle Bewegungen respektieren prefers-reduced-motion.
 */
(function () {
	"use strict";

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	/* Sticky-Header */
	var header = document.getElementById("nw-header");
	if (header) {
		var onScrollHeader = function () {
			header.classList.toggle("is-scrolled", window.scrollY > 24);
		};
		onScrollHeader();
		window.addEventListener("scroll", onScrollHeader, { passive: true });
	}

	/* Mobile-Menü */
	var burger = document.getElementById("nw-burger");
	var mobilenav = document.getElementById("nw-mobilenav");
	if (burger && mobilenav) {
		burger.addEventListener("click", function () {
			var open = mobilenav.classList.toggle("is-open");
			burger.setAttribute("aria-expanded", open ? "true" : "false");
			burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
		});
	}

	/* Scroll-Reveal */
	var revealEls = document.querySelectorAll(".nw-reveal");
	if (reduceMotion || !("IntersectionObserver" in window)) {
		revealEls.forEach(function (el) {
			el.classList.add("is-visible");
		});
	} else {
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						io.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: "-60px 0px" }
		);
		revealEls.forEach(function (el, i) {
			el.style.setProperty("--delay", ((i % 3) * 0.08).toFixed(2) + "s");
			io.observe(el);
		});
	}

	/* Hero-Video: einblenden, wenn abspielbar; bei Fehler unsichtbar lassen */
	var heroVideo = document.querySelector(".nw-hero-bg video");
	if (heroVideo) {
		if (reduceMotion) {
			heroVideo.removeAttribute("autoplay");
			heroVideo.pause();
		} else {
			heroVideo.addEventListener("canplay", function () {
				heroVideo.classList.add("is-ready");
			});
			heroVideo.addEventListener("error", function () {
				heroVideo.remove();
			});
		}
	}

	/* Hero-Pfeile: Maus-Parallax */
	var heroArrows = document.querySelector(".nw-hero-arrows");
	if (heroArrows && !reduceMotion) {
		var items = heroArrows.querySelectorAll(".nw-arrow-item");
		var targetX = 0,
			targetY = 0,
			curX = 0,
			curY = 0,
			rafId = null;

		var tick = function () {
			curX += (targetX - curX) * 0.08;
			curY += (targetY - curY) * 0.08;
			items.forEach(function (item, i) {
				var f = (0.025 + i * 0.011) * 100;
				item.style.translate = curX * f + "px " + curY * f + "px";
			});
			if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
				rafId = requestAnimationFrame(tick);
			} else {
				rafId = null;
			}
		};
		var kick = function () {
			if (!rafId) {
				rafId = requestAnimationFrame(tick);
			}
		};

		heroArrows.addEventListener("mousemove", function (e) {
			var rect = heroArrows.getBoundingClientRect();
			targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
			kick();
		});
		heroArrows.addEventListener("mouseleave", function () {
			targetX = 0;
			targetY = 0;
			kick();
		});
	}

	/* Stern-Assembly: Pfeile setzen sich beim Scrollen zum Logo-Stern zusammen */
	var assembly = document.getElementById("nw-assembly");
	if (assembly) {
		var arrows = assembly.querySelectorAll(".nw-assembly-arrow");
		var exploded = [
			{ x: -220, y: -160, r: -80 },
			{ x: 240, y: -120, r: 95 },
			{ x: 260, y: 140, r: -60 },
			{ x: -40, y: 220, r: 120 },
			{ x: -260, y: 90, r: 70 },
		];

		var apply = function (p) {
			arrows.forEach(function (arrow, i) {
				var angle = ((i * 72 - 90) * Math.PI) / 180;
				var sx = Math.cos(angle) * 62;
				var sy = Math.sin(angle) * 62;
				var e = exploded[i];
				var x = e.x + (sx - e.x) * p;
				var y = e.y + (sy - e.y) * p;
				var r = i * 72 + e.r * (1 - p);
				var o = 0.25 + 0.75 * Math.min(1, p * 3);
				arrow.style.transform = "translate(" + x + "px," + y + "px) rotate(" + r + "deg)";
				arrow.style.opacity = o;
			});
			assembly.classList.toggle("is-complete", p > 0.85);
		};

		if (reduceMotion) {
			apply(1);
		} else {
			var onScrollAssembly = function () {
				var rect = assembly.getBoundingClientRect();
				var vh = window.innerHeight;
				// 0 = Sektion betritt den Viewport unten, 1 = Zentrum erreicht
				var p = (vh * 0.85 - rect.top) / (vh * 0.85 - vh * 0.45 + rect.height / 2);
				apply(Math.max(0, Math.min(1, p)));
			};
			onScrollAssembly();
			window.addEventListener("scroll", onScrollAssembly, { passive: true });
			window.addEventListener("resize", onScrollAssembly);
		}
	}

	/* Kontaktformular: Service aus ?service= vorauswählen + mailto-Fallback */
	var form = document.getElementById("nw-contact-form");
	if (form) {
		var select = form.querySelector("select[name='service']");
		var param = new URLSearchParams(window.location.search).get("service");
		if (select && param) {
			var p = param.toLowerCase();
			Array.prototype.some.call(select.options, function (opt) {
				if (opt.value && (opt.value.toLowerCase() === p || p.indexOf(opt.value.toLowerCase()) !== -1)) {
					select.value = opt.value;
					return true;
				}
				return false;
			});
		}

		form.addEventListener("submit", function (e) {
			e.preventDefault();
			var data = new FormData(form);
			var subject = "Anfrage: " + (data.get("service") || "Allgemein") + " – " + data.get("name");
			var body = [
				"Name: " + data.get("name"),
				"Unternehmen: " + (data.get("company") || "-"),
				"E-Mail: " + data.get("email"),
				"Telefon: " + (data.get("phone") || "-"),
				"Leistung: " + (data.get("service") || "-"),
				"",
				data.get("message"),
			].join("\n");
			var email = (window.nwConfig && window.nwConfig.email) || "info@netwitcher.de";
			window.location.href =
				"mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
			var status = document.getElementById("nw-form-status");
			if (status) {
				status.hidden = false;
			}
		});
	}
})();
