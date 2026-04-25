"use client"

import { usePathname } from 'next/navigation'

export default function TransitionLink({ href, children, className, onClick, onMouseEnter, onMouseLeave, onMouseMove }) {
  const pathname = usePathname()

  const handleClick = (e) => {
    e.preventDefault()
    
    // If you passed an onClick (like toggleMenu to close the mobile menu), run it first
    if (onClick) onClick(e)

    // Don't animate if the user clicks a link to the page they are already on
    if (pathname === href) return

    // Fire the global transition event!
    window.dispatchEvent(new CustomEvent('trigger-transition', { detail: href }))
  }

  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {children}
    </a>
  )
}