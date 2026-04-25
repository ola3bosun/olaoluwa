import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'
import HomeClient from './HomeClient'

export const revalidate = 60

export default async function HomePage() {
  const settingsData = await client.fetch(SETTINGS_QUERY)

  return <HomeClient settings={settingsData} />
}