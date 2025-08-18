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
    <div className="min-h-screen bg-gray-50">

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-gray-100 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Abrir menú</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className={`lg:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
          <div className="p-3 border-b border-gray-200">
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
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 xl:w-64 2xl:w-72 lg:flex-col">
        <div className="flex-shrink-0 bg-white z-10 border-b border-gray-200">
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

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-white">
          <div className="px-2 space-y-0.5 py-3">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-60 xl:pl-64 2xl:pl-72 flex flex-col min-h-screen">
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>
        <main className="flex-1 overflow-auto bg-[#F7F8FA] pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
}
