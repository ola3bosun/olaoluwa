"use client";

import { useState, useEffect } from "react";
import TransitionLink from '@/components/TransitionLink'
// import CanvasLogo from "./CanvasLogo";

export default function Navbar({ onMenuClick }) {
  const [abujaTime, setAbujaTime] = useState("...");
  const menuLetters = "MENU".split("");

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setAbujaTime(`${formatter.format(new Date())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="relative z-50 flex justify-between items-center p-4 md:px-4 md:pt-4 uppercase font-mono text-sm tracking-widest shrink-0 pointer-events-auto">
      <TransitionLink href="/" className="pointer-events-auto" >
        OD
      </TransitionLink>
      
      <div className="hidden md:block text-xs opacity-80 text-center w-48">
        ABUJA, NG <br />
        {abujaTime}
      </div>
      
      <button
        className="group relative overflow-hidden w-fit flex justify-end cursor-pointer"
        onClick={onMenuClick}
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
  );
}