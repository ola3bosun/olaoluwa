"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

export default function Menu({ isOpen, toggleMenu, settings }) {
  const router = useRouter();
  const menuRef = useRef(null);
  const ghostSlabRef = useRef(null); 

  const [localTime, setLocalTime] = useState("...");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isFirstRender = useRef(true); // Prevents animation on initial load

  // --- DYNAMIC DATA ---
  const mobileLocationText = "LOS / ABUJA";
  const emailText = settings?.email || "DIYAOLAOLUWA@GMAIL.COM";

  const menuLinks = [
    { 
      title: "Works", 
      href: "/gallery", 
      category: "Archive", 
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      hoverText: "Proof I actually finish things."
    },
    { 
      title: "About Me", 
      href: "/about", 
      category: "Information", 
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
      hoverText: "Who I am when I'm not arguing with contractors and the principles I pretend to follow."
    },
    { 
      title: "Shop", 
      href: "/shop", 
      category: "Commerce", 
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
      hoverText: "things i created that you can actually take home."
    },
    { 
      title: "Inquire", 
      href: "/contact", 
      category: "Information", 
      image: "https://images.unsplash.com/photo-1541881430009-4ee7b2c70036",
      hoverText: "Please be nice, I haven't slept in days but those projects won't design themselves you know."
    },
  ];

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

  const handleMouseEnter = (idx, href) => {
    setHoveredIndex(idx);
    router.prefetch(href); 
  };

  const handleNavigation = (e, href) => {
    e.preventDefault();
    toggleMenu(); 
    setTimeout(() => {
      router.push(href);
    }, 800); 
  };

  // THE FIX: DYNAMIC ON-THE-FLY TWEENING
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isOpen) return; // Don't run the reverse animation on first mount
    }

    // Grab the current live <main> tag, bypassing Next.js DOM caching
    const siteWrapper = document.querySelector("main");
    if (!siteWrapper) {
      console.warn("GSAP: <main> tag not found on this page.");
      return;
    }

    if (isOpen) {
      // 1. OPENING ANIMATION
      document.body.style.overflow = "hidden";
      
      gsap.set(siteWrapper, { transformOrigin: "center right", zIndex: 10, position: "relative", backgroundColor: "#E5E5E5", willChange: "transform" });
      gsap.set(ghostSlabRef.current, { transformOrigin: "center right", zIndex: 20 });

      gsap.to([siteWrapper, ghostSlabRef.current], {
        scale: window.innerWidth > 768 ? 0.85 : 0.9,
        x: window.innerWidth > 768 ? "60vw" : "80vw",
        borderRadius: "24px",
        boxShadow: "-40px 0px 100px rgba(0,0,0,0.8)",
        duration: 0.8,
        ease: "power4.inOut",
        overwrite: "auto" // Kills any conflicting active tweens
      });

      gsap.fromTo(".drawer-link",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
      );

      gsap.fromTo(".drawer-meta",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2, overwrite: "auto" }
      );

    } else {
      // 2. CLOSING ANIMATION
      gsap.to([siteWrapper, ghostSlabRef.current], {
        scale: 1,
        x: "0vw",
        borderRadius: "0px",
        boxShadow: "0px 0px 0px rgba(0,0,0,0)",
        duration: 0.8,
        ease: "power4.inOut",
        overwrite: "auto",
        onComplete: () => {
          document.body.style.overflow = "";
          setHoveredIndex(null);
          // CRITICAL: Strip GSAP styles completely so Next.js doesn't crash on route change
          gsap.set(siteWrapper, { clearProps: "all" }); 
        }
      });

      gsap.to(".drawer-link", { x: -40, opacity: 0, duration: 0.4, ease: "power3.in", overwrite: "auto" });
      gsap.to(".drawer-meta", { opacity: 0, duration: 0.4, ease: "power2.in", overwrite: "auto" });
    }
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed inset-0 z-0 bg-neutral-900 text-[#E5E5E5] font-mono overflow-hidden">
      
      {/* 1. THE FOUNDATION DRAWER */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center px-8 md:px-16 py-24 w-[80vw] md:w-[60vw]">
        <div className="flex flex-col gap-6 md:gap-8 w-full mt-12 md:mt-0">
          {menuLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href)}
              onMouseEnter={() => handleMouseEnter(idx, link.href)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="drawer-link group flex flex-col items-start w-fit cursor-pointer relative opacity-0"
            >
              <span className="opacity-40 text-[10px] tracking-widest uppercase mb-1 pointer-events-none">
                [ {link.category} ]
              </span>
              
              <span className="font-sans font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-4 group-hover:scale-110">
                {link.title}
              </span>

              {/* THE STAGGERED FUNNY COPY REVEAL */}
              <div className="overflow-hidden mt-2 h-5 absolute top-full left-0 ml-4 pointer-events-none">
                <div className="flex gap-1 text-[11px] md:text-xs text-white/80 font-sans italic lowercase whitespace-nowrap">
                  {link.hoverText.split(" ").map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                      style={{ transitionDelay: `${wIdx * 30}ms` }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="drawer-meta opacity-0 absolute bottom-8 left-8 md:left-16 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-[10px] uppercase tracking-widest border-t border-white/20 pt-6">
          <div className="flex gap-4">
            <span>[ {mobileLocationText} ]</span>
            <span>WAT: {localTime}</span>
          </div>
          <a href={`mailto:${emailText}`} className="hover:text-white transition-colors relative">
            {emailText}
          </a>
        </div>
      </div>

      {/* 2. THE GHOST SLAB */}
      <div 
        ref={ghostSlabRef}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20"
      >
        {menuLinks.map((link, idx) => (
          <div 
            key={idx}
            className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
            style={{ 
              opacity: hoveredIndex === idx ? 1 : 0,
              zIndex: hoveredIndex === idx ? 2 : 1 
            }}
          >
            <Image 
              src={link.image}
              alt={link.title}
              fill
              className="object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* 3. INVISIBLE CLICK CAPTURE OVERLAY */}
      {isOpen && (
        <div 
          className="absolute top-0 right-0 h-full w-[20vw] md:w-[40vw] z-50 cursor-pointer" 
          onClick={toggleMenu} 
        />
      )}
    </div>
  );
}