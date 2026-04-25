import './globals.css'
import { Inter } from 'next/font/google'
import Cursor from '../components/Cursor'
import PreLoader from '../components/Preloader'
import PageTransition from '../components/PageTransition'

// 1. IMPORT SANITY & NAVBAR
import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'
import ConditionalNavbar from '@/components/ConditionalNavbar'

// 2. Initialize the variable font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Olaoluwa ',
  description: 'Timeless Design Tailored To Your Specs',
}

// 3. Revalidate the global settings every 60 seconds
export const revalidate = 60

// 4. Make the layout async so we can fetch server-side data
export default async function RootLayout({ children }) {
  
  // Fetch the global settings from Sanity (Fallback to null if empty)
  const settings = await client.fetch(SETTINGS_QUERY).catch(() => null)

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#E5E5E5] text-black overflow-hidden`}>
        <PreLoader />
        <PageTransition />
        <Cursor />
        {/* Inject the global Navbar and pass the settings down */}
        <ConditionalNavbar settings={settings} />
        
        {children}
      </body>
    </html>
  )
}