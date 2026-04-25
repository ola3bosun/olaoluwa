"use client";

import { useState, useEffect } from "react";
import TransitionLink from '@/components/TransitionLink'
import Menu from './Menu' // Import the heavy GSAP menu we built

export default function Navbar({ settings }) {
  // 1. Manage the Menu state here globally
  const [isOpen, setIsOpen] = useState(false);
  const [localTime, setLocalTime] = useState("...");
  
  const menuLetters = "MENU".split("");
  const toggleMenu = () => setIsOpen(!isOpen);

  // 2. Consume dynamic Sanity data with a fallback
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
      {/* Note: I changed this to `fixed` and `mix-blend-difference text-white`. 
        Since this now wraps every single page from layout.jsx, it needs to float 
        above your hero images and invert its color automatically over dark/light backgrounds.
      */}
      <nav className="fixed top-0 left-0 w-full z-40 flex justify-between items-center p-4 md:px-8 md:pt-6 uppercase font-mono text-sm tracking-widest pointer-events-none mix-blend-difference text-white">
        
        <TransitionLink href="/" className="pointer-events-auto hover:opacity-50 transition-opacity" >
          OD
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
                key={`top-${i}`}
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                style={{ transitionDelay: `${i * 0.02}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 flex justify-end">
            {menuLetters.map((letter, i) => (
              <span
                key={`bottom-${i}`}
                className="inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                style={{ transitionDelay: `${i * 0.02}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </button>
      </nav>

      {/* 3. Inject the Menu overlay and pass the settings down! */}
      <Menu isOpen={isOpen} toggleMenu={toggleMenu} settings={settings} />
    </>
  );
}