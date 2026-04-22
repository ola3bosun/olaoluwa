"use client"

import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function TransitionLink({ href, children, className, onClick, ...props }) {
  const router = useRouter()

  const handleTransition = (e) => {
    e.preventDefault()
    
    if (onClick) onClick(e)

    const overlay = document.createElement('div')
    overlay.className = "fixed inset-0 bg-black z-[9999] flex items-center justify-center pointer-events-none"
    overlay.style.transform = "translateY(100%)"
    
    overlay.innerHTML = `
      <h1 class="text-white text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none mix-blend-difference">
        LOADING.
      </h1>
    `
    document.body.appendChild(overlay)

    const tl = gsap.timeline()

    tl.to(overlay, {
      y: "0%",
      duration: 0.5,
      ease: "expo.inOut",
      onComplete: () => {
        router.push(href)
      }
    })

    tl.to(overlay, {
      y: "-100%",
      duration: 0.5,
      ease: "expo.inOut",
      delay: 0.2, 
      onComplete: () => {
        overlay.remove()
      }
    })
  }

  return (
    <a href={href} onClick={handleTransition} className={className} {...props}>
      {children}
    </a>
  )
}