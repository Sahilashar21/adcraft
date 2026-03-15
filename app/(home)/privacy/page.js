'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            We respect your privacy. AdCraft only collects data required to provide the product
            experience, improve performance, and keep the service secure.
          </p>
          <p>
            We do not sell personal data. Content you generate remains yours, and is only used
            to deliver and improve your experience.
          </p>
          <p>
            If you need help with data requests or deletion, contact us at contact@adcraft.in.
          </p>
        </div>
      </section>
    </div>
  );
}
