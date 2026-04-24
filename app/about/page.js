"use client"

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

import Navbar from '@/components/Navbar'
import ParticleFooter from '@/components/ParticleFooter'

gsap.registerPlugin(ScrollTrigger)

const capabilities = [
  { 
    id: '01', 
    title: 'Architecture', 
    desc: 'STRUCTURAL HONESTY & SPATIAL PURITY',
    materials: 'CONCRETE / STEEL / GLASS',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: '02', 
    title: 'Interior', 
    desc: 'ATMOSPHERE THROUGH LIGHT & SHADOW',
    materials: 'TIMBER / STONE / LINEN',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop' 
  },
  { 
    id: '03', 
    title: 'Object', 
    desc: 'UTILITARIAN FORM & BESPOKE CRAFT',
    materials: 'ALUMINUM / BRASS / LEATHER',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1600&auto=format&fit=crop' 
  }
]

export default function AboutPage() {
  const containerRef = useRef(null)
  
  const trackRef = useRef(null)
  const dossierRef = useRef(null)
  
  const imagesRef = useRef([])
  const dossierListRef = useRef([])

  useGSAP(() => {
    // 1. INITIALIZE LENIS
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

    // 2. HERO IMAGE EXPANSION MATH (FIXED)
    // Animating to 100% (instead of 100vw) fixes the scrollbar overflow bug.
    // Animating height to 100vh ensures it scales fully in both directions.
    gsap.to('.hero-image-wrapper', {
      width: "100%",
      height: "100vh",
      borderWidth: "0px",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-container",
        start: "top top",
        end: "50vh", 
        scrub: true,
      }
    })

    // 3. HERO IMAGE PIN
    ScrollTrigger.create({
      trigger: ".image-pin-anchor",
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: false,
    })

    // 4. PARALLAX ENGAGEMENT
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

    // 5. HORIZONTAL PIN ENGINE (Section 3)
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
        scrollTrigger: { trigger: dossier, start: "top 80%" }
      })

      dossierListRef.current.forEach((item) => {
        gsap.fromTo(item, 
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, ease: "power3.out", duration: 1,
            scrollTrigger: { trigger: item, start: "top 85%" }
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
      
      <Navbar />

      {/* SECTION 1: EDITORIAL HERO */}
      <section className="hero-container relative w-full bg-[#E5E5E5] z-0 flex flex-col h-[150vh]">
        <div className="w-full h-[50vh] flex flex-col items-center justify-end pb-8 md:pb-12">
          <h1 className="text-[15vw] md:text-[13vw] font-normal tracking-tight leading-none text-center text-black">
            OLAOLUWA
          </h1>
        </div>

        {/* The wrapper is now a flex container (justify-center) to naturally keep the image centered as it scales */}
        <div className="image-pin-anchor w-full h-[100vh] relative z-10 flex justify-center items-start">
           
           {/* Starts at 90% width and 80vh height. Scales up to 100% and 100vh */}
           <div className="hero-image-wrapper w-[90%] h-[70vh] md:h-[80vh] overflow-hidden bg-neutral-300 border border-black relative" ref={el => imagesRef.current[0] = el}>
              <Image
                 src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
                 alt="Olaoluwa Portrait"
                 fill
                 priority
                 className="object-cover scale-110 grayscale" // Added grayscale for monochrome
              />
           </div>

        </div>
      </section>

      {/* SECTION 2: ASYMMETRICAL GLASSMORPHIC PHILOSOPHIES */}
      <section className="relative w-full min-h-screen z-20 pt-32 pb-32 bg-transparent">
        <div className="w-full px-4 md:px-8 max-w-7xl mx-auto">
          
          <div className="font-mono text-xs uppercase tracking-widest text-white mix-blend-difference opacity-80 mb-12">
            [ 01 // PHILOSOPHIES ]
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-auto">
            
            <div className="md:col-span-8 p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 text-white flex flex-col justify-between min-h-[40vh] md:min-h-[50vh] hover:bg-white/20 transition-colors duration-500">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                Form Follows<br/>Absolute<br/>Function.
              </h2>
              <p className="font-mono text-xs md:text-sm mt-12 max-w-sm opacity-80 uppercase tracking-widest leading-relaxed">
                Good Design is as little design as possible. I strive to create work that is honest in its materiality and efficient in its use of resources, while still being poetic and engaging to experience.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
              <div className="flex-1 p-8 backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors duration-500 flex flex-col justify-end">
                 <span className="font-mono text-xs opacity-50 mb-2">[ 01 ]</span>
                 <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Material<br/>Honesty</h3>
              </div>
              <div className="flex-1 p-8 backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors duration-500 flex flex-col justify-end">
                 <span className="font-mono text-xs opacity-50 mb-2">[ 02 ]</span>
                 <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Spatial<br/>Tension</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: HORIZONTAL GLASSMORPHIC CAPABILITIES */}
      <section className="horizontal-fold relative w-full h-screen bg-transparent overflow-hidden hidden md:flex items-center z-20">
        <div className="absolute top-8 left-8 font-mono text-xs uppercase tracking-widest text-white mix-blend-difference opacity-80 z-10">
          [ 02 // CAPABILITIES ]
        </div>
        
        <div ref={trackRef} className="flex h-full w-max items-center pl-[5vw] md:pl-[10vw]">
          
          {capabilities.map((item) => (
            <div key={item.id} className="relative w-[85vw] md:w-[45vw] h-[60vh] mr-[5vw] overflow-hidden group cursor-none border border-white/20 bg-white/5 backdrop-blur-sm">
                
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105" 
                />

                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 backdrop-blur-md bg-white/10 border border-white/30 p-6 text-white translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col pointer-events-none">
                  
                  <div className="w-full flex justify-between items-end border-b border-white/30 pb-4 mb-4">
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">{item.title}</h3>
                    <span className="font-mono text-sm opacity-80">NO. {item.id}</span>
                  </div>
                  
                  <div className="w-full font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-80 flex flex-col md:flex-row justify-between gap-2">
                    <span>{item.desc}</span>
                    <span className="font-bold">{item.materials}</span>
                  </div>

                </div>
            </div>
          ))}

        </div>
      </section>

      {/* SECTION 4: THE DOSSIER */}
      <section className="technical-dossier dossier-grid w-full pt-32 pb-16 px-4 md:px-8 bg-[#E5E5E5] z-30 relative" ref={dossierRef}>
         <div className="max-w-7xl mx-auto">
           <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-16 relative z-10">
            [ 03 // EXPERIENCE & RECOGNITION ]
          </div>

          <div className="w-full flex flex-col font-sans uppercase">
            {[
              { year: "2017 - 2022", title: "JOB TITLE 1", role: "INTERIO DESIGN LEAD", detail: "olaoluwa.studio" },
              { year: "2017 - 2022", title: "JOB TITLE 2", role: "INTERIO DESIGN LEAD", detail: "olaoluwa.studio" },
              { year: "2017 - 2022", title: "JOB TITLE 3", role: "INTERIO DESIGN LEAD", detail: "olaoluwa.studio" },
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
         </div>
      </section>

      {/* SECTION 5: MASSIVE CTA FOOTER */}
      <ParticleFooter />

    </main>
  )
}