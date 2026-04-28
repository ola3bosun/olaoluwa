// app/gallery/[id]/page.js
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import ProjectClient from './ProjectClient'

export const revalidate = 60

export default async function ProjectPage({ params }) {
  // FIX: In modern Next.js, params is a Promise that must be awaited
  const { id } = await params

  // Fetch the specific project matching the ID from the URL
  const PROJECT_QUERY = groq`*[_type == "project" && _id == $id][0] {
    _id,
    title,
    category,
    location,
    year,
    "imageUrl": mainImage.asset->url + "?auto=format&w=2000&fit=max&q=75",
    description,
    "gallery": galleryImages[].asset->url + "?auto=format&w=1600&fit=max&q=75"
  }`

  // Now 'id' is a valid string, so Sanity's $id variable will compile perfectly
  const project = await client.fetch(PROJECT_QUERY, { id })

  if (!project) {
    return notFound()
  }

  return <ProjectClient project={project} />
}