'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">URL Analyzer Pro</Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/features" className="hover:text-gray-600 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-gray-600 transition-colors">Pricing</Link>
          <div className="relative group">
            <button 
              className="hover:text-gray-600 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              SEO Tools
            </button>
            {isOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link href="/seo-tools/structured-data" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Structured Data Tool</Link>
                  <Link href="/seo-tools/sitemap" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sitemap Tool</Link>
                  <Link href="/seo-tools/meta-content" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meta Content Tool</Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/social-tools" className="hover:text-gray-600 transition-colors">Social Tools</Link>
          <Link href="/graphic-tools" className="hover:text-gray-600 transition-colors">Graphic Tools</Link>
          <Link href="/about" className="hover:text-gray-600 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
