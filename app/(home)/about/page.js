'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            About AdCraft
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AdCraft helps marketers create high-performing ad assets in minutes using
            AI-assisted workflows. We focus on speed, clarity, and consistency so your
            campaigns go from idea to launch without friction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Make professional ad creation accessible to every team.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">What We Build</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Captions, images, scripts, and videos tailored to your campaign goals.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Why It Matters</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Faster iteration, consistent brand tone, and higher engagement.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/campaigns">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Start a Campaign
            </Button>
          </Link>
          <Link href="/generate-image">
            <Button variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
              Try Image Generator
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
