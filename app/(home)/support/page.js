'use client';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">Support</h1>
        <p className="mt-6 text-gray-600 dark:text-gray-300">
          Need help? Email us and we will get back to you quickly.
        </p>
        <div className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
          <p>contact@adcraft.in</p>
          <p>support@adcraft.in</p>
        </div>
      </section>
    </div>
  );
}
