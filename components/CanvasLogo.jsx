"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function CanvasLogo() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animationFrameId
    
    // Physics Configuration (Tuned for a heavy, brutalist snap)
    const config = {
      text: 'OD',
      density: 3,        // Spacing between particles (lower = denser)
      radius: 40,        // How close the mouse needs to be to repel
      repelForce: 2,     // How violently it pushes away
      spring: 0.15,      // How fast it snaps back to the original shape
      friction: 0.8,     // Dampening (lower = less bouncy)
      color: '#000',
      fontSize: 48,
      fontFamily: 'sans-serif',
      fontWeight: '900'
    }

    const w = 120
    const h = 60
    canvas.width = w
    canvas.height = h

    let particles = []
    let mouse = { x: -1000, y: -1000 }

    // 1. Offscreen Canvas to extract the pixel data of the text
    const initParticles = () => {
      particles = []
      const offscreen = document.createElement('canvas')
      offscreen.width = w
      offscreen.height = h
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true })

      offCtx.fillStyle = '#000'
      offCtx.font = `${config.fontWeight} ${config.fontSize}px ${config.fontFamily}`
      offCtx.textAlign = 'left'
      offCtx.textBaseline = 'middle'
      
      // Draw text to offscreen canvas
      offCtx.fillText(config.text, 10, h / 2)

      // Read the pixels
      const imgData = offCtx.getImageData(0, 0, w, h).data

      // Generate particles only where non-transparent pixels exist
      for (let y = 0; y < h; y += config.density) {
        for (let x = 0; x < w; x += config.density) {
          const index = (y * w + x) * 4
          const alpha = imgData[index + 3]
          
          if (alpha > 128) {
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0
            })
          }
        }
      }
    }

    initParticles()

    // 2. Mouse Interaction Handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // 3. The Render & Physics Loop
    const render = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = config.color

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Calculate distance from mouse
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Apply Repel Force if mouse is near
        if (dist < config.radius) {
          const force = (config.radius - dist) / config.radius
          p.vx -= (dx / dist) * force * config.repelForce
          p.vy -= (dy / dist) * force * config.repelForce
        }

        // Apply Spring Force (pulling back to original position)
        p.vx += (p.originX - p.x) * config.spring
        p.vy += (p.originY - p.y) * config.spring

        // Apply Friction (slowing it down)
        p.vx *= config.friction
        p.vy *= config.friction

        // Update Position
        p.x += p.vx
        p.y += p.vy

        // Draw the square particle (Brutalist style)
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
    <Link href="/" className="hover:opacity-70 transition-opacity cursor-pointer inline-block pointer-events-auto mix-blend-difference drop-shadow-md">
      <canvas 
        ref={canvasRef} 
        className="w-[120px] h-fit" 
        style={{ imageRendering: 'pixelated' }} // Keeps the particles sharp, not blurry
      />
    </Link>
  )
}