import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdCraft - AI Caption Generator",
  description: "Generate perfect marketing copy with AI magic",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`relative overflow-hidden min-h-screen ${inter.className}`}>
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-bg" />
        <div className="grid-overlay" />
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
      </div>
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-purple-100 bg-white/70 backdrop-blur-xl px-4 lg:px-6 shadow-lg">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Gem className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AdCraft</span>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
            Go to Dashboard
          </Button>
        </Link>
      </header>
      <div className="relative z-10">
        {children}
      </div>
      <Chatbot />
    </div>
  );
}