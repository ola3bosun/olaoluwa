import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// 1. Configure the Client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-04-24', // Use today's date to lock in the API version
  useCdn: true, // Use the CDN for faster, cached responses in production
})

// 2. Configure the Image Builder
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}