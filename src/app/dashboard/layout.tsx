'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-md shadow-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="sr-only">Abrir menú</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className={`absolute inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/Logousag.png"
                alt="Logo"
                width={120}
                height={64}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 xl:w-64 2xl:w-72 lg:flex-col">
        <div className="flex-shrink-0 bg-white z-10 border-r border-gray-200">
          <div className="flex items-center justify-center px-3 py-3">
            <Link href="/dashboard">
              <Image
                src="/Logousag.png"
                alt="Logo"
                width={130}
                height={70}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto bg-white">
          <div className="px-2 space-y-1 py-3">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-60 xl:pl-64 2xl:pl-72">
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <Navbar />
        </div>
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6">
          <div className="min-h-screen mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
}
