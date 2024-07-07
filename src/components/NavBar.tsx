'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [seoToolsOpen, setSeoToolsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSeoTools = () => setSeoToolsOpen(!seoToolsOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">URL Analyzer Pro</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <DesktopMenu />
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button" onClick={toggleMenu}>
              <svg className="w-6 h-6 text-gray-500 hover:text-green-500"
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
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <MobileMenu isOpen={isOpen} seoToolsOpen={seoToolsOpen} toggleSeoTools={toggleSeoTools} />
      </div>
    </nav>
  );
};

const DesktopMenu = () => (
  <>
    <div className="relative group">
      <button className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">
        SEO Tools
        <svg className="h-4 w-4 inline-block ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
        <Link href="/seo-tools/structured-data-tool" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Structured Data Tool</Link>
        {/* Add more SEO tools here */}
      </div>
    </div>
    <Link href="/social-tools" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Social Tools</Link>
    <Link href="/graphic-tools" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Graphic Tools</Link>
    <Link href="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">About</Link>
    <Link href="/contact" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Contact</Link>
  </>
);

const MobileMenu = ({ isOpen, seoToolsOpen, toggleSeoTools }) => (
  <ul className={`${isOpen ? 'block' : 'hidden'} mobile-menu`}>
    <li className="active">
      <button onClick={toggleSeoTools} className="block text-sm px-2 py-4 text-white bg-green-500 font-semibold">
        SEO Tools {seoToolsOpen ? '▲' : '▼'}
      </button>
      <ul className={`${seoToolsOpen ? 'block' : 'hidden'} bg-white`}>
        <li><Link href="/seo-tools/structured-data-tool" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Structured Data Tool</Link></li>
        {/* Add more SEO tools here */}
      </ul>
    </li>
    <li><Link href="/social-tools" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Social Tools</Link></li>
    <li><Link href="/graphic-tools" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Graphic Tools</Link></li>
    <li><Link href="/about" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">About</Link></li>
    <li><Link href="/contact" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Contact</Link></li>
  </ul>
);

export default NavBar;
