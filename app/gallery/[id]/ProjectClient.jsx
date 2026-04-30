"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TransitionLink from '@/components/TransitionLink'

export default function ProjectClient({ project }) {
  const containerRef = useRef(null)
  const imagesContainerRef = useRef(null)
  const isInitialMount = useRef(true) // Stops the 3D flip from running on first load
  
  // Combine cover image and gallery images into one array
  const images = project.gallery && project.gallery.length > 0 
    ? [project.imageUrl, ...project.gallery] 
    : [project.imageUrl]

  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)

  // --- 7-SECOND AUTO-CYCLE ENGINE ---
  const startTimer = () => {
    clearInterval(timerRef.current)
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 7000)
    }
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [images.length])

  const handleThumbnailHover = (idx) => {
    if (idx !== currentIndex) {
      setCurrentIndex(idx)
      startTimer() 
    }
  }

  // --- 1. INITIAL MOUNT REVEALS ---
  useGSAP(() => {
    const tl = gsap.timeline()
    
    // Instead of fromTo, we use 'from'. If GSAP breaks, it defaults to visible.
    tl.from(imagesContainerRef.current, 
      { scale: 1.05, opacity: 0, duration: 1.5, ease: "power3.out" }
    )
    .from(".ui-layer", 
      { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
      "-=1.0"
    )
  }, { scope: containerRef })

  // --- 2. THE 3D BILLBOARD FLIP ENGINE ---
  useGSAP(() => {
    if (!imagesContainerRef.current) return
    const children = imagesContainerRef.current.children

    // Bypass the flip animation on the very first page load
    if (isInitialMount.current) {
      Array.from(children).forEach((child, idx) => {
        gsap.set(child, { opacity: idx === currentIndex ? 1 : 0, zIndex: idx === currentIndex ? 10 : 0 })
      })
      isInitialMount.current = false
      return
    }

const nextImg = children[currentIndex];
    
    // Ensure incoming image is on top
    gsap.set(nextImg, { zIndex: 10 });

    // 1. The aggressive 3D snap-in (lasts 1.6s)
    gsap.fromTo(nextImg,
      { rotationY: 90, transformOrigin: "100% 50%", opacity: 0, scale: 1.1 },
      { rotationY: 0, opacity: 1, scale: 1.02, duration: 1.6, ease: "expo.out" }
    );

    // The Slow Breath / Pan (lasts the full 7s lifecycle)
    // This runs simultaneously, slowly pushing the image larger and slightly to the left
    gsap.to(nextImg, {
      scale: 1.15,
      xPercent: -1.5, // The 10-15px lateral drift
      duration: 7,
      ease: "none"
    });

    // Outgoing panels swing away into the deep background on the left
    Array.from(children).forEach((child, idx) => {
      if (idx !== currentIndex) {
        gsap.to(child, { 
          rotationY: -90, 
          transformOrigin: "0% 50%", 
          opacity: 0, 
          scale: 0.8, 
          duration: 1.6, 
          ease: "expo.out", 
          zIndex: 0 
        });
      }
    });
  }, { dependencies: [currentIndex], scope: containerRef })

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-[#E5E5E5] font-sans selection:bg-white selection:text-black">
      
      {/* 1. BACKGROUND LAYER: FULL BLEED HERO */}
      <div className="absolute top-0 left-0 w-full h-[85vh] overflow-hidden z-0 bg-neutral-900">

        <div ref={imagesContainerRef} className="relative w-full h-full perspective-[10000px]">
          {images.map((src, idx) => (
            // Removed opacity-0 from Tailwind
            <div key={idx} className="absolute inset-0 w-full h-full">
              <Image 
                src={src}
                alt={`${project.title} - Elevation ${idx + 1}`}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/60 pointer-events-none z-20" />
      </div>

      {/* 2. FOREGROUND LAYER: FLOATING UI */}
      <div className="relative z-10 w-full h-[85vh] flex flex-col justify-between px-4 md:px-8 pt-24 md:pt-32 pb-8 text-white pointer-events-none">
        
        <div className="ui-layer pointer-events-auto">
          <TransitionLink href="/gallery" className="font-mono text-xs md:text-sm uppercase tracking-widest w-fit flex">
            [ ← RETURN TO ARCHIVE ]
          </TransitionLink>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 w-full pointer-events-auto">
          
          <div className="w-full md:w-1/2 flex flex-col gap-6 ui-layer">
            <h1 className="font-sans text-white mix-blend-difference text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              {project.title}
            </h1>
            
            <div className="grid grid-cols-3 gap-6 font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-80">
              <div className="flex flex-col gap-1">
                <span className="opacity-50">CATEGORY</span>
                <span>{project.category}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="opacity-50">LOCATION</span>
                <span>{project.location}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="opacity-50">YEAR</span>
                <span>{project.year}</span>
              </div>
            </div>
          </div>

          {images.length > 1 && (
            <div className="w-full md:w-auto flex flex-col items-end gap-3 ui-layer shrink-0">
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                [ 0{currentIndex + 1} / 0{images.length} ]
              </div>
              
              <div className="flex flex-wrap justify-end gap-2 md:gap-3">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => handleThumbnailHover(idx)}
                    className={`relative w-16 h-10 md:w-24 md:h-16 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentIndex === idx 
                        ? 'border border-white scale-100 opacity-100 grayscale-0' 
                        : 'border border-transparent scale-95 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-100'
                    }`}
                  >
                    <Image src={src} alt={`Thumbnail ${idx + 1}`} fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BASE LAYER: FOOTER SPACE */}
      <div className="relative z-10 w-full min-h-[15vh] px-4 md:px-8 py-8 flex flex-col justify-center text-black ui-layer bg-[#E5E5E5]">
        <div className="border-t border-black/20 pt-6 flex justify-between font-mono text-[10px] md:text-xs uppercase tracking-widest w-full">
          <TransitionLink href="/gallery">
            [ HOME ]
          </TransitionLink>
          <TransitionLink href="/contact">
            [ INQUIRE ]
          </TransitionLink>
        </div>
      </div>

    </main>
  )
}