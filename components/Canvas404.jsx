"use client"

import { useEffect, useRef } from 'react'

export default function Canvas404() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animationFrameId
    
    const config = {
      text: '404',
      density: 5,        
      radius: 150,       // Increased radius for the larger text
      repelForce: 4,     // Slightly stronger push
      spring: 0.1,       
      friction: 0.85,    
      color: '#000000',  
      fontSize: 350,     // Massive typography to match wireframe
      fontFamily: 'sans-serif',
      fontWeight: '900'
    }

    // Widen the canvas to fit the massive font
    const w = 1000 
    const h = 500
    canvas.width = w
    canvas.height = h

    let particles = []
    let mouse = { x: -1000, y: -1000 }

    const initParticles = () => {
      particles = []
      const offscreen = document.createElement('canvas')
      offscreen.width = w
      offscreen.height = h
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true })

      offCtx.fillStyle = '#000000'
      offCtx.font = `${config.fontWeight} ${config.fontSize}px ${config.fontFamily}`
      
      // ALIGN RIGHT: This ensures it hugs the right side of your layout
      offCtx.textAlign = 'right'
      offCtx.textBaseline = 'middle'
      offCtx.fillText(config.text, w - 20, h / 2)

      const imgData = offCtx.getImageData(0, 0, w, h).data

      for (let y = 0; y < h; y += config.density) {
        for (let x = 0; x < w; x += config.density) {
          const index = (y * w + x) * 4
          const alpha = imgData[index + 3]
          
          if (alpha > 128) {
            particles.push({
              x: x, y: y, originX: x, originY: y, vx: 0, vy: 0
            })
          }
        }
      }
    }

    initParticles()

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

        ctx.fillRect(p.x, p.y, 3, 3) 
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
    <div className="w-full h-full cursor-crosshair flex justify-end items-end">
      <canvas 
        ref={canvasRef} 
        className="w-full max-w-[1000px] h-auto object-contain" 
        style={{ imageRendering: 'pixelated' }} 
      />
    </div>
  )
}