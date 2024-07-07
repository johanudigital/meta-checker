'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center py-4 px-2">
              <span className="font-semibold text-gray-500 text-lg">URL Analyzer Pro</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/seo-tools" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">SEO Tools</Link>
            <Link href="/social-tools" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Social Tools</Link>
            <Link href="/graphic-tools" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Graphic Tools</Link>
            <Link href="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">About</Link>
            <Link href="/contact" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Contact</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button" onClick={toggleMobileMenu}>
              <svg
                className="w-6 h-6 text-gray-500 hover:text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <ul className="pt-4 pb-3">
          <li><Link href="/seo-tools" className="block py-2 px-4 text-sm hover:bg-green-500 transition duration-300">SEO Tools</Link></li>
          <li><Link href="/social-tools" className="block py-2 px-4 text-sm hover:bg-green-500 transition duration-300">Social Tools</Link></li>
          <li><Link href="/graphic-tools" className="block py-2 px-4 text-sm hover:bg-green-500 transition duration-300">Graphic Tools</Link></li>
          <li><Link href="/about" className="block py-2 px-4 text-sm hover:bg-green-500 transition duration-300">About</Link></li>
          <li><Link href="/contact" className="block py-2 px-4 text-sm hover:bg-green-500 transition duration-300">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
