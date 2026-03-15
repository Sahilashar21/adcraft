'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            By using AdCraft you agree to use the service responsibly and comply with all
            applicable laws and platform policies.
          </p>
          <p>
            Generated content is provided as-is. You are responsible for reviewing outputs
            before publishing or distributing them.
          </p>
          <p>
            We may update these terms to improve the service. Continued use means acceptance
            of the latest terms.
          </p>
        </div>
      </section>
    </div>
  );
}
