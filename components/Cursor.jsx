"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)
  // 3-States: 'default' | 'hover' | 'hidden'
  const [cursorMode, setCursorMode] = useState('default')

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
      // If we enter the gallery's custom interaction zone, hide the global cursor
      if (e.target.closest('.hide-global-cursor')) {
        setCursorMode('hidden')
        return
      }
      // If hover over a link or button, do the hollow animation
      if (e.target.closest('a, button, Link, .cursor-pointer')) {
        setCursorMode('hover')
        return
      }
      // Otherwise, just be the default dot
      setCursorMode('default')
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  // Animate based on the current state
  useEffect(() => {
    if (cursorMode === 'hidden') {
      gsap.to(cursorRef.current, {
        opacity: 0, scale: 0, duration: 0.3, ease: "power3.out"
      })
    } else if (cursorMode === 'hover') {
      gsap.to(cursorRef.current, {
        opacity: 1, scale: 1.5, rotation: 180, backgroundColor: "transparent", border: "1px solid white", duration: 0.4, ease: "back.out(1.5)"
      })
    } else {
      gsap.to(cursorRef.current, {
        opacity: 1, scale: 1, rotation: 0, backgroundColor: "white", border: "0px solid transparent", duration: 0.3, ease: "power3.out"
      })
    }
  }, [cursorMode])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: "transform" }}
    />
  )
}