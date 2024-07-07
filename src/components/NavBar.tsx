'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">SEO Analyzer</Link>
        <div className="hidden md:flex space-x-8">
          <div className="relative group">
            <button 
              className="flex items-center hover:text-gray-600 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              SEO Tools
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
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
