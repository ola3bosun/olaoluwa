"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TransitionLink from '@/components/TransitionLink'

export default function ProjectClient({ project }) {
  const containerRef = useRef(null)
  const imagesContainerRef = useRef(null)
  
  // Safely fallback to an array of images
  const images = project.gallery && project.gallery.length > 0 
    ? [project.imageUrl, ...project.gallery] 
    : [project.imageUrl]

  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)

  // --- AUTO-CYCLE TIMER ---
  const startTimer = () => {
    clearInterval(timerRef.current)
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 5000)
    }
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [images.length])

  const handleThumbnailHover = (idx) => {
    if (idx !== currentIndex) {
      setCurrentIndex(idx)
      startTimer() // Instantly reset the 5s clock on manual override
    }
  }

  // --- GSAP REVEALS & CROSSFADE ENGINE ---
  useGSAP(() => {
    const tl = gsap.timeline()
    
    // 1. Initial Page Reveal
    tl.fromTo(imagesContainerRef.current, 
      { scale: 1.05, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    )
    .fromTo(".ui-layer", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
      "-=1.0"
    )
  }, { scope: containerRef })

  useGSAP(() => {
    if (!imagesContainerRef.current) return
    const children = imagesContainerRef.current.children

    // 2. Active Image Crossfade
    gsap.fromTo(children[currentIndex],
      { opacity: 0, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", zIndex: 10 }
    )

    // Fade out inactive images
    Array.from(children).forEach((child, idx) => {
      if (idx !== currentIndex) {
        gsap.to(child, { opacity: 0, duration: 1.2, ease: "power2.inOut", zIndex: 0 })
      }
    })
  }, { dependencies: [currentIndex], scope: containerRef })

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-[#E5E5E5] font-sans selection:bg-white selection:text-black">
      
      {/* ========================================================= */}
      {/* 1. BACKGROUND LAYER: 80vh HERO IMAGE SEQUENCE             */}
      {/* ========================================================= */}
      <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden z-0 bg-neutral-900">
        <div ref={imagesContainerRef} className="relative w-full h-full opacity-0">
          {images.map((src, idx) => (
            <div key={idx} className="absolute inset-0 w-full h-full opacity-0">
              <Image 
                src={src}
                alt={`${project.title} - ${idx + 1}`}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* CINEMATIC OVERLAY: Protects the white UI text from bright images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none z-20" />
      </div>

      {/* ========================================================= */}
      {/* 2. FOREGROUND LAYER: FLOATING UI ON TOP OF IMAGE          */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full h-[80vh] flex flex-col justify-between px-4 md:px-8 pt-24 md:pt-32 pb-8 text-white pointer-events-none">
        
        {/* TOP: Back Button */}
        <div className="ui-layer opacity-0 pointer-events-auto">
          <TransitionLink href="/gallery" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-50 transition-opacity w-fit flex">
            [ ← RETURN TO ARCHIVE ]
          </TransitionLink>
        </div>

        {/* BOTTOM OF IMAGE: Metadata & Thumbnails */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 w-full pointer-events-auto">
          
          {/* Left Side: Title & Metadata */}
          <div className="w-full md:w-1/2 flex flex-col gap-8 ui-layer opacity-0">
            <h1 className="font-sans text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              {project.title}
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono text-[10px] md:text-xs uppercase tracking-widest">
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

            {project.description && (
              <p className="text-sm leading-relaxed opacity-80 max-w-md hidden md:block">
                {project.description}
              </p>
            )}
          </div>

          {/* Right Side: Interactive Thumbnails */}
          {images.length > 1 && (
            <div className="w-full md:w-auto flex flex-col items-end gap-3 ui-layer opacity-0 shrink-0">
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                [ SEQUENCE 0{currentIndex + 1} / 0{images.length} ]
              </div>
              
              <div className="flex flex-wrap justify-end gap-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => handleThumbnailHover(idx)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentIndex === idx 
                        ? 'border border-white scale-100 opacity-100' 
                        : 'border border-transparent scale-95 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BASE LAYER: THE REMAINING 20vh (WHITE/GREY SPACE)      */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full min-h-[20vh] px-4 md:px-8 py-8 flex flex-col justify-end text-black ui-layer opacity-0">
        
        {/* Mobile Description (Moved here so it doesn't crowd the image on small screens) */}
        {project.description && (
          <p className="text-sm leading-relaxed opacity-80 max-w-full block md:hidden mb-12">
            {project.description}
          </p>
        )}

        <div className="border-t border-black/20 pt-6 flex justify-between font-mono text-[10px] md:text-xs uppercase tracking-widest w-full">
          <TransitionLink href="/gallery" className="hover:opacity-50 transition-opacity">
            [ ARCHIVE INDEX ]
          </TransitionLink>
          <TransitionLink href="/contact" className="hover:opacity-50 transition-opacity font-bold">
            [ START A PROJECT ]
          </TransitionLink>
        </div>
      </div>

    </main>
  )
}