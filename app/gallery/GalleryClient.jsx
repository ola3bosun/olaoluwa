"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { useGSAP } from '@gsap/react'
import TransitionLink from '@/components/TransitionLink'

gsap.registerPlugin(Observer)

// FALLBACK DATA (Used only if Sanity is empty during testing)
const fallbackProjects = [
  { _id: '1', category: "ARCHITECTURE", title: "Ikoyi Residence", location: "Lagos, NG", year: "2023", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
  { _id: '2', category: "ARCHITECTURE", title: "Concrete Pavilion", location: "Kano, NG", year: "2023", imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" },
  { _id: '3', category: "ARCHITECTURE", title: "The Brutalist Box", location: "Abuja, NG", year: "2024", imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6" },
  { _id: '4', category: "INTERIOR", title: "Minimalist Loft", location: "London, UK", year: "2022", imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267" },
  { _id: '5', category: "INTERIOR", title: "Studio Light", location: "Lagos, NG", year: "2023", imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0" },
  { _id: '6', category: "FURNITURE", title: "Steel Desk 01", location: "Workshop", year: "2022", imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1" },
  { _id: '7', category: "FURNITURE", title: "Lounge Chair", location: "Studio", year: "2023", imageUrl: "https://images.unsplash.com/photo-1506898667547-42e22a46e125" },
]

export default function GalleryClient({ initialProjects }) {
  const containerRef = useRef(null)
  
  // Strict DOM Refs
  const imagesRef = useRef([])
  const textsRef = useRef([])
  const tabsRef = useRef([])
  const indicatorRef = useRef(null)
  const cursorRef = useRef(null)
  
  // Animation & Tracking Refs
  const isAnimating = useRef(false)
  const isCategoryTransition = useRef(false)
  const currentIndexRef = useRef(0)
  const xMove = useRef(null)
  const yMove = useRef(null)
  
  // State
  const [activeCategory, setActiveCategory] = useState('ARCHITECTURE')
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = ['ARCHITECTURE', 'INTERIOR', 'FURNITURE']

  // INJECT SANITY DATA HERE
  // If Sanity returns an array with items, use it. Otherwise, use the fallback.
  const allProjects = initialProjects?.length > 0 ? initialProjects : fallbackProjects
  
  const filteredProjects = allProjects.filter(p => p.category.toUpperCase() === activeCategory)

  // PREVENT GHOSTING: Strictly assign exact array length before render
  imagesRef.current = new Array(filteredProjects.length).fill(null)
  textsRef.current = new Array(filteredProjects.length).fill(null)

  useGSAP(() => {
    xMove.current = gsap.quickTo(cursorRef.current, "left", { duration: 0.4, ease: "power3.out" })
    yMove.current = gsap.quickTo(cursorRef.current, "top", { duration: 0.4, ease: "power3.out" })
  })

  useGSAP(() => {
    const activeIdx = categories.indexOf(activeCategory)
    const activeTab = tabsRef.current[activeIdx]
    
    if (activeTab && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        duration: 0.6,
        ease: "expo.out"
      })
    }
  }, [activeCategory])

  // CATEGORY SWITCH LOGIC
 const handleCategorySwitch = (targetCat) => {
    if (targetCat === activeCategory || isAnimating.current) return

    const currentImg = imagesRef.current[currentIndexRef.current]
    const currentText = textsRef.current[currentIndexRef.current]

    // 1. Filter out any null/undefined elements safely
    const targets = [currentImg, currentText].filter(Boolean)

    // 2. If the current category was empty, there's nothing to slide out. Just switch immediately.
    if (targets.length === 0) {
      currentIndexRef.current = 0
      setCurrentIndex(0)
      setActiveCategory(targetCat)
      return
    }

    // 3. Otherwise, lock the animation state and slide out violently
    isAnimating.current = true
    isCategoryTransition.current = true

    gsap.to(targets, {
      xPercent: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Only switch React state AFTER the exit animation finishes
        currentIndexRef.current = 0
        setCurrentIndex(0)
        setActiveCategory(targetCat)
      }
    })
  }

  // INITIALIZATION & CATEGORY INCOMING ANIMATION
  useGSAP(() => {
    gsap.set(imagesRef.current, { opacity: 0, zIndex: 0, clearProps: "transform" })
    gsap.set(textsRef.current, { opacity: 0, zIndex: 0, clearProps: "transform", yPercent: 100 })
    
    const firstImg = imagesRef.current[0]
    const firstText = textsRef.current[0]

    if (firstImg && firstText) {
      if (isCategoryTransition.current) {
        // If we are arriving from a category switch, slide in from the right
        gsap.fromTo(firstImg, 
          { xPercent: 100, opacity: 0, zIndex: 1 }, 
          { xPercent: 0, opacity: 1, duration: 0.8, ease: "power3.inOut" }
        )
        gsap.fromTo(firstText,
          { xPercent: 100, opacity: 0, zIndex: 1, yPercent: 0 },
          { xPercent: 0, opacity: 1, duration: 0.8, ease: "power3.inOut", 
            onComplete: () => {
              isAnimating.current = false
              isCategoryTransition.current = false
            }
          }
        )
      } else {
        // Standard hard-load reveal
        gsap.set(firstImg, { opacity: 1, zIndex: 1 })
        gsap.set(firstText, { opacity: 1, zIndex: 1, yPercent: 0 })
      }
    }
  }, { dependencies: [activeCategory], scope: containerRef })

  // MASTER VERTICAL SLIDE ENGINE
  const gotoSlide = (targetIndex, direction) => {
    if (isAnimating.current || targetIndex === currentIndexRef.current) return
    isAnimating.current = true

    const currentImg = imagesRef.current[currentIndexRef.current]
    const nextImg = imagesRef.current[targetIndex]
    const currentText = textsRef.current[currentIndexRef.current]
    const nextText = textsRef.current[targetIndex]

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndexRef.current = targetIndex
        setCurrentIndex(targetIndex)
        isAnimating.current = false
      }
    })

    // Outgoing Vertical
    tl.to(currentImg, { yPercent: direction * -15, scale: 0.85, opacity: 0, duration: 1, ease: "power3.inOut" }, 0)
    tl.to(currentText, { yPercent: direction * -100, opacity: 0, duration: 0.8, ease: "power3.inOut" }, 0)

    // Incoming Setup
    gsap.set(nextImg, { yPercent: direction * 15, xPercent: 0, scale: 1.15, opacity: 0, zIndex: 10 })
    gsap.set(nextText, { yPercent: direction * 100, xPercent: 0, opacity: 0, zIndex: 10 })

    // Incoming Vertical
    tl.to(nextImg, { yPercent: 0, scale: 1, opacity: 1, duration: 1, ease: "power3.inOut" }, 0)
    tl.to(nextText, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.2)

    tl.set([currentImg, currentText], { zIndex: 0 })
  }

  // EVENT BINDINGS (Scroll & Arrows)
  useGSAP(() => {
    const handleNext = () => {
      const nextIdx = (currentIndexRef.current + 1) % filteredProjects.length
      gotoSlide(nextIdx, 1)
    }

    const handlePrev = () => {
      const prevIdx = (currentIndexRef.current - 1 + filteredProjects.length) % filteredProjects.length
      gotoSlide(prevIdx, -1)
    }

    // 1. Observer Engine
    const observer = Observer.create({
      target: containerRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 40, // Increased tolerance to stop trackpad twitching
      preventDefault: true,
      onUp: handleNext,   
      onDown: handlePrev 
    })

    // 2. Arrow Keys Engine
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') handleNext()
      if (e.key === 'ArrowUp') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      observer.kill()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, { dependencies: [activeCategory], scope: containerRef }) // Only rebuild bindings if the category data changes entirely

  // Mouse Overlays
  const handleMouseMove = (e) => {
    xMove.current?.(e.clientX) 
    yMove.current?.(e.clientY)  
  }
  const handleMouseEnter = () => {
    gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" })
  }
  const handleMouseLeave = () => {
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.out" })
  }

  return (
    <main ref={containerRef} className="h-screen w-screen bg-black text-white overflow-hidden relative font-sans flex flex-col select-none">
      
      {/* ABSOLUTE FULL-BLEED IMAGES */}
     <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        
        {/* EMPTY STATE */}
        {filteredProjects.length === 0 && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center font-mono text-sm uppercase tracking-widest opacity-50">
            [ NO PROJECTS IN THIS CATEGORY ]
          </div>
        )}

        {filteredProjects.map((project, idx) => (
          <div 
            key={`img-${project._id}`}
            ref={(el) => { if (el) imagesRef.current[idx] = el }}
            className="absolute inset-0 w-full h-full"
          >
            <Image 
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="100vw"
              priority={idx === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
          </div>
        ))}
      </div>

      {/* 2. FLOATING TOP NAV & SLIDING INDICATOR */}
      <nav className="absolute top-0 left-0 w-full p-4 md:px-8 md:pt-6 flex justify-between items-center uppercase font-mono text-xs md:text-sm tracking-widest z-50 pointer-events-none">
        <div className="w-32 flex justify-start pointer-events-auto">
          <TransitionLink href="/" className="hover:opacity-50 transition-opacity cursor-pointer drop-shadow-md">
            &lt;- BACK
          </TransitionLink>
        </div>

        <div className="relative flex gap-4 md:gap-8 text-[10px] md:text-sm font-bold pointer-events-auto drop-shadow-md pb-2">
          <div ref={indicatorRef} className="absolute bottom-0 h-[2px] bg-white pointer-events-none" />
          
          {categories.map((cat, i) => (
            <button 
              key={cat}
              ref={el => tabsRef.current[i] = el}
              onClick={() => handleCategorySwitch(cat)}
              className={`transition-opacity duration-300 ${activeCategory === cat ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-32 flex justify-end font-bold drop-shadow-md">
          OLAOLUWA
        </div>
      </nav>

      {/* 3. FLOATING LEFT THUMBNAILS */}
      <div className="absolute left-0 top-0 h-full hidden md:flex flex-col justify-center pl-8 gap-4 w-[12%] z-20 pointer-events-none">
        {filteredProjects.map((project, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={`thumb-${project._id}`}
              onClick={() => {
                const direction = idx > currentIndexRef.current ? 1 : -1;
                gotoSlide(idx, direction);
              }}
              className={`relative w-full aspect-[4/3] rounded-md overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer pointer-events-auto ${
                isActive ? 'opacity-100 scale-110 shadow-2xl shadow-black/50 grayscale-0' : 'opacity-30 scale-95 hover:opacity-70 grayscale'
              }`}
            >
              <Image 
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="12vw"
                className="object-cover"
              />
            </button>
          )
        })}
      </div>

      {/* 4. ANIMATED DATA OVERLAYS */}
      <div className="absolute bottom-0 right-0 p-4 md:p-8 flex flex-col items-end w-full h-[30vh] overflow-hidden z-20 pointer-events-none">
        {filteredProjects.map((project, idx) => (
          <div 
            key={`data-${project._id}`}
            ref={el => { if (el) textsRef.current[idx] = el }}
            className="absolute bottom-8 right-8 flex flex-col items-end text-right font-mono text-xs md:text-sm uppercase tracking-widest text-white drop-shadow-md"
          >
            <span className="font-bold text-xl md:text-3xl mb-1">{project.title}</span>
            <span className="opacity-80">{project.location}</span>
            <span className="opacity-60 mt-2 text-[10px] md:text-xs">[{project.year}]</span>
          </div>
        ))}
      </div>

      {/* 5. CUSTOM CURSOR & HOVER INTERACTION LAYER */}
      <div 
        className="hide-global-cursor absolute inset-0 z-30 ml-[15%] cursor-none pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          // Only fire if the project actually exists
          if (filteredProjects[currentIndex]) {
            console.log('Route to project:', filteredProjects[currentIndex]._id)
          }
        }}
      />
      
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-24 h-24 -ml-12 -mt-12 rounded-full border border-white/50 backdrop-blur-sm bg-black/10 flex items-center justify-center text-center font-mono text-[8px] uppercase tracking-widest leading-tight opacity-0 scale-50 pointer-events-none z-[100]"
      >
        View<br />Project
      </div>

    </main>
  )
}