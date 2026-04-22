"use client"

import Canvas404 from '../components/Canvas404'
import TransitionLink from '../components/TransitionLink'

export default function NotFound() {
  return (
    <main className="h-screen w-screen bg-[#E5E5E5] text-black overflow-hidden relative font-mono select-none">
      
      {/* Top Right: Brand Name */}
      <div className="absolute top-2 right-2 font-mono text-sm md:text-base font-regular tracking-widest uppercase z-50">
        OLAOLUWA
      </div>

      {/* Center Left: Escape Hatches (Brutalist Typography) */}
      <div className="absolute left-4 md:left-4 top-1/10 flex flex-col gap-2 md:gap-4 z-50">
        <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-60 mb-4">
          [ Are you trying to: ]
        </span>
        
        <TransitionLink href="/" className="text-[8vw] md:text-6xl font-black uppercase tracking-tighter leading-none hover:opacity-50 hover:translate-x-4 transition-all duration-300 origin-left">
          GO HOME
        </TransitionLink>
        <TransitionLink href="/gallery" className="text-[8vw] md:text-6xl font-black uppercase tracking-tighter leading-none hover:opacity-50 hover:translate-x-4 transition-all duration-300 origin-left">
          VIEW ARCHIVE
        </TransitionLink>
        <TransitionLink href="/about" className="text-[8vw] md:text-6xl font-black uppercase tracking-tighter leading-none hover:opacity-50 hover:translate-x-4 transition-all duration-300 origin-left">
          GET TO KNOW ME
        </TransitionLink>
        <TransitionLink href="/contact" className="text-[8vw] md:text-6xl font-black uppercase tracking-tighter leading-none hover:opacity-50 hover:translate-x-4 transition-all duration-300 origin-left">
          TALK TO ME
        </TransitionLink>
      </div>

      {/* Bottom Left: Technical Error Status */}
      <div className="absolute bottom-8 left-8 md:left-4 font-mono text-xs md:text-sm uppercase tracking-widest opacity-80 z-50">
        [ REQUESTED PAGE NOT FOUND ]
      </div>

      {/* Bottom Right: Interactive Particle 404 */}
      <div className="absolute bottom-0 right-0 w-full md:w-[60vw] h-[60vh] z-10 pointer-events-auto">
        <Canvas404 />
      </div>

    </main>
  )
}