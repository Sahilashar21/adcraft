import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AdCraft",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">AdCraft</h1>

            <div className="flex gap-4 text-sm">
              <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
              <a href="/campaigns/new" className="hover:text-blue-600">New Campaign</a>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
