"use client"

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Preloader() {
  const containerRef = useRef(null)

  const rows = [...Array(7)]
  const textGroup = [...Array(8)].fill("OLAOLUWA")

  useGSAP(() => {
    // 1. Base Marquee Speed (Slowed down from 4s to 12s for readability)
    const leftLoop = gsap.to(".marquee-left", {
      xPercent: -50,
      ease: "none",
      duration: 12,
      repeat: -1
    })

    const rightLoop = gsap.fromTo(".marquee-right", 
      { xPercent: -50 },
      { xPercent: 0, ease: "none", duration: 12, repeat: -1 }
    )

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { display: "none" })
        document.body.style.overflow = "auto" 
      }
    })

    document.body.style.overflow = "hidden"

    // Fade in the text slowly
    tl.fromTo(".marquee-container", 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: "power2.out" }
    )

    // THE ACCELERATION: Build tension smoothly over 2.5 seconds
    tl.to([leftLoop, rightLoop], {
      timeScale: 2, // Capped at 2x so it doesn't turn into a blur
      duration: 2.5,
      ease: "power3.in"
    }, 1.5)

    // THE SNAP: The sudden stop
    tl.add(() => {
      leftLoop.pause()
      rightLoop.pause()
    }, 4)

    // Instantly hide chaos, reveal center word
    tl.to(".marquee-container", { opacity: 0, duration: 0.5 }, 5.5)


    // THE EXIT

    tl.to(".bg-panel", {
      yPercent: -100,
      duration: 1.5,
      ease: "expo.inOut"
    }, 5.2)

  }, { scope: containerRef })

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex flex-col justify-center items-center pointer-events-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-black bg-panel z-0" />
      
      <div className="marquee-container absolute inset-0 flex flex-col justify-center gap-2 md:gap-4 z-10 opacity-0 -rotate-2 scale-110">
        {rows.map((_, i) => (
          <div 
            key={i} 
            className={`flex w-max ${i % 2 === 0 ? 'marquee-left' : 'marquee-right'}`}
          >
            <div className="flex gap-4 md:gap-8 text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none">
              {textGroup.map((text, j) => (
                <span 
                  key={j} 
                  className={i % 2 !== 0 
                    ? "text-transparent [-webkit-text-stroke:2px_white] opacity-40" 
                    : "text-white opacity-20"
                  }
                >
                  {text}
                </span>
              ))}
            </div>
            <div className="flex gap-4 md:gap-8 text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none pl-4 md:pl-8">
              {textGroup.map((text, j) => (
                <span 
                  key={j} 
                  className={i % 2 !== 0 
                    ? "text-transparent [-webkit-text-stroke:2px_white] opacity-40" 
                    : "text-white opacity-20"
                  }
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  )
}