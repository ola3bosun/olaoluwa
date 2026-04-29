"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TransitionLink from "./TransitionLink";

// --- STAGGERED TEXT ENGINE (DESKTOP ONLY) ---
const AnimatedMenuText = ({ text }) => {
  return (
    <div className="relative flex overflow-hidden">
      <div className="flex">
        {text.split("").map((char, idx) => (
          <span
            key={`sans-${idx}`}
            className="font-sans font-black uppercase inline-block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${idx * 0.02}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
      <div className="absolute top-0 left-0 flex text-[#E5E5E5]">
        {text.split("").map((char, idx) => (
          <span
            key={`serif-${idx}`}
            className="font-serif italic font-light lowercase inline-block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0"
            style={{ transitionDelay: `${idx * 0.02}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Menu({ isOpen, toggleMenu, settings }) {
  const overlayRef = useRef(null);
  const floatingImageRef = useRef(null);
  const imagesContainerRef = useRef(null);
  const tl = useRef(null);

  const xMove = useRef(null);
  const yMove = useRef(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [localTime, setLocalTime] = useState("...");

  // --- DYNAMIC DATA ---
  const bioText =
    settings?.menuBio ||
    "Thanks for stopping by. I'm currently a designer based in Abuja, crafting architecture, interiors and furniture that respond to climate and craft. Feel free to explore the site and get in touch if you'd like to collaborate or just say hi. oh, I do photography in my leisure time too. Check out the shop for prints and pieces of my projects.";
  const mobileBioText =
    "{biotext}";
  const mobileLocationText = "LOS / ABUJA";
  const emailText = settings?.email || "DIYAOLAOLUWA@GMAIL.COM";

  const sanityImages = settings?.menuImages || [];
  const defaultImages =
    sanityImages.length > 0
      ? sanityImages
      : [
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
          "https://images.unsplash.com/photo-1592078615290-033ee584e267",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        ];

  const menuLinks = [
    {
      title: "About",
      titleMobile: "ABOUT",
      image: defaultImages[0],
      href: "/about",
    },
    {
      title: "Shop",
      titleMobile: "SHOP",
      image: defaultImages[1],
      href: "/shop",
    },
    {
      title: "Contact",
      titleMobile: "CONTACT",
      image: defaultImages[2],
      href: "/contact",
    },
  ];

  const allImages = Array.from(
    new Set([...defaultImages, ...menuLinks.map((l) => l.image)]),
  );
  const displayImage = hoveredImage || defaultImages[currentIdx];
  const prevImageRef = useRef(displayImage);

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

  // DESKTOP SLIDER TIMING
  useEffect(() => {
    if (hoveredImage || window.innerWidth < 768) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % defaultImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [hoveredImage, defaultImages.length]);

  useGSAP(
    () => {
      xMove.current = gsap.quickTo(floatingImageRef.current, "left", {
        duration: 0.4,
        ease: "power3.out",
      });
      yMove.current = gsap.quickTo(floatingImageRef.current, "top", {
        duration: 0.4,
        ease: "power3.out",
      });

      tl.current = gsap
        .timeline({ paused: true })
        // Reverted back to y: "0%"
        .to(overlayRef.current, {
          y: "0%",
          duration: 0.6,
          ease: "power3.inOut",
        })

        // DESKTOP ANIMATIONS
        .fromTo(
          ".right-panel",
          { height: "0%" },
          { height: "100%", duration: 0.6, ease: "power3.inOut" },
          "-=0.2",
        )
        .fromTo(
          ".menu-text-stagger",
          { y: "100%" },
          { y: "0%", duration: 0.5, stagger: 0.08, ease: "power3.out" },
          "-=0.4",
        )

        // MOBILE ANIMATIONS
        .fromTo(
          ".mobile-link",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .fromTo(
          ".mobile-data",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.4",
        );
    },
    { scope: overlayRef },
  );

  // 2. To trigger the animation safely outside the creation block
  useEffect(() => {
    if (tl.current) {
      if (isOpen) tl.current.play();
      else tl.current.reverse();
    }
  }, [isOpen]);

  // Secondary Image Slider (Desktop)
  useGSAP(
    () => {
      if (prevImageRef.current === displayImage || !imagesContainerRef.current)
        return;
      const children = imagesContainerRef.current.children;
      const currentImgIdx = allImages.indexOf(displayImage);
      const prevImgIdx = allImages.indexOf(prevImageRef.current);
      const currentEl = children[currentImgIdx];
      const prevEl = prevImgIdx !== -1 ? children[prevImgIdx] : null;

      if (!currentEl) return;
      gsap.set(children, { zIndex: 0 });
      if (prevEl) gsap.set(prevEl, { zIndex: 1, yPercent: 0 });
      gsap.set(currentEl, { zIndex: 2, yPercent: 100 });
      gsap.to(currentEl, { yPercent: 0, duration: 0.8, ease: "expo.out" });

      prevImageRef.current = displayImage;
    },
    { dependencies: [displayImage] },
  );

  // Desktop Mouse Handlers
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    xMove.current?.(e.clientX - 128);
    yMove.current?.(e.clientY - 80);
  };
  const handleMouseEnter = (image) => {
    if (window.innerWidth < 768) return;
    setHoveredImage(image);
    gsap.to(floatingImageRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.5)",
    });
  };
  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    setHoveredImage(null);
    gsap.to(floatingImageRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 h-100dvh overflow-hidden"
      style={{ transform: "translateY(-100%)" }}
    >
      {/*MOBILE UI*/}
      <div className="flex md:hidden w-full h-full flex-col bg-[#E5E5E5] text-black font-mono pt-20">
        <div className="w-full flex justify-between items-center px-4 py-3 border-y border-black/20 text-[10px] uppercase tracking-widest shrink-0 mobile-data relative">
          <div className="flex items-center gap-2 border border-black/20 px-1.5 py-0.5">
            <div className="w-2 h-2 bg-black animate-pulse" />
            <span>LIVE</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            WAT: {localTime}
          </div>
          <div>[ DARK ]</div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center px-6 py-8 gap-10">
          {menuLinks.map((link) => (
            <TransitionLink
              key={`mob-${link.titleMobile}`}
              href={link.href}
              onClick={toggleMenu}
              className="group w-fit hover:opacity-50 transition-opacity duration-300 overflow-hidden"
            >
              <div className="mobile-link text-[14vw] leading-none flex items-center">
                <span className="font-mono font-normal mr-4 opacity-50">
                  {" "}
                  [{" "}
                </span>
                <span className="font-sans font-black uppercase tracking-tighter">
                  {link.titleMobile}
                </span>
                <span className="font-mono font-normal ml-4 opacity-50">
                  {" "}
                  ]{" "}
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>

        <div className="w-full px-4 py-6 flex flex-col gap-8 text-[9px] uppercase tracking-widest shrink-0 mobile-data">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="opacity-50">LOCATIONS</span>
              <span>[ {mobileLocationText} ]</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="opacity-50">ENQUIRIES</span>
              <a
                href={`mailto:${emailText}`}
                className="hover:opacity-50 transition-opacity truncate lowercase font-sans text-[11px]"
              >
                {emailText}
              </a>
            </div>
          </div>
          <div className="flex justify-between items-end border-t border-black/20 pt-4">
            <div className="max-w-[200px] leading-[1.6] opacity-60">
              {mobileBioText}
            </div>
            <div className="font-bold opacity-80">
              © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/*DESKTOP UI*/}
      <div className="hidden md:flex w-full h-full flex-row bg-[#E5E5E5] text-black font-sans relative">
        <div
          ref={floatingImageRef}
          className="fixed top-0 left-0 z-150 w-64 h-40 pointer-events-none overflow-hidden bg-neutral-900 shadow-2xl opacity-0 scale-75"
        >
          {hoveredImage && (
            <Image
              src={hoveredImage}
              alt="Preview"
              fill
              sizes="256px"
              className="object-cover"
            />
          )}
        </div>

        <div className="w-1/2 h-full flex flex-col relative z-10 bg-[#f4f4f4] pt-8">
          <div className="flex-1 px-8 pt-24 shrink-0">
            <p className="text-base font-italic uppercase leading-tight max-w-lg">
              {bioText}
            </p>
          </div>

          <div className="flex flex-col w-full border-t border-black mt-auto">
            {menuLinks.map((link) => (
              <TransitionLink
                key={`desk-${link.title}`}
                href={link.href}
                onClick={toggleMenu}
                onMouseEnter={() => handleMouseEnter(link.image)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                className="group relative border-b border-black w-full overflow-hidden cursor-pointer bg-[#f4f4f4] hover:bg-black transition-colors duration-500 block"
              >
                <div className="p-6 lg:p-8 pointer-events-none flex items-center">
                  <div className="overflow-hidden">
                    <div className="menu-text-stagger flex items-center text-5xl">
                      <AnimatedMenuText text={link.title} />
                    </div>
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        </div>

        <div className="w-1/2 h-full bg-black relative flex justify-center items-end overflow-hidden">
          <div
            className="right-panel relative bottom-0 w-full h-full overflow-hidden"
            ref={imagesContainerRef}
          >
            {allImages.map((src, idx) => (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full"
                style={{
                  zIndex: src === displayImage ? 2 : 0,
                  transform:
                    src === displayImage
                      ? "translateY(0%)"
                      : "translateY(100%)",
                }}
              >
                <Image
                  src={src}
                  alt="Studio Work"
                  fill
                  sizes="50vw"
                  priority={idx === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
