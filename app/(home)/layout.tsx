import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Gem className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold text-gray-800">AdCraft</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            Go to Dashboard
          </Button>
        </Link>
      </header>
      {children}
    </>
  );
}