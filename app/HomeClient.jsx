"use client";

import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import TextPressure from "@/components/TextPressure"; // Adjust path if needed

export default function HomeClient({ settings }) {
  // Dynamic data with fallbacks
  const heroImage = settings?.homeImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop";
  const bioText = settings?.homeBio || "Abuja based designer crafting architecture, interiors and furniture that respond to climate and craft.";

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#E5E5E5] text-black flex flex-col font-sans relative">
      
      {/* NOTE: Navbar and Menu are GONE. 
        They are now injected globally via layout.jsx! 
      */}

      <div className="flex-1 w-full flex flex-col min-h-0 relative pb-6 md:pb-8 pt-24 md:pt-32">
        
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
            {bioText}
          </p> 
        </div>

      </div>

      <TransitionLink 
        href="/gallery" 
        className="relative group w-full h-[25vh] md:h-[40vh] shrink-0 border-t border-black overflow-hidden bg-neutral-300 flex flex-col justify-end p-4 md:p-8 cursor-pointer"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Studio Archive"
            fill
            sizes="100vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-1000"></div>
        </div>

        <div className="relative z-10 flex justify-between items-end w-full mix-blend-difference text-white">
          <h2 className="text-[8vw] md:text-[5vw] font-black uppercase tracking-tighter leading-none">
            SELECTED WORKS.
          </h2>
          <span className="font-mono text-sm md:text-base tracking-widest uppercase pb-2 inline-block transition-transform duration-500 ease-out group-hover:translate-x-4">
            [ ENTER ARCHIVE → ]
          </span>
        </div>
      </TransitionLink>

    </main>
  );
}