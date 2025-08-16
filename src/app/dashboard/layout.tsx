//import type { Metadata } from "next";
//import { Inter } from "next/font/google";
//import "./globals.css";

//const inter = Inter({ subsets: ["latin"] });

//export const metadata: Metadata = {
//  title: "Marco Sistema de Gestion Escolar Dashboard",
//  description: "Next.js School Management System",
//};
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-red-200 flex items-center justify-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className='hidden lg:block'>EscuelaMarco</span>
        </Link>
      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[84%] lg:w-[84%] xl:w-[86%] bg-blue-200">
        {children}
      </div>
    </div>
  );
}
