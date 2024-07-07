import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'URL Analyzer Pro',
  description: 'Analyze URLs for safety, content type, and sentiment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <header className="fixed w-full bg-white bg-opacity-90 backdrop-blur-md z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold">URL Analyzer Pro</Link>
            <ul className="flex space-x-4 sm:space-x-8">
              <li><Link href="/seo-tools" className="hover:text-gray-600 transition-colors">SEO Tools</Link></li>
              <li><Link href="/social-tools" className="hover:text-gray-600 transition-colors">Social Tools</Link></li>
              <li><Link href="/graphic-tools" className="hover:text-gray-600 transition-colors">Graphic Tools</Link></li>
              <li><Link href="/about" className="hover:text-gray-600 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-gray-600 transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </header>
        <main className="pt-20">
          {children}
        </main>
        <footer className="bg-gray-100 py-8 mt-20">
          <div className="container mx-auto px-6 text-center text-gray-600">
            © 2024 URL Analyzer Pro. All rights reserved.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
