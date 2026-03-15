'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

const EXAMPLE_PROMPTS = [
  {
    name: 'Coffee Shop Promotion',
    product: 'Artisan Coffee Shop',
    audience: 'Coffee enthusiasts & professionals',
    platform: 'Instagram'
  },
  {
    name: 'Fitness App Launch',
    product: 'Mobile Fitness App',
    audience: 'Health-conscious individuals 18-45',
    platform: 'TikTok'
  },
  {
    name: 'Smartphone Advertisement',
    product: 'Latest Smartphone Model',
    audience: 'Tech enthusiasts & early adopters',
    platform: 'YouTube'
  },
  {
    name: 'Online Course Marketing',
    product: 'Web Development Course',
    audience: 'Career changers & students',
    platform: 'Facebook'
  },
];

export default function AIPromptGenerator({ onGenerate, tone }) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('');

  const handleQuickFill = (example) => {
    setProduct(example.product);
    setAudience(example.audience);
    setPlatform(example.platform);
  };

  const handleGeneratePrompt = async () => {
    if (!product.trim() || !audience.trim() || !platform.trim()) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          audience,
          platform,
          tone: tone || 'professional'
        })
      });

      if (response.ok) {
        const data = await response.json();
        onGenerate && onGenerate(data.prompt);
      } else {
        alert('Failed to generate prompt');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product/Service
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g., Wireless Headphones"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., Tech enthusiasts 18-35"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select platform...</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
          </select>
        </div>
      </div>

      <Button
        onClick={handleGeneratePrompt}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Prompt with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Prompt with AI
          </>
        )}
      </Button>

      {/* Example Prompts */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Fill Examples:
        </p>
        <div className="grid md:grid-cols-2 gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <Button
              key={example.name}
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill(example)}
              className="justify-start text-left h-auto py-2 px-3 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800"
            >
              <div className="text-xs">
                <div className="font-semibold text-purple-700 dark:text-purple-300">{example.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
