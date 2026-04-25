import { client } from '@/sanity/client'
import { GALLERY_QUERY } from '@/sanity/queries'
import GalleryClient from './GalleryClient'

export const revalidate = 60 // Revalidate the cache every 60 seconds

export default async function GalleryPage() {
  // Fetch live projects from Sanity
  const galleryData = await client.fetch(GALLERY_QUERY)

  // Pass the data to the GSAP engine
  return <GalleryClient initialProjects={galleryData} />
}