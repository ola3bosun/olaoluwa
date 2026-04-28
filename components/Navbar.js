"use client";

import { useState, useEffect } from "react";
import TransitionLink from '@/components/TransitionLink'
import Menu from './Menu' 

export default function Navbar({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTime, setLocalTime] = useState("...");
  
  // Pad MENU with a space so it equals 5 characters, matching CLOSE perfectly for the stagger animation
  const currentText = isOpen ? "CLOSE" : "MENU ";
  const menuLetters = currentText.split("");
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const locationText = settings?.location || "ABUJA, NG";

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos", 
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setLocalTime(`${formatter.format(new Date())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[200] flex justify-between items-center p-4 md:px-8 md:pt-6 uppercase text-sm tracking-widest pointer-events-none mix-blend-difference text-[#f5f5f5]">

        <TransitionLink 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="pointer-events-auto font-mono text-xs md:text-sm font-bold tracking-widest hover:opacity-50 transition-opacity flex items-center gap-2"
        >
          <span className="opacity-50">[</span>
          O.D.
          <span className="opacity-50">]</span>
        </TransitionLink>
        
        <div className="hidden md:block text-xs opacity-80 text-center w-48 pointer-events-auto">
          {locationText} <br />
          {localTime}
        </div>
        
        <button
          className="group relative overflow-hidden w-fit flex justify-end cursor-pointer pointer-events-auto"
          onClick={toggleMenu}
        >
          <div className="flex">
            {menuLetters.map((letter, i) => (
              <span
                key={`top-${i}-${letter}`} // Added letter to key to force re-render on toggle
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:-translate-y-full"
                style={{ transitionDelay: `${i * 0.02}s` }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 flex justify-end">
            {menuLetters.map((letter, i) => (
              <span
                key={`bottom-${i}-${letter}`}
                className="inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:translate-y-0"
                style={{ transitionDelay: `${i * 0.02}s` }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </div>
        </button>
      </nav>

      <Menu isOpen={isOpen} toggleMenu={toggleMenu} settings={settings} />
    </>
  );
}