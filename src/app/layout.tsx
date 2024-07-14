import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '../components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEO Analyzer Pro',
  description: 'Analyze URLs for SEO, content type, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-background text-foreground h-full flex flex-col`}>
        <header className="bg-background bg-opacity-90 backdrop-blur-md z-50">
          <NavBar />
        </header>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  )
}