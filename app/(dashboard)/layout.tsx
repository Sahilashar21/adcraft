"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="flex min-h-screen flex-col relative z-10">
        {/* Top Navigation Bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl px-4 lg:px-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-2xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"> AdCraft</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-purple-200 hover:text-white transition-colors duration-200">
              🏠 Home
            </Link>
            <Link href="/" className="text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md shadow-lg transition-all duration-200">
              📊 Dashboard
            </Link>
            <Link href="/campaigns" className="text-purple-200 hover:text-white transition-colors duration-200">
              📋 Campaigns
            </Link>
            <Link href="/captions" className="text-purple-200 hover:text-white transition-colors duration-200">
              💬 Captions
            </Link>
            <Link href="/generate-image" className="text-purple-200 hover:text-white transition-colors duration-200">
              🎨 Generate Image
            </Link>
            <Link href="/images" className="text-purple-200 hover:text-white transition-colors duration-200">
              🖼️ Images
            </Link>
            <Link href="#" className="text-purple-200 hover:text-white transition-colors duration-200">
              ⚙️ Settings
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 border border-white/20 rounded-lg hover:bg-white/10 text-white backdrop-blur-md transition-all duration-200">
              👤
            </button>
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 border border-white/20 rounded-lg hover:bg-white/10 text-white backdrop-blur-md transition-all duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {sidebarOpen && (
          <div className="md:hidden bg-white/5 backdrop-blur-xl border-b border-white/10">
            <nav className="flex flex-col px-4 py-4 space-y-2">
              <Link href="/" className="text-purple-200 hover:text-white transition-colors duration-200 py-2" onClick={() => setSidebarOpen(false)}>
                🏠 Home
              </Link>
              <Link href="/dashboard" className="text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-2 rounded-lg border border-white/20 backdrop-blur-md shadow-lg transition-all duration-200" onClick={() => setSidebarOpen(false)}>
                📊 Dashboard
              </Link>
              <Link href="/campaigns" className="text-purple-200 hover:text-white transition-colors duration-200 py-2" onClick={() => setSidebarOpen(false)}>
                📋 Campaigns
              </Link>
              <Link href="/captions" className="text-purple-200 hover:text-white transition-colors duration-200 py-2" onClick={() => setSidebarOpen(false)}>
                💬 Captions
              </Link>
              <Link href="#" className="text-purple-200 hover:text-white transition-colors duration-200 py-2" onClick={() => setSidebarOpen(false)}>
                ⚙️ Settings
              </Link>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}