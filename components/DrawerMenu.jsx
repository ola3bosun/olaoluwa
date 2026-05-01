"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Menu({ isOpen, toggleMenu, settings }) {
  const router = useRouter();
  const menuRef = useRef(null);
  const ghostSlabRef = useRef(null); // The invisible mirror
  const tl = useRef(null);

  const [localTime, setLocalTime] = useState("...");
  const [hoveredImage, setHoveredImage] = useState(null);

  // --- DYNAMIC DATA ---
  const mobileLocationText = "LOS / ABUJA";
  const emailText = settings?.email || "DIYAOLAOLUWA@GMAIL.COM";

  // Re-added your default images from the original file
  const sanityImages = settings?.menuImages || [];
  const defaultImages = sanityImages.length > 0 ? sanityImages : [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
    "https://images.unsplash.com/photo-1592078615290-033ee584e267",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ];

  const menuLinks = [
    { title: "Archive", href: "/gallery", category: "Index", image: defaultImages[0] },
    { title: "About Studio", href: "/about", category: "Information", image: defaultImages[1] },
    { title: "Shop Prints", href: "/shop", category: "Commerce", image: defaultImages[2] },
    { title: "Inquire", href: "/contact", category: "Information", image: defaultImages[3] },
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

  const handleNavigation = (e, href) => {
    e.preventDefault();
    toggleMenu(); 
    setTimeout(() => {
      router.push(href);
    }, 800); 
  };

  // GSAP PHYSICAL SHIFT ENGINE
  useGSAP(() => {
    const siteWrapper = document.querySelector("main");
    if (!siteWrapper) return;

    // Set stacking contexts. 
    // zIndex 10 for the real site, zIndex 20 for our ghost slab slider
    gsap.set(siteWrapper, { transformOrigin: "center right", zIndex: 10, position: "relative", backgroundColor: "#E5E5E5", willChange: "transform" });
    gsap.set(ghostSlabRef.current, { transformOrigin: "center right", zIndex: 20 });

    tl.current = gsap.timeline({ 
      paused: true,
      onStart: () => { document.body.style.overflow = "hidden"; },
      onReverseComplete: () => { 
        document.body.style.overflow = ""; 
        setHoveredImage(null); // Clear image when menu closes
      }
    })
      // Animate BOTH the real site and the Ghost Slab perfectly in sync
      .to([siteWrapper, ghostSlabRef.current], {
        scale: window.innerWidth > 768 ? 0.85 : 0.9,
        x: window.innerWidth > 768 ? "60vw" : "80vw",
        borderRadius: "24px",
        boxShadow: "-40px 0px 100px rgba(0,0,0,0.8)",
        duration: 0.8,
        ease: "power4.inOut"
      })
      .fromTo(".drawer-link",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(".drawer-meta",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.4"
      );
  }, { scope: menuRef });

  useEffect(() => {
    if (tl.current) {
      if (isOpen) tl.current.play();
      else tl.current.reverse();
    }
  }, [isOpen]);

  // Handle the image crossfade on the ghost slab
  useEffect(() => {
    if (hoveredImage) {
      gsap.to(".slider-image", { opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(".slider-image", { opacity: 0, duration: 0.4, ease: "power2.out" });
    }
  }, [hoveredImage]);

  return (
    <div ref={menuRef} className="fixed inset-0 z-0 bg-neutral-900 text-[#E5E5E5] font-mono overflow-hidden">
      
      {/* 1. THE FOUNDATION DRAWER */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 py-24 w-[80vw] md:w-[60vw]">
        <div className="flex flex-col gap-8 md:gap-12 w-full mt-12 md:mt-0">
          {menuLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href)}
              onMouseEnter={() => setHoveredImage(link.image)}
              onMouseLeave={() => setHoveredImage(null)}
              className="drawer-link group flex flex-col items-start hover:opacity-50 transition-opacity w-fit cursor-pointer relative z-30"
            >
              <span className="opacity-40 text-[10px] tracking-widest uppercase mb-2">
                [ {link.category} ]
              </span>
              <span className="font-sans font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none">
                {link.title}
              </span>
            </a>
          ))}
        </div>

        <div className="drawer-meta absolute bottom-8 left-8 md:left-16 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-[10px] uppercase tracking-widest opacity-60 border-t border-white/20 pt-6">
          <div className="flex gap-4">
            <span>[ {mobileLocationText} ]</span>
            <span>WAT: {localTime}</span>
          </div>
          <a href={`mailto:${emailText}`} className="hover:text-white transition-colors z-30 relative">
            {emailText}
          </a>
        </div>
      </div>

      {/* 2. THE GHOST SLAB (Mirrors the scaled site and holds the slider) */}
      <div 
        ref={ghostSlabRef}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      >
        {/* We render the active image here. It fades in/out based on the hoveredImage state */}
        <div className="slider-image absolute inset-0 w-full h-full opacity-0">
          {hoveredImage && (
            <Image 
              src={hoveredImage}
              alt="Section Preview"
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Subtle vignette to ensure it feels deep and cinematic */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* 3. INVISIBLE CLICK CAPTURE OVERLAY */}
      {isOpen && (
        <div 
          className="absolute inset-0 z-40 w-full h-full cursor-pointer" 
          onClick={toggleMenu} 
        />
      )}
    </div>
  );
}