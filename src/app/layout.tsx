'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import localFont from 'next/font/local';
import './globals.css';

// Fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// The layout for application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/projects?search=${searchTerm}`);
  };

  // Hide the navbar on the kiosk page and its subpaths
  const isKioskPage = pathname?.startsWith('/kiosk') || false; // Check if the path starts with /kiosk

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
        {/* Conditionally render the header based on the current path */}
        {!isKioskPage && (
          <header className="bg-slate-600 text-white py-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-6">
              <div>
                <Link href="/" className="text-2xl font-bold hover:underline">
                  Project Showcase
                </Link>
              </div>
              <div className="flex-1 w-full md:w-auto mx-0 md:mx-8 mt-4 md:mt-0">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full px-4 py-2 text-gray-900 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </form>
              </div>
              <nav className="mt-4 md:mt-0 space-x-4 md:space-x-6">
                <Link href="/" className="hover:underline hover:text-indigo-300 transition duration-200">
                  Home
                </Link>
                <Link href="/projects" className="hover:underline hover:text-indigo-300 transition duration-200">
                  Projects
                </Link>
                <Link href="/kiosk" className="hover:underline hover:text-indigo-300 transition duration-200">
                  Kiosk
                </Link>
              </nav>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="container mx-auto max-w-full py-8 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
