'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import localFont from 'next/font/local'
import './globals.css'

// Fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

// The layout for application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const pathname = usePathname() // Get the current pathname

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/projects?search=${searchTerm}`)
  }

  // Hide the navbar on the kiosk page and its subpaths
  const isKioskPage = pathname?.startsWith('/kiosk') || false // Check if the path starts with /kiosk

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 antialiased`}
      >
        {/* Conditionally render the header based on the current path */}
        {!isKioskPage && (
          <header className='bg-slate-600 py-4 text-white'>
            <div className='container mx-auto flex flex-col items-center justify-between px-4 md:flex-row md:px-6'>
              <div>
                <Link href='/' className='text-2xl font-bold hover:underline'>
                  Project Showcase
                </Link>
              </div>
              <div className='mx-0 mt-4 w-full flex-1 md:mx-8 md:mt-0 md:w-auto'>
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search projects...'
                    className='w-full rounded-md px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </form>
              </div>
              <nav className='mt-4 space-x-4 md:mt-0 md:space-x-6'>
                <Link
                  href='/'
                  className='transition duration-200 hover:text-indigo-300 hover:underline'
                >
                  Home
                </Link>
                <Link
                  href='/projects'
                  className='transition duration-200 hover:text-indigo-300 hover:underline'
                >
                  Projects
                </Link>
                <Link
                  href='/kiosk'
                  className='transition duration-200 hover:text-indigo-300 hover:underline'
                >
                  Kiosk
                </Link>
              </nav>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className='container mx-auto max-w-full px-4 py-8'>
          {children}
        </main>
      </body>
    </html>
  )
}
