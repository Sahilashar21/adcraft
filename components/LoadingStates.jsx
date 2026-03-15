'use client';

import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative w-16 h-16">
      <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
      <Sparkles className="absolute w-6 h-6 animate-pulse top-2 right-2 text-pink-500" />
    </div>
    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{message}</p>
  </div>
);

export const GeneratingCaption = () => (
  <LoadingSpinner message="✨ Generating caption with AI..." />
);

export const GeneratingImage = () => (
  <LoadingSpinner message="🎨 Creating image..." />
);

export const GeneratingScript = () => (
  <LoadingSpinner message="🎬 Generating script..." />
);

export const GeneratingIdea = () => (
  <LoadingSpinner message="💡 Generating marketing idea..." />
);

export const GeneratingVideo = () => (
  <LoadingSpinner message="🎥 Creating video..." />
);

// Inline loading indicator for buttons
export const InlineLoader = ({ text = 'Generating...' }) => (
  <>
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    {text}
  </>
);
