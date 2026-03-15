'use client';

import { Download, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const DEFAULT_OVERLAY = {
  placement: 'top-left'
};

const wrapText = (ctx, text, maxWidth) => {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const testLine = current ? `${current} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = testLine;
    }
  });

  if (current) lines.push(current);
  return lines;
};

const composeImageWithOverlay = async (imageUrl, overlay) => {
  const mergedOverlay = { ...DEFAULT_OVERLAY, ...overlay };
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(bitmap, 0, 0);

  const padding = Math.round(canvas.width * 0.04);
  const maxWidth = Math.round(canvas.width * 0.6);
  const brandFontSize = Math.round(canvas.width * 0.035);
  const headlineFontSize = Math.round(canvas.width * 0.07);
  const gap = Math.round(canvas.height * 0.01);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = Math.round(canvas.width * 0.01);

  ctx.font = `600 ${brandFontSize}px "Poppins", "Segoe UI", sans-serif`;
  const brandLines = wrapText(ctx, mergedOverlay.brand || '', maxWidth);

  ctx.font = `800 ${headlineFontSize}px "Poppins", "Segoe UI", sans-serif`;
  const headlineLines = wrapText(ctx, mergedOverlay.headline || '', maxWidth);

  const brandHeight = brandLines.length * (brandFontSize + Math.round(brandFontSize * 0.2));
  const headlineHeight = headlineLines.length * (headlineFontSize + Math.round(headlineFontSize * 0.2));
  const blockHeight = brandHeight + (brandLines.length && headlineLines.length ? gap : 0) + headlineHeight;

  let x = padding;
  let y = padding;

  if (mergedOverlay.placement === 'top-left') {
    x = padding;
    y = padding;
  } else if (mergedOverlay.placement === 'bottom-left') {
    x = padding;
    y = canvas.height - blockHeight - padding;
  } else if (mergedOverlay.placement === 'center') {
    x = Math.round((canvas.width - maxWidth) / 2);
    y = Math.round((canvas.height - blockHeight) / 2);
  }

  const backgroundPadding = Math.round(canvas.width * 0.02);
  const backgroundWidth = Math.min(maxWidth, canvas.width - padding * 2) + backgroundPadding * 2;
  const backgroundHeight = blockHeight + backgroundPadding * 2;

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(
    x - backgroundPadding,
    y - backgroundPadding,
    backgroundWidth,
    backgroundHeight
  );

  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = Math.round(canvas.width * 0.01);
  ctx.fillStyle = '#FFFFFF';

  let currentY = y;

  if (brandLines.length) {
    ctx.font = `600 ${brandFontSize}px "Poppins", "Segoe UI", sans-serif`;
    brandLines.forEach((line) => {
      ctx.fillText(line, x, currentY);
      currentY += brandFontSize + Math.round(brandFontSize * 0.2);
    });
  }

  if (headlineLines.length) {
    if (brandLines.length) currentY += gap;
    ctx.font = `800 ${headlineFontSize}px "Poppins", "Segoe UI", sans-serif`;
    headlineLines.forEach((line) => {
      ctx.fillText(line, x, currentY);
      currentY += headlineFontSize + Math.round(headlineFontSize * 0.2);
    });
  }

  return new Promise((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/png');
  });
};

export function DownloadExportButtons({ 
  caption, 
  imageUrl, 
  mediaUrl,
  mediaType,
  imageOverlay,
  format = 'text',
  filename = 'adcraft-content',
  layout = 'row',
  buttonClassName = ''
}) {
  const [copied, setCopied] = useState(false);
  const effectiveUrl = mediaUrl || imageUrl;
  const resolvedType = mediaType || (imageUrl ? 'image' : 'text');
  const canDownloadMedia = Boolean(effectiveUrl) && (resolvedType === 'image' || resolvedType === 'video');

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

  const downloadMedia = async () => {
    if (!effectiveUrl) return;
    try {
      if (resolvedType === 'image' && imageOverlay && (imageOverlay.headline || imageOverlay.brand)) {
        const composedBlob = await composeImageWithOverlay(effectiveUrl, imageOverlay);
        const url = window.URL.createObjectURL(composedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }

      const response = await fetch(effectiveUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = resolvedType === 'video' ? 'mp4' : 'png';
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download media:', err);
    }
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        if (effectiveUrl && (resolvedType === 'image' || resolvedType === 'video')) {
          const response = await fetch(effectiveUrl);
          const blob = await response.blob();
          const extension = resolvedType === 'video' ? 'mp4' : 'png';
          const mimeType = resolvedType === 'video' ? 'video/mp4' : 'image/png';
          const file = new File([blob], `${filename}.${extension}`, { type: blob.type || mimeType });
          await navigator.share({
            title: resolvedType === 'video' ? 'AdCraft Generated Video' : 'AdCraft Generated Image',
            files: [file],
          });
          return;
        }
        await navigator.share({
          title: 'AdCraft Generated Content',
          text: caption,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const containerClassName =
    layout === 'stack'
      ? 'grid gap-2'
      : 'flex flex-wrap gap-2';

  const resolvedButtonClassName =
    `dark:border-gray-600 dark:text-gray-300 ${buttonClassName}`.trim();

  return (
    <div className={containerClassName}>
      <Button
        onClick={copyToClipboard}
        variant="outline"
        size="sm"
        className={resolvedButtonClassName}
      >
        <Copy className="w-4 h-4 mr-2" />
        {copied ? 'Copied!' : 'Copy'}
      </Button>

      {canDownloadMedia ? (
        <Button
          onClick={downloadMedia}
          variant="outline"
          size="sm"
          className={resolvedButtonClassName}
        >
          <Download className="w-4 h-4 mr-2" />
          {resolvedType === 'video' ? 'Download Video' : 'Download Image'}
        </Button>
      ) : (
        <Button
          onClick={downloadAsText}
          variant="outline"
          size="sm"
          className={resolvedButtonClassName}
        >
          <Download className="w-4 h-4 mr-2" />
          Download TXT
        </Button>
      )}

      <Button
        onClick={downloadAsJSON}
        variant="outline"
        size="sm"
        className={resolvedButtonClassName}
      >
        <Download className="w-4 h-4 mr-2" />
        Download JSON
      </Button>

      {navigator.share && (
        <Button
          onClick={shareContent}
          variant="outline"
          size="sm"
          className={resolvedButtonClassName}
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
