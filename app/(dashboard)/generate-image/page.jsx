'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, Palette, Monitor, Wand2 } from "lucide-react";

export default function GenerateImagePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Form state for image generation
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('professional');
  const [platform, setPlatform] = useState('instagram');
  const [resolution, setResolution] = useState('square');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setGeneratedImage(null);
    setPrompt('');
  };

  const handleGenerateImage = async () => {
    if (!selectedCampaign || !prompt.trim()) {
      alert('Please select a campaign and enter a prompt');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign._id,
          prompt,
          style,
          platform,
          resolution
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setGeneratedImage(data);
      setPrompt('');
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to generate image: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading campaigns...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            {selectedCampaign && (
            <Button
                variant="outline"
                onClick={handleBackToCampaigns}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
            </Button>
            )}
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-purple-600" />
                AI Image Generator
            </h2>
        </div>
        <Link href="/images">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <ImageIcon className="w-4 h-4 mr-2" /> View Images
            </Button>
        </Link>
        </div>

        {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <Target className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                    No campaigns found
                    </h3>
                    <p className="text-sm text-gray-500">
                    Create your first campaign to start generating images.
                    </p>
                    <Link href="/campaigns/new">
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                        <Target className="w-4 h-4 mr-2" /> Create Campaign
                    </Button>
                    </Link>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
                <Card
                    key={campaign._id}
                    className="bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                    onClick={() => handleCampaignSelect(campaign)}
                >
                    <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{campaign.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {campaign.businessName}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Objective:</span>
                        <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">{campaign.objective}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Credits:</span>
                        <span className="font-medium text-gray-800">{campaign.credits}</span>
                        </div>
                    </div>
                    <Button 
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white" 
                        size="sm"
                    >
                        Generate Images
                    </Button>
                    </CardContent>
                </Card>
            ))}
            </div>
        )
        ) : (
        // Image Generation View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Generate Image
                </CardTitle>
                <CardDescription>
                    Create AI-powered advertisement visuals for {selectedCampaign.name}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Description/Prompt
                    </label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your product, mood, colors, and advertising goal..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Style
                    </label>
                    <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="luxury">Luxury</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Platform
                    </label>
                    <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Resolution
                    </label>
                    <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="square">Square (1:1)</option>
                    <option value="portrait">Portrait (9:16)</option>
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="banner">Banner (3:1)</option>
                    </select>
                </div>

                <div className="pt-4">
                    <Button
                    onClick={handleGenerateImage}
                    disabled={generating || !prompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                    >
                    {generating ? (
                        <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                        </>
                    ) : (
                        <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Image (5 Credits)
                        </>
                    )}
                    </Button>
                </div>
                </CardContent>
            </Card>

            {/* Generated Image Display */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Generated Image
                </CardTitle>
                <CardDescription>
                    Your AI-generated advertisement visual
                </CardDescription>
                </CardHeader>
                <CardContent>
                {generatedImage ? (
                    <div className="space-y-4">
                    <div className="relative group">
                        <img
                        src={generatedImage.imageUrl}
                        alt={generatedImage.prompt}
                        className="w-full rounded-lg shadow-md"
                        />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => downloadImage(generatedImage.imageUrl, `adcraft-${generatedImage._id}.png`)}
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => copyToClipboard(generatedImage.prompt)}
                        >
                            {copiedPrompt ? (
                            <Check className="w-4 h-4" />
                            ) : (
                            <Copy className="w-4 h-4" />
                            )}
                        </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 line-clamp-3">
                        {generatedImage.prompt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(generatedImage.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                            <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">
                            {generatedImage.style}
                            </Badge>
                            <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">
                            {generatedImage.platform}
                            </Badge>
                        </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                        onClick={() => setGeneratedImage(null)}
                        variant="outline"
                        className="w-full"
                        >
                        Generate Another Image
                        </Button>
                    </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No Image Generated Yet
                    </h3>
                    <p className="text-sm text-gray-500">
                        Fill out the form and click "Generate Image" to create your first AI-powered advertisement visual.
                    </p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
        )}

        {selectedCampaign && (
        <div className="text-center text-sm text-gray-500">
            Generating images for {selectedCampaign.name} • {selectedCampaign.credits} credits remaining
        </div>
        )}
    </div>
  );
}