'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tones = [
  { value: 'professional', label: '💼 Professional' },
  { value: 'funny', label: '😄 Funny & Casual' },
  { value: 'viral', label: '🚀 Viral Marketing' },
  { value: 'luxury', label: '✨ Luxury Brand' },
  { value: 'friendly', label: '👋 Friendly & Approachable' },
];

export default function ToneSelector({ value, onChange, label = 'Ad Tone' }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full dark:bg-slate-700 dark:text-white dark:border-gray-600">
          <SelectValue placeholder="Select tone..." />
        </SelectTrigger>
        <SelectContent className="dark:bg-slate-700 dark:border-gray-600">
          {tones.map(tone => (
            <SelectItem key={tone.value} value={tone.value} className="dark:text-white">
              {tone.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
