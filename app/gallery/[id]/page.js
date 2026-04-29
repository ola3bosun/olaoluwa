import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import ProjectClient from './ProjectClient'

export const revalidate = 60

export default async function ProjectPage({ params }) {

  const { id } = await params

  const PROJECT_QUERY = groq`*[_type == "project" && _id == $id][0] {
    _id,
    title,
    category,
    location,
    year,
    description,
    "imageUrl": mainImage.asset->url,
    "gallery": galleryImages[].asset->url
  }`

  const project = await client.fetch(PROJECT_QUERY, { id })

  if (!project) {
    return notFound()
  }

  return <ProjectClient project={project} />
}