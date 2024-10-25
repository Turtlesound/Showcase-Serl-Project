// KioskLayout.tsx
'use client';

import React from 'react';

interface KioskLayoutProps {
children: React.ReactNode;
  showNavbar?: boolean; 
}

export default function KioskLayout({ children, showNavbar = true }: KioskLayoutProps) {
return (
    <div className="container mx-auto max-w-full px-4 py-8">
    {showNavbar && (
        <header className="bg-slate-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
            <h1 className="text-2xl font-bold">Kiosk Navbar</h1>
            {/* navbar items here */}
        </div>
        </header>
    )}
    {children}
    </div>
);
}
