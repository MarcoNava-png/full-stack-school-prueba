import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT MENU */}
      <div className="w-[18%] min-w-[250px] bg-white shadow-md flex flex-col h-screen">
        <div className="p-4">
          <Link href="/">
            <Image src="/Logousag.png" alt="Logo" width={150} height={80} className="mx-auto" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto border-t border-gray-100">
          <div className="p-4">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full bg-[#F7F8FA] overflow-y-auto">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
