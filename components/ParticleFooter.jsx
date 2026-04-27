"use client"

import { useEffect, useRef } from 'react'
import TransitionLink from './TransitionLink'

export default function ParticleFooter() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animationFrameId
    
    // Physics Configuration (Heavy, Brutalist Snap)
    const config = {
      text: 'OLAOLUWA',
      density: 5,        // Lower = more particles (heavier performance). 4 is a good balance.
      radius: 100,       // Mouse interaction radius
      repelForce: 10,     // Violent push away from the cursor
      spring: 0.25,      // Snaps back quickly
      friction: 0.85,    // Slides slightly before stopping
      color: '#f4f4f4',  // Off-white to match your site's bright theme
      fontSize: 200,     // Massive typography
      fontFamily: 'serif', //pencerio
      fontWeight: '600'
    }

    // Canvas internal resolution (scaled by CSS later)
    const w = 1200
    const h = 400
    canvas.width = w
    canvas.height = h

    let particles = []
    let mouse = { x: -1000, y: -1000 }

    // Extract Pixel Data to build the particle grid
    const initParticles = () => {
      particles = []
      const offscreen = document.createElement('canvas')
      offscreen.width = w
      offscreen.height = h
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true })

      offCtx.fillStyle = '#E5E5E5'
      offCtx.font = `${config.fontWeight} ${config.fontSize}px ${config.fontFamily}`
      offCtx.textAlign = 'center'
      offCtx.textBaseline = 'middle'
      
      // Draw text dead center
      offCtx.fillText(config.text, w / 2, h / 2)

      const imgData = offCtx.getImageData(0, 0, w, h).data

      for (let y = 0; y < h; y += config.density) {
        for (let x = 0; x < w; x += config.density) {
          const index = (y * w + x) * 4
          const alpha = imgData[index + 3]
          
          if (alpha > 128) {
            particles.push({ x, y, originX: x, originY: y, vx: 0, vy: 0 })
          }
        }
      }
    }

    initParticles()

    // Mouse Tracking (Scaled for responsive CSS canvas)
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      mouse.x = (e.clientX - rect.left) * scaleX
      mouse.y = (e.clientY - rect.top) * scaleY
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // The Physics Engine Loop
    const render = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = config.color

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < config.radius) {
          const force = (config.radius - dist) / config.radius
          p.vx -= (dx / dist) * force * config.repelForce
          p.vy -= (dy / dist) * force * config.repelForce
        }

        p.vx += (p.originX - p.x) * config.spring
        p.vy += (p.originY - p.y) * config.spring
        p.vx *= config.friction
        p.vy *= config.friction

        p.x += p.vx
        p.y += p.vy

        // Draw structural square particles
        ctx.fillRect(p.x, p.y, 2, 2) 
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="w-full min-h-svh bg-black text-[#E5E5E5] flex flex-col justify-between pt-8 pb-8 px-4 md:px-8 z-20 relative overflow-hidden">
      
      {/* Top Meta */}
      <div className="w-full flex justify-between items-start font-mono text-xs uppercase tracking-widest opacity-60">
        <div>[ READY TO DESIGN? ]</div>
        <div className="text-right">ABUJA, NG<br/>HELLO@OLAOLUWA.COM</div>
      </div>

      <div className="w-full flex-1 flex items-center justify-center py-16 cursor-crosshair">
       
          <canvas 
            ref={canvasRef} 
            className="w-full h-auto object-contain mix-blend-difference"
            style={{ imageRendering: 'pixelated' }} 
          />

      </div>

      {/* Bottom Legal / Studio Meta */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40 border-t border-white/20 pt-8">
        <span>© {new Date().getFullYear()}</span>
        
        <div className="flex gap-8 mt-4 md:mt-0 pointer-events-auto">
          <a target="_blank" href="https://instagram.com/laollu_" className="hover:text-white transition-colors">IG</a>
          <a target="_blank" href="https://linkedin.com/in/olaoluwa-diyaolu" className="hover:text-white transition-colors">LN</a>
          <a target="_blank" href="https://twitter.com/Blackolaoluwa" className="hover:text-white transition-colors">X</a>
        </div>

        <span className="hidden md:block">FOR OLAOLUWA</span>
      </div>
      
    </section>
  )
}