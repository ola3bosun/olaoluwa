"use client"

import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function TransitionLink({ href, children, className, onClick }) {
  const router = useRouter()

  const handleTransition = (e) => {
    e.preventDefault()
    
    // If there's an onClick passed down (like toggleMenu), fire it
    if (onClick) onClick(e)

    // 1. Create a temporary brutalist overlay injected directly into the DOM
    const overlay = document.createElement('div')
    overlay.className = "fixed inset-0 bg-black z-[9999] flex items-center justify-center pointer-events-none"
    overlay.style.transform = "translateY(100%)" // Start hidden at the bottom
    
    // The flashing typography
    overlay.innerHTML = `
      <h1 class="text-white text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none mix-blend-difference">
        OLAOLUWA DIYAOLU
      </h1>
    `
    document.body.appendChild(overlay)

    // 2. The GSAP Flash Slam Sequence
    const tl = gsap.timeline()

    // Slam up from the bottom
    tl.to(overlay, {
      y: "0%",
      duration: 0.5,
      ease: "power4.inOut",
      onComplete: () => {
        // Change the Next.js route while the screen is pitch black
        router.push(href)
      }
    })

    // Hold for just a fraction of a second to let Next.js render the new DOM behind the black screen
    tl.to(overlay, {
      y: "-100%",
      duration: 0.5,
      ease: "power4.inOut",
      delay: 0.5, // Tiny breath
      onComplete: () => {
        // Destroy the overlay so it doesn't clog the DOM
        overlay.remove()
      }
    })
  }

  return (
    <a href={href} onClick={handleTransition} className={className}>
      {children}
    </a>
  )
}