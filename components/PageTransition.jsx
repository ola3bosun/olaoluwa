"use client"

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function PageTransition() {
  const containerRef = useRef(null)
  const router = useRouter()
  
  const rows = [...Array(7)]
  const textGroup = [...Array(8)].fill("OLAOLUWA")

  useGSAP(() => {
    // 1. Initialize the infinite marquees
    const leftLoop = gsap.to(".marquee-left", {
      xPercent: -50, ease: "none", duration: 8, repeat: -1, paused: true
    })
    const rightLoop = gsap.fromTo(".marquee-right", 
      { xPercent: -50 }, { xPercent: 0, ease: "none", duration: 8, repeat: -1, paused: true }
    )

    // 2. Define the trigger sequence
    const playTransition = (e) => {
      const href = e.detail
      const tl = gsap.timeline()

      // --- SETUP (Completely invisible to the user) ---
      // Force the marquee to opacity 0 and panel above screen BEFORE showing the container
      gsap.set(".marquee-container", { opacity: 0, scale: 1.1, rotate: -2 })
      gsap.set(".bg-panel", { yPercent: -100 })
      gsap.set(containerRef.current, { display: "flex", pointerEvents: "auto", zIndex: 9999 })
      
      leftLoop.timeScale(1).play()
      rightLoop.timeScale(1).play()

      // --- THE TIMELINE ---

      // Phase 1: Slam panel down completely. 
      tl.to(".bg-panel", { yPercent: 0, duration: 0.5, ease: "expo.inOut" })

      // Phase 2: Only after the screen is black, show the marquee
      tl.to(".marquee-container", { opacity: 1, duration: 0.2 }, "+=0.05")

      // Phase 3: Accelerate the marquees
      tl.to([leftLoop, rightLoop], { timeScale: 4, duration: 0.4, ease: "power2.in" }, "<")

      // Phase 4: THE SNAP (Sudden stop)
    //   tl.add(() => {
    //     leftLoop.pause()
    //     rightLoop.pause()
    //   })

      // Phase 5: Fade text out, leaving a pure black screen
    //   tl.to(".marquee-container", { opacity: 0, duration: 0.2 }, "+=0.15")

      // Phase 6: Router Push & The React Buffer
      // We push the route, then leave the screen black for 300ms ("+=0.3") 
      // so Next.js can reconcile the DOM without making GSAP stutter.
     // Tell Next.js to swap the DOM in the background
      tl.add(() => router.push(href))

      // Fade text out
      tl.to(".marquee-container", { opacity: 0, duration: 0.2 }, "+=0.5")

      // Slide Panel UP & Away
      // Next.js an 800ms buffer in the dark to resolve Sanity data
      tl.to(".bg-panel", { 
        yPercent: -100, 
        duration: 0.6, 
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(containerRef.current, { display: "none", pointerEvents: "none" })
        }
      }, "+=0.8") // 
    }

    // 3. Attach the event listener
    window.addEventListener('trigger-transition', playTransition)

    return () => {
      window.removeEventListener('trigger-transition', playTransition)
    }
  }, { scope: containerRef, dependencies: [router] })

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 flex flex-col justify-center items-center pointer-events-none overflow-hidden hidden"
    >
      <div className="absolute inset-0 bg-black bg-panel z-0" />
      
      <div className="marquee-container absolute inset-0 flex flex-col justify-center gap-2 md:gap-4 z-10 opacity-0">
        {rows.map((_, i) => (
          <div key={i} className={`flex w-max ${i % 2 === 0 ? 'marquee-left' : 'marquee-right'}`}>
            <div className="flex gap-4 md:gap-8 text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none">
              {textGroup.map((text, j) => (
                <span key={j} className={i % 2 !== 0 ? "text-transparent [-webkit-text-stroke:2px_white] opacity-40" : "text-white opacity-20"}>
                  {text}
                </span>
              ))}
            </div>
            <div className="flex gap-4 md:gap-8 text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none pl-4 md:pl-8">
              {textGroup.map((text, j) => (
                <span key={j} className={i % 2 !== 0 ? "text-transparent [-webkit-text-stroke:2px_white] opacity-40" : "text-white opacity-20"}>
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