import { client } from '@/sanity/client'
import { INVENTORY_QUERY } from '@/sanity/queries'
import ShopClient from './ShopClient'

export const revalidate = 60 // Revalidate the cache every 60 seconds

export default async function ShopPage() {
  // Fetch live data from Sanity using the client
  const inventoryData = await client.fetch(INVENTORY_QUERY)

  console.log("🔥 SANITY DATA:", inventoryData)

  // Pass the data to your client component
  return <ShopClient initialInventory={inventoryData} />
}