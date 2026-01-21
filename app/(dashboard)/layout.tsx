"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Gem, BarChart3, FileText, Zap, Star, ChevronRight, Sparkles, Home, Library, Clapperboard, PenSquare } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
          <div className="flex h-16 items-center justify-center border-b">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Gem className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">AdCraft</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link href="/campaigns" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Campaigns</span>
            </Link>
            <Link href="/campaign-library" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <Library className="w-5 h-5" />
              <span>Campaign Library</span>
            </Link>
            <Link href="/captions" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span>Captions</span>
            </Link>
            <Link href="/images" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
                <Sparkles className="w-5 h-5" />
              <span>Images</span>
            </Link>
            <Link href="/videos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <Clapperboard className="w-5 h-5" />
              <span>Videos</span>
            </Link>
            <p className="px-4 pt-4 pb-2 text-xs text-gray-400 uppercase">Generate</p>
            <Link href="/generate-image" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <Sparkles className="w-5 h-5" />
              <span>Generate Image</span>
            </Link>
            <Link href="/generate-video" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <Clapperboard className="w-5 h-5" />
              <span>Generate Video</span>
            </Link>
            <Link href="/generate-script" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
              <PenSquare className="w-5 h-5" />
              <span>Generate Script</span>
            </Link>
          </nav>
        </aside>

        <div className="flex flex-col flex-1">
          {/* Top Bar */}
          <header className="flex h-16 items-center justify-between border-b bg-white md:justify-end px-4 lg:px-6">
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <div className="flex items-center gap-4">
              <Button variant="ghost">
                <Zap className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost">
                <Star className="w-5 h-5 text-gray-600" />
              </Button>
              <img
                src="https://i.pravatar.cc/40"
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}