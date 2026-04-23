"use client"

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Menu from '../../components/Menu'

export default function Studio() {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <main className="h-screen w-screen bg-[#E5E5E5] text-black overflow-hidden relative font-sans flex flex-col">
      
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />

      <div className="flex-1 w-full p-4 md:p-8">
        <h1 className="uppercase text-5xl md:text-7xl font-bold tracking-tighter">
          SHOP.
        </h1>
      </div>

      <Menu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(false)} />
      
    </main>
  )
}