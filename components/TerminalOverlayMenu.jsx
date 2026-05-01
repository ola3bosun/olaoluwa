"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TransitionLink from "./TransitionLink";

export default function Menu({ isOpen, toggleMenu, settings }) {
  const overlayRef = useRef(null);
  const paletteRef = useRef(null);
  const tl = useRef(null);

  // --- DYNAMIC DATA ---
  const mobileLocationText = "LOS / ABUJA";
  const emailText = settings?.email || "DIYAOLAOLUWA@GMAIL.COM";

  const [localTime, setLocalTime] = useState("...");
  const [searchQuery, setSearchQuery] = useState("");

  const menuLinks = [
    { title: "Archive", href: "/gallery", category: "Index" },
    { title: "About Studio", href: "/about", category: "Information" },
    { title: "Shop Prints", href: "/shop", category: "Commerce" },
    { title: "Inquire", href: "/contact", category: "Information" },
  ];

  // Simple filter logic for the command palette
  const filteredLinks = menuLinks.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    link.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // TIME ENGINE
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setLocalTime(`${formatter.format(new Date())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP MOUNT ANIMATIONS
  useGSAP(() => {
    tl.current = gsap
      .timeline({ paused: true })
      // 1. Fade in the dark overlay backdrop
      .to(overlayRef.current, {
        autoAlpha: 1, // handles both opacity and visibility
        duration: 0.4,
        ease: "power2.inOut",
      })
      // 2. Slide the palette modal up slightly while fading in
      .fromTo(paletteRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      )
      // 3. Stagger the links inside
      .fromTo(".palette-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" },
        "-=0.3"
      );
  }, { scope: overlayRef });

  useEffect(() => {
    if (tl.current) {
      if (isOpen) {
        tl.current.play();
        setSearchQuery(""); // Reset search when opened
      } else {
        tl.current.reverse();
      }
    }
  }, [isOpen]);

  // Command Palette Layout
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-150 flex items-center justify-center invisible opacity-0 bg-black/60 backdrop-blur-sm px-4"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0" onClick={toggleMenu} />

      {/* THE PALETTE MODAL */}
      <div 
        ref={paletteRef}
        className="relative z-10 w-full max-w-2xl bg-[#E5E5E5] text-black font-mono shadow-2xl overflow-hidden border border-white/20"
      >
        
        {/* HEADER: Search Input */}
        <div className="w-full border-b border-black/20 relative">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-50">
            [ / ]
          </div>
          <input 
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none py-6 pl-16 pr-6 text-sm uppercase tracking-widest placeholder:text-black/30"
            autoFocus={isOpen}
          />
        </div>

        {/* BODY: Filtered Links */}
        <div className="w-full flex flex-col py-2 max-h-[50vh] overflow-y-auto">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link, idx) => (
              <TransitionLink
                key={idx}
                href={link.href}
                onClick={toggleMenu}
                className="palette-item group flex items-center justify-between px-6 py-4 hover:bg-black hover:text-[#E5E5E5] transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="opacity-40 text-[10px] group-hover:opacity-60">{link.category}</span>
                  <span className="font-sans font-bold text-xl md:text-2xl uppercase tracking-tighter">{link.title}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                  [ ENTER ]
                </div>
              </TransitionLink>
            ))
          ) : (
            <div className="px-6 py-8 opacity-50 text-xs uppercase tracking-widest text-center">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>

        {/* FOOTER: Live Data */}
        <div className="w-full border-t border-black/20 px-6 py-4 flex justify-between items-center text-[9px] uppercase tracking-widest opacity-60">
          <div className="flex gap-4">
            <span>[ {mobileLocationText} ]</span>
            <span>WAT: {localTime}</span>
          </div>
          <a href={`mailto:${emailText}`} className="hover:opacity-100 transition-opacity">
            {emailText}
          </a>
        </div>

      </div>
    </div>
  );
}