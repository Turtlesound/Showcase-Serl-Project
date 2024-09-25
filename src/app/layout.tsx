// layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'Project Showcase',
  description: 'A showcase of all the projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-100 text-gray-900`}
      >
        <header className="bg-white shadow-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
            <div className="text-lg font-bold">
              <a href="/" className="hover:underline">
                Project Showcase
              </a>
            </div>
            <ul className="flex space-x-4 text-sm">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="/projects" className="text-gray-600 hover:text-gray-900">
                  Projects
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8">{children}</main>

        <footer className="bg-white py-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Project Showcase. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
