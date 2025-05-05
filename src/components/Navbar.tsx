"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FiHome, FiList, FiFolder, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Close mobile menu when a link is clicked or when resizing to desktop
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (!session) return null;

  return (
    <>
      {/* Mobile menu toggle button */}
      <button 
        className="md:hidden fixed z-50 top-4 left-4 p-2 rounded-md bg-white shadow-md text-slate-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar navigation */}
      <div className={`bg-white border-r h-screen fixed left-0 top-0 py-4 sm:py-6 px-2 md:px-4 z-45 shadow-sm transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'w-64 translate-x-0' : 'w-0 md:w-60 -translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          <div>
            <div className="mb-6 sm:mb-8 px-2 flex items-center justify-between">
              <h1 className="text-lg font-bold text-slate-800">TaskMaster</h1>
              {mobileMenuOpen && (
                <button 
                  className="md:hidden p-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiX size={20} />
                </button>
              )}
            </div>

            <nav className="space-y-1 sm:space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-md hover:bg-slate-100 w-full ${
                  isActive("/dashboard") ? "bg-slate-100 text-indigo-600" : "text-slate-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className={`w-5 h-5 ${isActive("/dashboard") ? "text-indigo-600" : "text-slate-500"}`} />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/tasks"
                className={`flex items-center gap-3 p-3 rounded-md hover:bg-slate-100 w-full ${
                  isActive("/tasks") ? "bg-slate-100 text-indigo-600" : "text-slate-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiList className={`w-5 h-5 ${isActive("/tasks") ? "text-indigo-600" : "text-slate-500"}`} />
                <span className="font-medium">Tasks</span>
              </Link>

              <Link
                href="/projects"
                className={`flex items-center gap-3 p-3 rounded-md hover:bg-slate-100 w-full ${
                  isActive("/projects") ? "bg-slate-100 text-indigo-600" : "text-slate-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiFolder className={`w-5 h-5 ${isActive("/projects") ? "text-purple-600" : "text-slate-500"}`} />
                <span className="font-medium">Projects</span>
              </Link>
            </nav>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-red-50 text-red-600 w-full mt-auto"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
} 