'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Simple credit-based pricing. Use credits for each generation type.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Credit Costs</h3>
            <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex justify-between">
                <span>Caption Generation</span>
                <span className="font-semibold">5 credits</span>
              </li>
              <li className="flex justify-between">
                <span>Image Generation</span>
                <span className="font-semibold">5 credits</span>
              </li>
              <li className="flex justify-between">
                <span>Script Generation</span>
                <span className="font-semibold">10 credits</span>
              </li>
              <li className="flex justify-between">
                <span>Video Generation</span>
                <span className="font-semibold">10 credits</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Included</h3>
            <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
              <li>Campaign management and organization</li>
              <li>Download/export tools for every asset</li>
              <li>Social previews for captions and posts</li>
              <li>Recent generations history</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/campaigns">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg font-bold">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
