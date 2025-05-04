"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FiHome, FiList, FiFolder, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (!session) return null;

  return (
    <div className="bg-white border-r h-screen w-14 sm:w-16 md:w-60 fixed left-0 top-0 py-4 sm:py-6 px-2 md:px-4 z-10 shadow-sm">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="mb-6 sm:mb-8 px-2 hidden md:block">
            <h1 className="text-lg font-bold text-black">TaskMaster</h1>
          </div>

          <nav className="space-y-1 sm:space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-gray-100 w-full ${
                isActive("/dashboard") ? "bg-gray-100 text-black" : "text-black"
              }`}
            >
              <FiHome className={`w-5 h-5 ${isActive("/dashboard") ? "text-blue-600" : "text-gray-500"}`} />
              <span className="hidden md:block font-medium">Dashboard</span>
            </Link>

            <Link
              href="/tasks"
              className={`flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-gray-100 w-full ${
                isActive("/tasks") ? "bg-gray-100 text-black" : "text-black"
              }`}
            >
              <FiList className={`w-5 h-5 ${isActive("/tasks") ? "text-blue-600" : "text-gray-500"}`} />
              <span className="hidden md:block font-medium">Tasks</span>
            </Link>

            <Link
              href="/projects"
              className={`flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-gray-100 w-full ${
                isActive("/projects") ? "bg-gray-100 text-black" : "text-black"
              }`}
            >
              <FiFolder className={`w-5 h-5 ${isActive("/projects") ? "text-purple-600" : "text-gray-500"}`} />
              <span className="hidden md:block font-medium">Projects</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-red-50 text-red-600 w-full"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
} 