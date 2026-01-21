"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Gem, BarChart3, FileText, Zap, Star, Sparkles, Home, Library, Clapperboard, PenSquare } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-slate-50 ${inter.className}`}>
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
        <div className="flex items-center gap-6"> {/* Left side: Logo and Navigation */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Gem className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">AdCraft</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Home className="w-4 h-4 mr-1" />Home
            </Link>
            <Link href="/dashboard/campaigns" className="text-gray-600 hover:text-purple-600 transition-colors">
              <BarChart3 className="w-4 h-4 mr-1" />Campaigns
            </Link>
            <Link href="/dashboard/campaign-library" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Library className="w-4 h-4 mr-1" />Campaign Library
            </Link>
            <Link href="/dashboard/captions" className="text-gray-600 hover:text-purple-600 transition-colors">
              <FileText className="w-4 h-4 mr-1" />Captions
            </Link>
            <Link href="/dashboard/images" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Sparkles className="w-4 h-4 mr-1" />Images
            </Link>
            <Link href="/dashboard/videos" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Clapperboard className="w-4 h-4 mr-1" />Videos
            </Link>
             <Link href="/dashboard/generate-image" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Sparkles className="w-4 h-4 mr-1" />Generate Image
            </Link>
            <Link href="/dashboard/generate-video" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Clapperboard className="w-4 h-4 mr-1" />Generate Video
            </Link>
            <Link href="/dashboard/generate-script" className="text-gray-600 hover:text-purple-600 transition-colors">
              <PenSquare className="w-4 h-4 mr-1" />Generate Script
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4"> {/* Right side: Icons and Avatar */}
          <Button variant="ghost" size="icon" className="hover:bg-purple-50">
            <Zap className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-purple-50">
            <Star className="w-5 h-5 text-gray-600" />
          </Button>
          <Image
            src="https://i.pravatar.cc/40"
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full border-2 border-purple-300"
          />
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}