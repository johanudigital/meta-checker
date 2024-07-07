'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSeoDropdownOpen, setIsSeoDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSeoDropdown = () => {
    setIsSeoDropdownOpen(!isSeoDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center py-4 px-2">
              <span className="font-semibold text-gray-500 text-lg">SEO Analyzer Pro</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative group">
              <button 
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
                onClick={toggleSeoDropdown}
              >
                SEO Tools
                <svg className="h-4 w-4 inline-block ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isSeoDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <Link href="/seo-tools/structured-data-tool" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Structured Data Tool</Link>
                  {/* Add more SEO tools here */}
                </div>
              )}
            </div>
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
          <li>
            <button onClick={toggleSeoDropdown} className="w-full text-left py-2 px-4 text-sm hover:bg-green-500 transition duration-300">
              SEO Tools {isSeoDropdownOpen ? '▲' : '▼'}
            </button>
            {isSeoDropdownOpen && (
              <ul className="bg-gray-100">
                <li><Link href="/seo-tools/structured-data-tool" className="block py-2 px-8 text-sm hover:bg-green-500 transition duration-300">Structured Data Tool</Link></li>
                {/* Add more SEO tools here */}
              </ul>
            )}
          </li>
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
