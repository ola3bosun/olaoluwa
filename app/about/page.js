"use client"

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import ParticleFooter from '@/components/ParticleFooter'

// Import your existing Navbar component
import Navbar from '@/components/Navbar'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const containerRef = useRef(null)
  
  // DOM Refs
  const trackRef = useRef(null)
  const dossierRef = useRef(null)
  
  // Ref arrays for bulk operations
  const imagesRef = useRef([])
  const dossierListRef = useRef([])

  useGSAP(() => {
    // 1. INITIALIZE LENIS (The Smooth Scroll Engine)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      wheelMultiplier: 1.2,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // 2. HERO IMAGE EXPANSION MATH
    // Animates width and left position EXACTLY over the 50vh scroll gap
    gsap.to('.hero-image-wrapper', {
      width: "100vw",
      left: "0vw",
      borderWidth: "0px", // Seamlessly removes the thin wireframe border
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-container",
        start: "top top",
        end: "50vh", // Exactly the distance required for the image to hit the top of viewport
        scrub: true,
      }
    })

    // 3. HERO IMAGE PIN
    // The exact moment the wrapper hits the top, pin it to the background for the next 100vh
    ScrollTrigger.create({
      trigger: ".image-pin-anchor",
      start: "top top",
      end: "+=100%", // Pins for 100vh of scrolling
      pin: ".hero-image-wrapper",
      pinSpacing: false, // Ensures Section 2 scrolls UP and OVER the pinned image
    })

    // 4. PARALLAX ENGAGEMENT (Universal Depth on all images)
    imagesRef.current.forEach((imageWrapper) => {
      const image = imageWrapper?.querySelector('img')
      if (!image) return
      
      gsap.to(image, {
        yPercent: () => -20, 
        ease: "none",
        scrollTrigger: {
          trigger: imageWrapper,
          start: "top bottom", 
          end: "bottom top",    
          scrub: true,
          invalidateOnRefresh: true,
        }
      })
    })

    // 5. HORIZONTAL PIN ENGINE (For Section 3)
    let mm = gsap.matchMedia()
    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current
      
      if (track) {
        gsap.to(track, {
          xPercent: -100,
          x: () => window.innerWidth, 
          ease: "none",
          scrollTrigger: {
            trigger: ".horizontal-fold",
            start: "top top",
            end: () => "+=" + track.offsetWidth, 
            pin: true,
            scrub: 1, 
            invalidateOnRefresh: true,
          }
        })
      }
    })

    // 6. THE DOSSIER ENGINE (Section 4)
    const dossier = dossierRef.current
    if (dossier) {
      gsap.fromTo(gsap.utils.toArray('.dossier-grid-border', dossier), {
        scaleX: 0,
      }, {
        scaleX: 1,
        duration: 1.5,
        ease: "expo.inOut",
        stagger: 0.15,
        scrollTrigger: { trigger: dossier, start: "top 70%" }
      })

      dossierListRef.current.forEach((item) => {
        gsap.fromTo(item, 
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, ease: "power3.out", duration: 1,
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        )
      })
    }

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className="bg-[#E5E5E5] text-black w-full min-h-screen font-sans selection:bg-black selection:text-white">
      
      {/* 1. IMPORTED GLOBAL NAV */}
      <Navbar />

      {/* SECTION 1: EDITORIAL HERO */}

      <section className="hero-container relative w-full bg-[#E5E5E5] z-0 flex flex-col h-[150vh]">
      
      </section>

      {/* SECTION 2: YOUR CUSTOM VERTICAL DESIGN */}
      {/* Because pinSpacing is false on the hero, this section will mathematically scroll UP and OVER the pinned image */}
      <section className="relative w-full min-h-screen z-20 pt-32">
        <div className="w-full px-4 md:px-8 max-w-7xl mx-auto">
          
          
          <div className="font-mono text-xs uppercase tracking-widest text-white mix-blend-difference opacity-80 mb-12">
            [ 01 // PHILOSOPHIES ]
          </div>
          
        </div>
      </section>

      {/* SECTION 3: YOUR CUSTOM HORIZONTAL SCROLL */}
      <section className="horizontal-fold relative w-full h-screen bg-black text-[#E5E5E5] overflow-hidden hidden md:flex items-center z-20">
        <div className="absolute top-8 left-8 font-mono text-xs uppercase tracking-widest opacity-50 z-10">
          [ 02 // CAPABILITIES ]
        </div>
        
        <div ref={trackRef} className="flex h-full w-max items-center pl-[10vw]">
          {/* YOU DESIGN THIS: Drop your horizontal cards/slides here */}
          <div className="w-[50vw] h-[50vh] bg-neutral-800 mr-[10vw]">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none p-6">
                ARCHITECTURE
              </h2>
          </div>
          <div className="w-[50vw] h-[50vh] bg-neutral-800 mr-[10vw]">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none p-6">
                ARCHITECTURE
              </h2>
          </div>
          <div className="w-[50vw] h-[50vh] bg-neutral-800 mr-[10vw]">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none p-6">
                ARCHITECTURE
              </h2>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE DOSSIER */}
      <section className="technical-dossier dossier-grid w-full pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto bg-[#E5E5E5] z-20" ref={dossierRef}>
         <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-16 relative z-10">
          [ 03 // EXPERIENCE & RECOGNITION ]
        </div>

        <div className="w-full flex flex-col font-sans uppercase">
          {[
            { year: "2024", title: "AWWWARDS", role: "SITE OF THE DAY [NOMINEE]", detail: "olaoluwa.studio" },
            { year: "2023 - PRESENT", title: "OLAOLUWA STUDIO", role: "PRINCIPAL ARCHITECT", detail: "Abuja, NG" },
            { year: "2021 - 2023", title: "BRUTALIST ATELIER", role: "LEAD DESIGNER", detail: "Remote" },
            { year: "2020", title: "THE ARCHITECTURAL REVIEW", role: "EMERGING TALENT AWARD", detail: "Publication" }
          ].map((item, index) => (
            <div key={item.title} className="relative w-full py-12 flex flex-col md:flex-row justify-between items-start gap-8 group cursor-none pointer-events-auto dossier-item" ref={el => dossierListRef.current[index] = el}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-black grid-border origin-left dossier-grid-border" />
              <div className="flex flex-col md:flex-row md:items-end flex-1 gap-4 md:gap-16 z-10 relative pointer-events-none dossier-data-overlay">
                  <span className="font-mono text-xl md:text-2xl w-48 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-md">
                    [{item.year}]
                  </span>
                  <div className="flex flex-col md:flex-row md:items-baseline flex-1 gap-2">
                    <h3 className="text-4xl md:text-6xl font-normal tracking-tight group-hover:translate-x-4 transition-transform duration-500 origin-left drop-shadow-md">
                      {item.title}
                    </h3>
                    <div className="flex flex-col md:items-end flex-1 gap-1 text-left md:text-right drop-shadow-md">
                        <span className="font-sans text-sm md:text-base tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.role}
                        </span>
                        <span className="font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity tracking-widest">
                           {item.detail}
                        </span>
                    </div>
                  </div>
              </div>
            </div>
          ))}
          <div className="relative w-full h-[1px] bg-black grid-border origin-left dossier-grid-border" />
        </div>
      </section>
      <ParticleFooter />
    </main>
  )
}