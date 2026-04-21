"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    gsap.set(cursor, { xPercent: -50, yPercent: -50 })

    const xMove = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" })
    const yMove = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" })

    const onMouseMove = (e) => {
      xMove(e.clientX)
      yMove(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, Link, .cursor-pointer')
      if (target) setIsHovering(true)
    }

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, Link, .cursor-pointer')
      if (target) setIsHovering(false)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mouseout", handleMouseOut)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mouseout", handleMouseOut)
    }
  }, [])

  useEffect(() => {
    if (isHovering) {
      gsap.to(cursorRef.current, {
        scale: 1.5,
        rotation: 180,
        backgroundColor: "transparent",
        border: "1px solid white", 
        duration: 0.4,
        ease: "back.out(1.5)"
      })
    } else {
      gsap.to(cursorRef.current, {
        scale: 1,
        rotation: 0,
        backgroundColor: "white", 
        border: "0px solid transparent",
        duration: 0.3,
        ease: "power3.out"
      })
    }
  }, [isHovering])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: "transform" }}
    />
  )
}