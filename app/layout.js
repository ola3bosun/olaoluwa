import './globals.css'
import { Inter } from 'next/font/google'
import Cursor from '../components/Cursor'
import PreLoader from '../components/Preloader'

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#E5E5E5] text-black overflow-hidden`}>
        <PreLoader />
        <Cursor />
        {children}
      </body>
    </html>
  )
}