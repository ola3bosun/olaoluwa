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


// This query grabs everything from the 'siteSettings' schema for the home page, including the slider images and contact and menu

export const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0] {
  menuBio,
  location,
  "menuImages": menuImages[].asset->url,
  "sliderImages": contactImages[].asset->url,
  email,
  instagram,
  linkedin,
  twitter,
  homeBio,
  "homeImage": homeImage.asset->url
}`

export const GALLERY_QUERY = groq`*[_type == "project"] | order(order asc) {
  _id,
  title,
  category,
  location,
  year,
  "imageUrl": mainImage.asset->url
}`