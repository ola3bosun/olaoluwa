"use client"

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar({ settings }) {
  const pathname = usePathname()

  // If the user is on the gallery page, render nothing
  if (pathname === '/gallery' || pathname === '/contact' || pathname === '/shop' || pathname.startsWith('/project/')) {
    return null
  }

  // Otherwise, render the Navbar and pass the Sanity settings down
  return <Navbar settings={settings} />
}