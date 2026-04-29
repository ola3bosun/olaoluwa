"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import TransitionLink from '@/components/TransitionLink'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// FALLBACK DATA
const fallbackImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop"
]

export default function ContactClient({ settings }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  
  const containerRef = useRef(null)
  const imagesRef = useRef([])

  // Use Sanity images if they exist, otherwise use fallbacks
  const sliderImages = settings?.sliderImages?.length > 0 ? settings.sliderImages : fallbackImages

  // The 5-second interval timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [sliderImages.length])

  // The GSAP Fade & Scale Engine
  useGSAP(() => {
    const currentImg = imagesRef.current[currentImageIdx]
    const prevIdx = currentImageIdx === 0 ? sliderImages.length - 1 : currentImageIdx - 1
    const prevImg = imagesRef.current[prevIdx]

    gsap.set(imagesRef.current, { zIndex: 0 })

    // Lock the previous image just behind the new one
    if (prevImg) {
      gsap.set(prevImg, { zIndex: 1, opacity: 1, scale: 1 })
    }

    // Lifts the current image to the front, start it small (0.3), and expand it outward
    gsap.set(currentImg, { zIndex: 2 })
    gsap.fromTo(currentImg,
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }
    )
  }, { dependencies: [currentImageIdx], scope: containerRef })

  return (
    <main className="h-screen w-screen bg-[#E5E5E5] text-black overflow-hidden relative font-sans flex flex-col md:flex-row">
      
      <nav className="absolute top-0 left-0 w-full p-4 md:p-8 z-50 pointer-events-none flex justify-between uppercase font-mono text-sm tracking-widest mix-blend-difference text-white">
        <TransitionLink href="/" className="pointer-events-auto hover:opacity-50 transition-opacity">
          ← BACK TO INDEX
        </TransitionLink>
        <div className="hidden md:block font-logo">O.D</div>
      </nav>

      {/* LEFT HALF: Absolute GSAP Container */}
      <div ref={containerRef} className="w-full h-[50vh] md:h-full md:w-[55%] relative overflow-hidden bg-neutral-300">
        {sliderImages.map((src, idx) => (
          <div 
            key={idx} 
            ref={(el) => { imagesRef.current[idx] = el }}
            className="absolute inset-0 w-full h-full opacity-0"
          >
            <Image 
              src={src} 
              alt={`Studio Slide ${idx + 1}`} 
              fill 
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* RIGHT HALF: Option 2 + Clamp Typography */}
      <div className="w-full h-[50vh] md:h-full md:w-[45%] relative flex flex-col justify-end p-4 md:p-8 bg-[#E5E5E5]"> 
        
        {/* Dynamic Social Links */}
        <div className="w-full flex flex-wrap gap-4 md:gap-10 border-b-[3px] border-black pb-4 mb-6 font-mono text-xs md:text-sm uppercase tracking-widest">
          {settings?.instagram && (
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:opacity-50 transition-opacity">INSTAGRAM [↗]</a>
          )}
          {settings?.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="hover:opacity-50 transition-opacity">LINKEDIN [↗]</a>
          )}
          {settings?.twitter && (
            <a href={settings.twitter} target="_blank" rel="noreferrer" className="hover:opacity-50 transition-opacity">TWITTER [↗]</a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="hover:opacity-50 transition-opacity">EMAIL [↗]</a>
          )}
        </div>

        <h1 className="w-full flex flex-col uppercase font-bold tracking-tighter leading-[0.85] mb-2">
          <span className="text-[clamp(3rem,6vw,10rem)]">LET&apos;S</span>
          <span className="text-[clamp(3rem,6vw,10rem)]">WORK</span>
          <span className="text-[clamp(3rem,6vw,10rem)]">TOGETHER.</span>
        </h1>

      </div>

    </main>
  )
}