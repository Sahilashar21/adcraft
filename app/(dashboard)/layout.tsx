"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Gem, BarChart3, FileText, Zap, Star, Sparkles, Home, Library, Clapperboard, PenSquare, User, Bell } from 'lucide-react';
import { motion } from "framer-motion";
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ["latin"] });

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/campaigns", icon: BarChart3, label: "Campaigns" },
  { href: "/campaign-library", icon: Library, label: "Library" },
  { href: "/captions", icon: FileText, label: "Captions" },
  { href: "/images", icon: Sparkles, label: "Images" },
  { href: "/videos", icon: Clapperboard, label: "Videos" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 ${inter.className}`}>
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-bg" />
        <div className="grid-overlay" />
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
        <div className="glow-orb orb-3" />
      </div>
      {/* Top Navigation Bar */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-purple-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 font-semibold group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
              >
                <Gem className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AdCraft</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium transition-all"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600 hover:bg-purple-50">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600 hover:bg-purple-50">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto p-4 lg:p-8">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}