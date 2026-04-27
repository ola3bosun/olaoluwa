import { groq } from 'next-sanity'

// This query grabs everything from the 'product' schema
export const INVENTORY_QUERY = groq`*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  "id": productId,
  category,
  "dims": dimensions,
  price,
  numericPrice,
  "image": image.asset->url,
  span
}`

export const GALLERY_QUERY = groq`*[_type == "project"] | order(order asc) {
  _id,
  title,
  category,
  location,
  year,
  // This tells Sanity: Convert to WebP, max width 1600px, 75% quality
  "imageUrl": mainImage.asset->url + "?auto=format&w=1600&fit=max&q=75"
}`

// This query grabs everything from the 'siteSettings' schema for the home page, including the slider images and contact and menu

export const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0] {
  menuBio,
  location,
  // Compresses the desktop slider images to 1200px WebP for instant loading
  "menuImages": menuImages[].asset->url + "?auto=format&w=1200&fit=max&q=75",
  "sliderImages": contactImages[].asset->url + "?auto=format&w=2000&fit=max&q=75",
  email,
  instagram,
  linkedin,
  twitter,
  homeBio,
  "homeImage": homeImage.asset->url + "?auto=format&w=2000&fit=max&q=75"
}`