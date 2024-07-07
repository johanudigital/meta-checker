'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuItem, menuItems } from './menuConfig';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center py-4 px-2">
            <span className="font-semibold text-gray-500 text-lg">SEO Analyzer Pro</span>
          </Link>
          <DesktopMenu items={menuItems} />
          <MobileMenuToggle toggleMenu={toggleMobileMenu} />
        </div>
      </div>
      <MobileMenu items={menuItems} isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
    </nav>
  );
};

const DesktopMenu: React.FC<{ items: MenuItem[] }> = ({ items }) => (
  <div className="hidden md:flex items-center space-x-1">
    {items.map((item, index) => (
      <DesktopMenuItem key={index} item={item} />
    ))}
  </div>
);

const DesktopMenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <div className="relative group">
        <button
          className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.label}
          <svg className="h-4 w-4 inline-block ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg">
            {item.children.map((child, index) => (
              <Link key={index} href={child.href || '#'} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href || '#'} className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">
      {item.label}
    </Link>
  );
};

const MobileMenuToggle: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => (
  <div className="md:hidden flex items-center">
    <button className="outline-none mobile-menu-button" onClick={toggleMenu}>
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
);

const MobileMenu: React.FC<{ items: MenuItem[], isOpen: boolean, closeMenu: () => void }> = ({ items, isOpen, closeMenu }) => (
  <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
    <ul className="pt-4 pb-3">
      {items.map((item, index) => (
        <MobileMenuItem key={index} item={item} closeMenu={closeMenu} />
      ))}
    </ul>
  </div>
);

const MobileMenuItem: React.FC<{ item: MenuItem, closeMenu: () => void }> = ({ item, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent, href?: string) => {
    e.preventDefault();
    if (href) {
      closeMenu();
      router.push(href);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      <button onClick={(e) => handleClick(e, item.href)} className="w-full text-left py-2 px-4 text-sm hover:bg-green-500 transition duration-300">
        {item.label} {item.children && (isOpen ? '▲' : '▼')}
      </button>
      {item.children && isOpen && (
        <ul className="bg-gray-100">
          {item.children.map((child, index) => (
            <li key={index}>
              <a href={child.href} onClick={(e) => handleClick(e, child.href)} className="block py-2 px-8 text-sm hover:bg-green-500 transition duration-300">
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavBar;
