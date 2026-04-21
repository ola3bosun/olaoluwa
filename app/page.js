"use client";

import { useState } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import Menu from "../components/Menu";
import TextPressure from "../components/TextPressure";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    {
      title: "Architecture",
      count: "05",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      href: "/architecture"
    },
    {
      title: "Interior Decor",
      count: "03",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      href: "/interior_decor"
    },
    {
      title: "Furniture Decor",
      count: "07",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2000&auto=format&fit=crop",
      href:  "/furniture_decor"
    },
  ];

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#E5E5E5] text-black flex flex-col font-sans relative">
      
      {/* RENDER THE EXTRACTED NAVBAR */}
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />

      <div className="flex-1 w-full flex flex-col min-h-0 relative pb-6 md:pb-8">
        
        <div className="flex-1 w-full relative flex items-center justify-center overflow-visible">
          <TextPressure 
            text="olaoluwa diyaolu"
            flex={true} 
            width={true} 
            weight={true} 
          />
        </div>

        <div className="shrink-0 flex flex-col items-end w-full uppercase font-mono text-[10px] md:text-xs leading-relaxed tracking-widest opacity-80 mt-4 px-4 md:px-8">
          <p className="max-w-md text-right border-r-2 border-black pr-4">
            Abuja based designer crafting architecture, interiors and furniture that respond to climate and craft.
          </p> 
{/*           
          <p className="max-w-md text-right pr-4 mt-2 font-bold"> 
            Architectural Design // Interior Decor // Furniture
          </p> */}
        </div>

      </div>

      <section className="relative z-20 h-[40vh] md:h-[45vh] shrink-0 grid grid-cols-1 md:grid-cols-3 w-full border-t border-black divide-y md:divide-y-0 md:divide-x divide-black">
        {categories.map((cat, index) => (
          <TransitionLink
            key={index}
            href={`/categories/${cat.title.toLowerCase().replace(" ", "-")}`}
            // href={cat.href}
            className="group relative flex flex-col justify-end p-4 md:p-6 overflow-hidden cursor-pointer bg-neutral-300"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
            </div>
            <div className="relative z-10 flex justify-between items-end uppercase font-mono text-xs md:text-sm mix-blend-difference text-white w-full">
              <span>{cat.title}</span>
              <span>[{cat.count}]</span>
            </div>
          </TransitionLink>
        ))}
      </section>

      <Menu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(false)} />
    </main>
  );
}