'use client';

import { Download, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function DownloadExportButtons({ 
  caption, 
  imageUrl, 
  format = 'text',
  filename = 'adcraft-content'
}) {
  const [copied, setCopied] = useState(false);

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([caption], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsJSON = () => {
    const data = {
      content: caption,
      imageUrl,
      generatedAt: new Date().toISOString(),
      platform: 'AdCraft'
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AdCraft Generated Content',
          text: caption,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={copyToClipboard}
        variant="outline"
        size="sm"
        className="dark:border-gray-600 dark:text-gray-300"
      >
        <Copy className="w-4 h-4 mr-2" />
        {copied ? 'Copied!' : 'Copy'}
      </Button>

      <Button
        onClick={downloadAsText}
        variant="outline"
        size="sm"
        className="dark:border-gray-600 dark:text-gray-300"
      >
        <Download className="w-4 h-4 mr-2" />
        Download TXT
      </Button>

      <Button
        onClick={downloadAsJSON}
        variant="outline"
        size="sm"
        className="dark:border-gray-600 dark:text-gray-300"
      >
        <Download className="w-4 h-4 mr-2" />
        Download JSON
      </Button>

      {navigator.share && (
        <Button
          onClick={shareContent}
          variant="outline"
          size="sm"
          className="dark:border-gray-600 dark:text-gray-300"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      )}
    </div>
  );
}

export function ExportCampaignButton({ campaignId, campaignName }) {
  const [loading, setLoading] = useState(false);

  const exportCampaign = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/export`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${campaignName || 'campaign'}-export.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={exportCampaign}
      disabled={loading}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Exporting...' : 'Export Campaign'}
    </Button>
  );
}
