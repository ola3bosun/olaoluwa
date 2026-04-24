"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TransitionLink from './TransitionLink'

const defaultImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267"
]

const menuLinks = [
  { title: "About", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", href: "/about" },
  { title: "Contact", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267", href: "/contact" },
  { title: "Shop", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", href: "/shop" } // Updated to /shop
]

const allImages = Array.from(new Set([...defaultImages, ...menuLinks.map(l => l.image)]))

// --- THE STAGGERED TEXT ENGINE ---
const AnimatedMenuText = ({ text }) => {
  return (
    <div className="relative flex overflow-hidden">
      {/* 1. Default Layer: Bold Sans-Serif (Pushes UP on hover) */}
      <div className="flex">
        {text.split('').map((char, idx) => (
          <span
            key={`sans-${idx}`}
            className="font-sans font-black uppercase inline-block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${idx * 0.02}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* 2. Hover Layer: Elegant Serif (Pulls UP from below on hover) */}
      <div className="absolute top-0 left-0 flex text-[#E5E5E5]">
        {text.split('').map((char, idx) => (
          <span
            key={`serif-${idx}`}
            className="font-serif italic font-light lowercase inline-block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0"
            style={{ transitionDelay: `${idx * 0.02}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Menu({ isOpen, toggleMenu }) {
  const overlayRef = useRef(null)
  const floatingImageRef = useRef(null)
  const imagesContainerRef = useRef(null) 
  const tl = useRef(null)
  
  const xMove = useRef(null)
  const yMove = useRef(null)
  
  const [currentIdx, setCurrentIdx] = useState(0)
  const [hoveredImage, setHoveredImage] = useState(null)
  const [abujaTime, setAbujaTime] = useState("...")

  const displayImage = hoveredImage || defaultImages[currentIdx]
  const prevImageRef = useRef(displayImage)

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      });
      setAbujaTime(`${formatter.format(new Date())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hoveredImage) return; 
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % defaultImages.length)
    }, 5000) 
    return () => clearInterval(timer)
  }, [hoveredImage])

  // GSAP Menu Shutter Animation
  useGSAP(() => {
    xMove.current = gsap.quickTo(floatingImageRef.current, "left", { duration: 0.4, ease: "power3.out" })
    yMove.current = gsap.quickTo(floatingImageRef.current, "top", { duration: 0.4, ease: "power3.out" })

    tl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, 
        { y: "0%", duration: 0.6, ease: "power3.inOut" } 
      )
      .fromTo(".right-panel",
        { height: "0%" },
        { height: "100%", duration: 0.6, ease: "power3.inOut" },
        "-=0.2"
      )
      .fromTo(".menu-text-stagger",
        { y: "100%" },
        { y: "0%", duration: 0.5, stagger: 0.08, ease: "power3.out" },
        "-=0.4"
      )
  }, { scope: overlayRef }) 

  // GSAP Image Slider Animation (Slides from bottom)
  useGSAP(() => {
    if (prevImageRef.current === displayImage) return;

    const children = imagesContainerRef.current.children;
    const currentImgIdx = allImages.indexOf(displayImage);
    const prevImgIdx = allImages.indexOf(prevImageRef.current);

    const currentEl = children[currentImgIdx];
    const prevEl = prevImgIdx !== -1 ? children[prevImgIdx] : null;

    gsap.set(children, { zIndex: 0 });

    if (prevEl) {
      gsap.set(prevEl, { zIndex: 1, yPercent: 0 });
    }

    gsap.set(currentEl, { zIndex: 2, yPercent: 100 });
    gsap.to(currentEl, {
      yPercent: 0,
      duration: 0.8,
      ease: "expo.out" 
    });

    prevImageRef.current = displayImage;
  }, { dependencies: [displayImage] })

  useEffect(() => {
    if (isOpen) {
      tl.current?.play()
    } else {
      tl.current?.reverse()
    }
  }, [isOpen])

  const handleMouseMove = (e) => {
    xMove.current?.(e.clientX - 128) 
    yMove.current?.(e.clientY - 80)  
  }

  const handleMouseEnter = (image) => {
    setHoveredImage(image)
    gsap.to(floatingImageRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" })
  }

  const handleMouseLeave = () => {
    setHoveredImage(null)
    gsap.to(floatingImageRef.current, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.out" })
  }

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#E5E5E5] text-black font-sans overflow-hidden"
      style={{ transform: "translateY(-100%)" }}
    >
      <div 
        ref={floatingImageRef}
        className="fixed top-0 left-0 z-[150] w-64 h-40 pointer-events-none overflow-hidden bg-neutral-900 shadow-2xl opacity-0 scale-75"
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

      <nav className="absolute top-0 w-full flex justify-between items-center p-2 uppercase font-mono text-sm tracking-widest z-50 pointer-events-none">
          <TransitionLink href="/" className="pointer-events-auto" >
            OD
          </TransitionLink>
        
        <div className="hidden md:block text-xs opacity-80 text-center w-48 pointer-events-auto mix-blend-difference text-[#000000]">
          ABUJA, NG <br/>
          {abujaTime}
        </div>

        <button 
          onClick={toggleMenu}
          className="group relative overflow-hidden w-fit flex justify-end cursor-pointer hover:opacity-50 transition-opacity pointer-events-auto mix-blend-difference text-white"
        >
          CLOSE X
        </button>
      </nav>

      <div className="w-full md:w-1/2 h-full flex flex-col relative z-10 bg-[#f4f4f4]">
        <div className="flex-1 px-4 md:px-8 pt- md:pt-32 shrink-0">
          <p className="text-[16px] md:text-base font-italic uppercase leading-tight max-w-lg">
            Thanks for stopping by. I'm currently a designer based in Abuja, crafting architecture, interiors and furniture that respond to climate and craft. Feel free to explore the site and get in touch if you'd like to collaborate or just say hi.oh, I do photography in my leisure time too. Check out the shop for prints and pieces of my projects.
          </p>
        </div>

        <div className="flex flex-col w-full border-t border-black mt-auto">
          {menuLinks.map((link) => (
            <TransitionLink 
              key={link.title}
              href={link.href}
              onClick={toggleMenu} 
              onMouseEnter={() => handleMouseEnter(link.image)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              className="group relative border-b border-black w-full overflow-hidden cursor-pointer bg-[#f4f4f4] hover:bg-black transition-colors duration-500 block"
            >
              <div className="p-4 md:p-6 lg:p-8 pointer-events-none flex items-center">
                <div className="overflow-hidden">
                  
                  <div className="menu-text-stagger flex items-center text-3xl md:text-5xl">
                    <AnimatedMenuText text={link.title} />
                  </div>

                </div>
              </div>
            </TransitionLink>
          ))}

          <div className="p-4 md:p-6 lg:p-8 text-sm font-mono uppercase tracking-widest border-b border-black hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer group">
            <div className="overflow-hidden">
              <div className="menu-text-stagger flex items-center">
                <span className="inline-block w-0 overflow-hidden group-hover:w-4 group-hover:mr-2 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-[#E5E5E5]">
                  →
                </span>
                ANYTHING ELSE?
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 h-full bg-black relative justify-center items-end overflow-hidden">
        <div className="right-panel relative bottom-0 w-full h-full overflow-hidden" ref={imagesContainerRef}>
          {allImages.map((src, idx) => (
            <div 
              key={idx}
              className="absolute inset-0 w-full h-full"
              style={{
                zIndex: src === displayImage ? 2 : 0,
                transform: src === displayImage ? "translateY(0%)" : "translateY(100%)"
              }}
            >
              <Image 
                src={src}
                alt="Studio Work"
                fill
                sizes="50vw"
                priority={idx === 0}
                className="object-cover grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}