import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'
import ContactClient from './ContactClient'

export const revalidate = 60 

export default async function ContactPage() {
  const settingsData = await client.fetch(SETTINGS_QUERY)

  return <ContactClient settings={settingsData} />
}