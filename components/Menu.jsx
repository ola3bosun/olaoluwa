"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Menu({ isOpen, toggleMenu, settings }) {
  const pathname = usePathname();
  const menuRef = useRef(null);
  const ghostRef = useRef(null);
  const tlRef = useRef(null);
  const imgRefs = useRef([]);

  const [localTime, setLocalTime] = useState("...");

  const emailText = settings?.email || "DIYAOLAOLUWA@GMAIL.COM";
  const locationText = settings?.location || "IBADAN / LOS";

  const menuLinks = [
    {
      title: "Works",
      href: "/gallery",
      category: "Archive",
      num: "01",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400",
      hoverText: "Proof I actually finish things.",
    },
    {
      title: "About Me",
      href: "/about",
      category: "Information",
      num: "02",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400",
      hoverText: "Who I am when I'm not arguing with contractors.",
    },
    {
      title: "Shop",
      href: "/shop",
      category: "Commerce",
      num: "03",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400",
      hoverText: "Things I created that you can actually take home.",
    },
    {
      title: "Inquire",
      href: "/contact",
      category: "Information",
      num: "04",
      image:
        "https://images.unsplash.com/photo-1541881430009-4ee7b2c70036?q=80&w=1400",
      hoverText: "Please be nice — I haven't slept in days.",
    },
  ];

  // ─── LIVE CLOCK ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () =>
      setLocalTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ─── ESCAPE KEY ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) toggleMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, toggleMenu]);

  // ─── MASTER ANIMATION ENGINE ─────────────────────────────────────────────────
  // Rebuilds on every pathname change so the timeline always targets the
  // current <main> element — Next.js replaces it on each navigation.
  useGSAP(
    () => {
      const main = document.querySelector("main");
      if (!main || !menuRef.current) return;

      // Scoped selector — all string queries stay inside menuRef
      const sel = gsap.utils.selector(menuRef.current);

      // Re-enforce hidden state on every rebuild (covers the remount flash)
      gsap.set(sel(".menu-link"), { x: -36, opacity: 0 });
      gsap.set(sel(".menu-meta"), { y: 14, opacity: 0 });
      imgRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0 });
      });

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: "(min-width: 769px)", isMobile: "(max-width: 768px)" },
        (context) => {
          const { isDesktop } = context.conditions;

          // Only set transformOrigin here — zIndex/position are applied in onStart
          // so they never pollute <main> while the menu is closed.
          gsap.set(ghostRef.current, {
            transformOrigin: isDesktop ? "100% 50%" : "50% 50%",
          });

          tlRef.current = gsap
            .timeline({
              paused: true,
              onStart: () => {
                document.body.style.overflow = "hidden";
                // Apply stacking context to the CURRENT <main> at open time,
                // not on mount — avoids layout side-effects on closed pages.
                const m = document.querySelector("main");
                if (m) {
                  gsap.set(m, {
                    transformOrigin: isDesktop ? "100% 50%" : "50% 50%",
                    zIndex: 10,
                    position: "relative",
                  });
                }
              },
              // When fully reversed: restore scroll, clear inline transforms from main,
              // and guarantee all preview images are hidden for the next open.
              onReverseComplete: () => {
                document.body.style.overflow = "";
                const m = document.querySelector("main");
                if (m) gsap.set(m, { clearProps: "all" });
                imgRefs.current.forEach((el) => {
                  if (el) gsap.set(el, { opacity: 0 });
                });
              },
            })
            // 1. Push main content right (desktop) / scale + dim (mobile)
            // main is queried fresh here so the tween always targets the live node.
            .to(
              [document.querySelector("main"), ghostRef.current].filter(
                Boolean,
              ),
              {
                x: isDesktop ? "62vw" : 0,
                scale: isDesktop ? 0.85 : 0.87,
                opacity: isDesktop ? 1 : 0.04,
                borderRadius: isDesktop ? "20px" : "14px",
                boxShadow: isDesktop ? "-40px 0 120px rgba(0,0,0,0.9)" : "none",
                duration: 0.9,
                ease: "expo.inOut",
              },
            )
            // 2. Stagger nav links in from the left
            .to(
              sel(".menu-link"),
              {
                x: 0,
                opacity: 1,
                stagger: 0.07,
                duration: 0.6,
                ease: "power3.out",
              },
              "-=0.55",
            )
            // 3. Footer meta fades + rises into view
            .to(
              sel(".menu-meta"),
              { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
              "-=0.4",
            );

          // Context cleanup fires when matchMedia condition changes (e.g. viewport resize)
          return () => {
            tlRef.current?.kill();
            tlRef.current = null;
          };
        },
      );

      return () => {
        mm.revert();
        const m = document.querySelector("main");
        if (m) gsap.set(m, { clearProps: "all" });
      };
    },
    { dependencies: [pathname] },
  ); // Rebuild on navigation so <main> ref is always current

  // ─── PLAY / REVERSE ──────────────────────────────────────────────────────────
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (isOpen) tl.play();
    else tl.reverse();
  }, [isOpen]);

  // ─── IMAGE CROSSFADE ENGINE (GSAP, not CSS + React state) ────────────────────
  const handleLinkEnter = (idx) => {
    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === idx ? 1 : 0,
        duration: i === idx ? 0.55 : 0.25,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    });
  };

  const handleLinkLeave = () => {
    imgRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        overwrite: "auto",
      });
    });
  };

  // ─── NAVIGATION ──────────────────────────────────────────────────────────────
  // Close the menu first, then hand off to the page transition system.
  // The 600ms delay lets the close animation begin before the transition panel drops.
  const handleNavigation = (e, href) => {
    e.preventDefault();
    if (pathname === href) {
      toggleMenu();
      return;
    }
    toggleMenu();
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("trigger-transition", { detail: href }),
      );
    }, 600);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* DARK FOUNDATION — rendered at -z-10, always behind everything */}
      <div className="fixed inset-0 -z-10 bg-neutral-900 pointer-events-none" />

      {/* MENU SHELL — z-50, transparent, pointer-events gated by isOpen */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-50 font-mono text-[#E5E5E5] overflow-hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Click-outside backdrop — only wired up when menu is open */}
        {isOpen && (
          <div
            className="absolute inset-0 z-0 cursor-pointer"
            onClick={toggleMenu}
          />
        )}

        {/* ── LEFT NAV PANEL ─────────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-30 flex flex-col px-8 md:px-14 pt-[14vh] pb-8 md:py-24 w-full md:w-[62vw] pointer-events-none">
          {/* Subtle left-edge accent line */}
          <div className="absolute left-0 top-[10vh] bottom-[8vh] w-px bg-white/10 hidden md:block" />

          {/* NAV LINKS */}
          <div className="flex flex-col gap-5 md:gap-7 w-full flex-1 overflow-hidden pointer-events-auto">
            {menuLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  onMouseEnter={() => handleLinkEnter(idx)}
                  onMouseLeave={handleLinkLeave}
                  className="menu-link group flex flex-col items-start w-fit cursor-pointer relative shrink-0 opacity-0"
                >
                  {/* Meta row: number + category + active indicator */}
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-[9px] tracking-[0.25em] opacity-25 group-hover:opacity-60 transition-opacity duration-300">
                      {link.num}
                    </span>
                    <span
                      className={`text-[9px] tracking-[0.2em] uppercase transition-opacity duration-300 ${
                        isActive
                          ? "opacity-60"
                          : "opacity-25 group-hover:opacity-60"
                      }`}
                    >
                      [ {link.category} ]
                    </span>
                    {isActive && (
                      <span className="text-[9px] tracking-[0.2em] uppercase opacity-40 italic">
                        ← here
                      </span>
                    )}
                  </div>

                  {/* Title + slide-in underline */}
                  <div className="relative">
                    <span
                      className={`font-sans font-black text-5xl md:text-[5.5rem] uppercase tracking-tighter leading-none block transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:translate-x-3 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-50 group-hover:opacity-100"
                      }`}
                    >
                      {link.title}
                    </span>
                    {/* Underline that sweeps in left-to-right on hover */}
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-white/30 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-full" />
                  </div>

                  {/* Hover text — word stagger (desktop only) */}
                  <div className="hidden md:block overflow-hidden h-4 mt-1 absolute top-full left-0.5 pointer-events-none">
                    <div className="flex gap-1 text-[10px] text-white/50 font-sans italic lowercase whitespace-nowrap">
                      {link.hoverText.split(" ").map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="inline-block transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                          style={{
                            transitionProperty: "transform, opacity",
                            transitionDuration: "380ms",
                            transitionTimingFunction:
                              "cubic-bezier(0.76,0,0.24,1)",
                            transitionDelay: `${wIdx * 22}ms`,
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover text — always visible on mobile */}
                  <p className="mt-1 text-[10px] text-white/35 font-sans italic md:hidden leading-relaxed max-w-[85%] lowercase">
                    {link.hoverText}
                  </p>
                </a>
              );
            })}
          </div>

          {/* FOOTER META */}
          <div className="menu-meta shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-3 text-[9px] uppercase tracking-[0.2em] border-t border-white/10 pt-5 mt-6 pointer-events-auto opacity-0">
            <div className="flex gap-5 opacity-35">
              <span>[ {locationText} ]</span>
              <span>WAT {localTime}</span>
            </div>
            <a
              href={`mailto:${emailText}`}
              className="opacity-35 hover:opacity-100 transition-opacity duration-300"
            >
              {emailText}
            </a>
          </div>
        </div>

        {/* ── GHOST SLAB — desktop only ────────────────────────────────────────
            Animates in sync with <main> (same x + scale transform).
            Since this lives at z-50 it paints above <main> (z-10), making
            the preview image appear to sit on the surface of the pushed page.
        ─────────────────────────────────────────────────────────────────────── */}
        <div
          ref={ghostRef}
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        >
          {menuLinks.map((link, idx) => (
            <div
              key={link.href}
              ref={(el) => {
                imgRefs.current[idx] = el;
              }}
              className="absolute inset-0 w-full h-full opacity-0"
            >
              <Image
                src={link.image}
                alt={link.title}
                fill
                sizes="100vw"
                className="object-cover"
                // Only the first image gets priority — the rest load on demand
                priority={idx === 0}
              />
              {/* Gradient blends the image edge into the dark drawer panel */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
