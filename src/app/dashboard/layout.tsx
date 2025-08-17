import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      {/* LEFT MENU */}
      <div className="w-[18%] bg-white p-4 shadow-md">
        <Link href="/">
          <Image src="/Logousag.png" alt="Logo" width={150} height={80} />
        </Link>
        <Menu />
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full bg-[#F7F8FA] overflow-y-auto">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
