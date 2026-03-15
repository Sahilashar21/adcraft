'use client';

import { Heart, MessageCircle, Share2, Eye, Maximize2 } from 'lucide-react';

export function InstagramPreview({ image, caption }) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">AdCraft</div>
          <div className="text-xs text-gray-500">📍 Marketing Hub</div>
        </div>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="Ad" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-2">📸</div>
            <div className="text-sm">No image selected</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 p-3 border-b dark:border-gray-700">
        <Heart className="w-6 h-6 cursor-pointer hover:fill-red-500 hover:text-red-500 text-gray-600 dark:text-gray-400" />
        <MessageCircle className="w-6 h-6 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300" />
        <Share2 className="w-6 h-6 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300" />
      </div>

      {/* Stats */}
      <div className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
        👍 2,340 likes
      </div>

      {/* Caption */}
      <div className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 max-h-24 overflow-y-auto">
        <span className="font-semibold">AdCraft</span> {caption || 'Your caption will appear here...'}
      </div>

      {/* Comments */}
      <div className="px-4 py-3 border-t dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        View all 128 comments
      </div>
    </div>
  );
}

export function YouTubePreview({ caption }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Video Player */}
      <div className="w-full bg-black aspect-video flex items-center justify-center">
        <Eye className="w-16 h-16 text-gray-600" />
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {caption ? caption.substring(0, 60) + '...' : 'Your Video Title'}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div>
            <span className="text-gray-900 dark:text-white font-semibold">1.2M</span> views • 2 days ago
          </div>
        </div>

        <div className="flex items-center gap-4 py-3 border-t dark:border-gray-700">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">45K</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">3.2K</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function TwitterPreview({ caption }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
          <div className="flex-1">
            <div className="font-bold text-gray-900 dark:text-white">AdCraft Marketing</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">@AdCraft · 2h</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-gray-900 dark:text-gray-100 text-base leading-normal">
          {caption || 'Your tweet will appear here...'}
        </p>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex justify-between text-gray-500 dark:text-gray-400 text-sm border-t dark:border-gray-700">
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          128
        </button>
        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
          <Share2 className="w-4 h-4" />
          456
        </button>
        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
          1.2K
        </button>
      </div>
    </div>
  );
}

export function FacebookPreview({ image, caption }) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">AdCraft</div>
          <div className="text-xs text-gray-500">2 hours ago</div>
        </div>
      </div>

      {/* Caption */}
      <div className="p-4 text-sm text-gray-900 dark:text-gray-100">
        {caption || 'Your caption will appear here...'}
      </div>

      {/* Image */}
      {image && (
        <div className="w-full bg-gray-100 dark:bg-gray-700">
          <img src={image} alt="Ad" className="w-full h-auto" />
        </div>
      )}

      {/* Engagement */}
      <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          👍 234 ❤️ 56 😂 12
        </div>
        <div>45 Comments • 123 Shares</div>
      </div>

      {/* Actions */}
      <div className="flex gap-0 p-2 border-t dark:border-gray-700">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Heart className="w-4 h-4" />
          <span className="text-sm">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
}
