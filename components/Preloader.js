"use client"

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

export default function Preloader() {
  const [isComplete, setIsComplete] = useState(false)
  
  const containerRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    // 1. Lock the scroll so the user can't move during loading
    document.body.style.overflow = 'hidden'

    // 2. The GSAP Context
    const ctx = gsap.context(() => {
      
      // We animate a dummy object to drive the numbers
      const progress = { value: 0 }

      // The Main Loading Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // 3. The Exit Sequence
          const exitTl = gsap.timeline({
            onComplete: () => {
              document.body.style.overflow = 'auto' // Unlock scroll
              setIsComplete(true) // Unmount component
            }
          })

          exitTl
            .to(textRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
            .to(barRef.current, { scaleY: 0, transformOrigin: "top", duration: 0.4, ease: "power2.in" }, "-=0.2")
            .to(containerRef.current, {
              yPercent: -100, // Violent slide up to reveal the site
              duration: 1.2,
              ease: "expo.inOut"
            }, "-=0.2")
        }
      })

      // Animate the counter from 0 to 100
      tl.to(progress, {
        value: 100,
        duration: 2, // Base duration (adjust this to feel right)
        ease: "power2.out", // Fast at first, slows down at the end
        onUpdate: () => {
          if (counterRef.current) {
            // Update the DOM with the rounded number
            counterRef.current.innerHTML = Math.round(progress.value)
          }
        }
      })

      // Animate the loading bar width alongside the numbers
      tl.fromTo(barRef.current, 
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: "power2.out", transformOrigin: "left" },
        0 // Start at exactly the same time as the counter
      )

      // Fallback: If the window is already fully loaded, speed up the timeline
      if (document.readyState === 'complete') {
        tl.timeScale(2) // Run twice as fast
      } else {
        window.addEventListener('load', () => {
          tl.timeScale(2) // Speed up to finish the animation when the window finishes loading
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Once the exit animation finishes, remove this component from the DOM completely
  if (isComplete) return null

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-999 bg-[#111111] text-[#E5E5E5] flex flex-col justify-end p-4 md:p-8 font-mono select-none"
    >
      <div className="w-full flex flex-col" ref={textRef}>
        
        <div className="w-full flex justify-between items-end mb-4">
          <div className="text-xs uppercase tracking-widest opacity-50 flex flex-col">
            <span>OLAOLUWA DIYAOLU</span>
            <span>LOADING EXPERIENCE</span>
          </div>
          
          <div className="text-5xl md:text-8xl font-black tracking-tighter leading-none flex items-baseline">
            <span ref={counterRef}>0</span>
            <span className="text-lg md:text-2xl ml-1 opacity-50">%</span>
          </div>
        </div>

        {/* The thin tracking bar */}
        <div className="w-full h-px bg-white/20 relative">
          <div 
            ref={barRef} 
            className="absolute top-0 left-0 w-full h-full bg-white origin-left" 
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        
      </div>
    </div>
  )
}