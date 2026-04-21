"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import TransitionLink from '@/components/TransitionLink'
import { useParams } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// If you have your Sanity client set up, uncomment this:
// import { client } from '../../../sanity/lib/client'

export default function CategoryGallery() {
  const params = useParams()
  // Un-slugify the URL for the header (e.g., "interior-decor" -> "INTERIOR DECOR")
  const categoryTitle = params.slug.replace("-", " ").toUpperCase() 
  
  const containerRef = useRef(null)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. The Sanity Fetch Engine
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // --- YOUR ACTUAL SANITY QUERY WILL GO HERE ---
        // const query = `*[_type == "project" && category->slug.current == "${params.slug}"]{
        //   _id, title, location, year, "imageUrl": mainImage.asset->url
        // }`
        // const data = await client.fetch(query)
        // setProjects(data)

        // --- PLACEHOLDER DATA FOR NOW ---
        setTimeout(() => {
          setProjects([
            { _id: 1, title: "Ikoyi Residence", location: "Lagos", year: "2023", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000" },
            { _id: 2, title: "The Brutalist Box", location: "Abuja", year: "2024", imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000" },
            { _id: 3, title: "Minimalist Loft", location: "London", year: "2022", imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000" },
            { _id: 4, title: "Concrete Pavilion", location: "Kano", year: "2023", imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000" },
          ])
          setIsLoading(false)
        }, 500) // Simulating network latency
      } catch (error) {
        console.error("Failed to fetch Sanity projects:", error)
      }
    }

    fetchProjects()
  }, [params.slug])

  // 2. The GSAP Stagger Reveal
  useGSAP(() => {
    if (!isLoading && projects.length > 0) {
      gsap.fromTo(".gallery-item", 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      )
    }
  }, { dependencies: [isLoading], scope: containerRef })

  return (
    <main className="min-h-screen w-full bg-[#E5E5E5] text-black font-sans flex flex-col relative" ref={containerRef}>
      
      {/* Absolute Header */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-8 z-50 pointer-events-none flex justify-between uppercase font-mono text-sm tracking-widest mix-blend-difference text-white">
        <TransitionLink href="/" className="pointer-events-auto hover:opacity-50 transition-opacity">
          ← BACK TO INDEX
        </TransitionLink>
        <div className="hidden md:block">{categoryTitle}</div>
      </nav>

      {/* Massive Fluid Typography Header */}
      <div className="w-full pt-32 pb-12 px-4 md:px-8 border-b-[3px] border-black shrink-0">
        <h1 className="uppercase font-bold tracking-tighter leading-[0.8] text-[clamp(3rem,8vw,12rem)] w-full truncate">
          {categoryTitle}.
        </h1>
      </div>

      {/* The Architectural Grid */}
      <div className="flex-1 w-full bg-black">
        {isLoading ? (
          <div className="w-full h-[50vh] flex items-center justify-center text-white font-mono uppercase tracking-widest text-sm">
            LOADING ASSETS...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px] w-full h-full">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className="gallery-item group relative aspect-square md:aspect-auto md:h-[60vh] bg-[#E5E5E5] overflow-hidden cursor-pointer"
              >
                {/* Project Image */}
                <Image 
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                />
                
                {/* Black overlay that fades on hover */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>

                {/* Technical Meta Data Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-end mix-blend-difference text-white font-mono uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">{project.title}</span>
                    <span>{project.location}</span>
                  </div>
                  <span>[{project.year}]</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}