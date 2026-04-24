"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'

gsap.registerPlugin(ScrollTrigger)

// --- INVENTORY DATA ---
const inventory = [
  { id: '001', title: 'ALUMINUM CHAIR 01', category: 'FURNITURE', dims: 'W:450 H:820', price: '$1,200', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: '002', title: 'CONCRETE PLINTH', category: 'OBJECT', dims: 'W:300 H:450', price: '$650', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop', span: 'col-span-1 row-span-1' },
  { id: '003', title: 'STEEL LOUNGE', category: 'FURNITURE', dims: 'W:700 H:680', price: '$2,800', image: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=1000&auto=format&fit=crop', span: 'col-span-1 row-span-1' },
  { id: '004', title: 'ACRYLIC DESK', category: 'FURNITURE', dims: 'W:1400 H:740', price: '$3,100', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop', span: 'col-span-1 md:col-span-3 row-span-1' },
  { id: '005', title: 'BRASS LAMP 02', category: 'OBJECT', dims: 'W:150 H:400', price: '$850', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop', span: 'col-span-1 row-span-1' },
  { id: '006', title: 'OAK STOOL', category: 'FURNITURE', dims: 'W:350 H:450', price: '$450', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop', span: 'col-span-1 md:col-span-2 row-span-1' },
]

export default function ShopPage() {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const drawerRef = useRef(null)
  const overlayRef = useRef(null)
  
  const [cart, setCart] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const xMove = useRef(null)
  const yMove = useRef(null)

  useGSAP(() => {
    // 1. INITIALIZE LENIS (Heavy Exponential Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      wheelMultiplier: 1.2,
    })
    
    // Sync Lenis with GSAP's internal ticker
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // 2. VIEWPORT SCROLL REVEALS
    const items = gsap.utils.toArray('.inventory-item')
    
    items.forEach((item) => {
      gsap.fromTo(item, 
        { 
          opacity: 0, 
          y: 100, // Starts significantly lower
          scale: 0.95 // Slightly scaled down for physical weight
        }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1.2, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: item,
            start: "top 85%", // Triggers right as it enters the bottom 15% of the screen
            toggleActions: "play none none reverse" // Re-hides and re-animates if the user scrolls back up
          }
        }
      )
    })

    // 3. Custom Cursor Setup
    xMove.current = gsap.quickTo(cursorRef.current, "left", { duration: 0.2, ease: "power3.out" })
    yMove.current = gsap.quickTo(cursorRef.current, "top", { duration: 0.2, ease: "power3.out" })

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: containerRef })

  // Drawer Animation (Slam in / Pull out)
  useGSAP(() => {
    if (isDrawerOpen) {
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' })
      gsap.to(drawerRef.current, { x: '0%', duration: 0.6, ease: 'expo.out' })
    } else {
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' })
      gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' })
    }
  }, [isDrawerOpen])

  const handleAddToCart = (item) => {
    setCart(prev => [...prev, item])
    setIsDrawerOpen(true)
  }

  const handleMouseMove = (e) => {
    xMove.current?.(e.clientX)
    yMove.current?.(e.clientY)
  }

  const handleItemEnter = () => {
    gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' })
  }

  const handleItemLeave = () => {
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.2, ease: 'power2.in' })
  }

  const cartTotal = cart.reduce((total, item) => total + parseInt(item.price.replace(/\D/g,'')), 0)

  return (
    <main ref={containerRef} className="bg-transparent text-black w-full min-h-screen font-sans selection:bg-black selection:text-white" onMouseMove={handleMouseMove}>
      
      <Navbar />

      {/* HEADER */}
      <section className="w-full pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 border-b border-black/20 pb-8">
          <h1 className="text-[10vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none">
            INVENTORY.
          </h1>
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-right mb-2 md:mb-4">
            [ ARCHITECTURAL OBJECTS ]<br/>
            [ MADE TO ORDER ]
          </div>
        </div>
      </section>

      {/* THE ASYMMETRICAL GLASSMORPHIC GRID */}
      <section className="w-full px-4 md:px-8 pb-32">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 auto-rows-[400px] md:auto-rows-[500px]">
          {inventory.map((item) => (
            <div 
              key={item.id} 
              className={`inventory-item group relative overflow-hidden cursor-none ${item.span}`}
              onClick={() => handleAddToCart(item)}
              onMouseEnter={handleItemEnter}
              onMouseLeave={handleItemLeave}
            >
              {/* Isolated Product Image */}
              <div className="absolute inset-0 bg-white/40">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105" 
                />
              </div>

              {/* Glassmorphic Hover Reveal Data */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white/10 backdrop-blur-md border border-white/30 text-white mix-blend-difference p-4 md:p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-20 flex flex-col pointer-events-none">
                <div className="w-full flex justify-between items-start md:items-center border-b border-white/20 pb-4 mb-4 flex-col md:flex-row gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">{item.title}</h3>
                  <span className="font-mono text-sm font-bold">{item.price}</span>
                </div>
                <div className="w-full font-mono text-[10px] uppercase tracking-widest opacity-80 flex flex-col md:flex-row justify-between gap-2">
                  <span>NO. {item.id}</span>
                  <span>{item.category}</span>
                  <span>{item.dims} MM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOM CURSOR */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-24 h-24 -ml-12 -mt-12 rounded-full border border-white backdrop-blur-md bg-white/20 flex items-center justify-center text-center font-mono text-[8px] uppercase tracking-widest leading-tight opacity-0 scale-50 pointer-events-none z-[100] text-black mix-blend-difference"
      >
        ADD TO<br />CART
      </div>

      {/* --- GSAP CART DRAWER --- */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150] opacity-0 pointer-events-none"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 w-full md:w-[35vw] h-screen bg-[#E5E5E5] border-l border-black z-[200] transform translate-x-[100%] flex flex-col"
      >
        <div className="w-full flex justify-between items-center p-6 border-b border-black">
          <h2 className="text-3xl font-black uppercase tracking-tighter">CART [{cart.length}]</h2>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="font-mono text-xs uppercase tracking-widest hover:opacity-50 transition-opacity"
          >
            [ CLOSE X ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full p-6 flex flex-col gap-6 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest opacity-50">
              [ INVENTORY EMPTY ]
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="w-full flex justify-between items-start border-b border-black/20 pb-4">
                <div className="flex flex-col">
                  <span className="font-bold uppercase tracking-tight">{item.title}</span>
                  <span className="font-mono text-[10px] opacity-60 tracking-widest mt-1">NO. {item.id}</span>
                </div>
                <span className="font-mono text-sm">{item.price}</span>
              </div>
            ))
          )}
        </div>

        <div className="w-full flex flex-col border-t border-black">
          <div className="w-full flex justify-between items-center p-6 border-b border-black font-mono text-sm font-bold uppercase">
            <span>TOTAL</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <button className="w-full py-8 bg-black text-[#E5E5E5] text-2xl font-black uppercase tracking-tighter hover:bg-neutral-800 transition-colors">
            ACQUIRE NOW
          </button>
        </div>
      </div>
    </main>
  )
}