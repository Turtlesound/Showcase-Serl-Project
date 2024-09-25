'use client';
import React, { useState } from 'react';
import Link from 'next/link';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header with Search Bar */}
        <header className="bg-gray-900 text-white py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
            <div>
              <Link href="/" className="text-2xl font-bold">
                MyProject
              </Link>
            </div>
            <div className="flex-1 mx-8">
              {/* Search Bar */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full px-4 py-2 text-gray-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <nav className="space-x-6">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/projects" className="hover:underline">
                Projects
              </Link>
              {/* Add more links if needed */}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
