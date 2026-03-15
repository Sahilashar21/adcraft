'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, Palette, Monitor, Wand2, RefreshCw } from "lucide-react";
import { DownloadExportButtons } from "@/components/DownloadExport";
import RecentGenerations from "@/components/RecentGenerations";
import { GeneratingVideo } from "@/components/LoadingStates";

export default function GenerateVideoPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [promptGenerating, setPromptGenerating] = useState(false);

  // Form state for video generation
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
    setGeneratedVideo(null);
    setPrompt('');
  };

  const handleGeneratePrompt = async () => {
    if (!selectedCampaign) return;
    setPromptGenerating(true);
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign._id,
          type: 'video',
          style,
          platform,
          resolution,
          userPrompt: prompt
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate prompt');
      }

      setPrompt(data.prompt || '');
    } catch (err) {
      console.error('Failed to generate prompt:', err);
      alert('Failed to generate prompt. Please try again.');
    } finally {
      setPromptGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedCampaign || !prompt.trim()) {
      alert('Please select a campaign and enter a prompt');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/generate-video', {
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

      setGeneratedVideo(data);
      setPrompt('');
    } catch (err) {
      console.error('Failed to generate video:', err);
      
      // Show user-friendly error message
      let errorMessage = err.message;
      if (errorMessage.includes('temporarily unavailable') || errorMessage.includes('service')) {
        errorMessage += '\n\nThis is likely a temporary issue with the image generation service. Please try again in a few minutes.';
      }
      
      alert('Failed to generate video:\n\n' + errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const downloadVideo = async (videoUrl, filename) => {
    try {
      const response = await fetch(videoUrl);
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
      console.error('Failed to download video:', err);
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

  const handleRegenerateVideo = async () => {
    if (!generatedVideo?._id) return;
    setRegenerating(true);
    try {
      const res = await fetch(`/api/videos/${generatedVideo._id}/regenerate`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to regenerate video');
      }
      setGeneratedVideo(data);
    } catch (err) {
      console.error('Failed to regenerate video:', err);
      alert('Failed to regenerate video. Please try again.');
    } finally {
      setRegenerating(false);
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
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            {selectedCampaign && (
            <Button
                variant="outline"
                onClick={handleBackToCampaigns}
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
            </Button>
            )}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-purple-600" />
                AI Video Generator
            </h2>
        </div>
        <Link href="/videos">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all px-6 py-6">
                <VideoIcon className="w-4 h-4 mr-2" /> View Videos
            </Button>
        </Link>
        </div>

        {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-700/50 bg-white dark:bg-slate-800 min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="p-4 bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/40 rounded-full mb-4">
                      <Target className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
                    No campaigns found
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create your first campaign to start generating videos.
                    </p>
                    <Link href="/campaigns/new">
                    <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg">
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
                  className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
                    onClick={() => handleCampaignSelect(campaign)}
                >
                    <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{campaign.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Building className="w-4 h-4" />
                        {campaign.businessName}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Objective:</span>
                    <Badge variant="outline" className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40">{campaign.objective}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Credits:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{campaign.credits}</span>
                        </div>
                    </div>
                    <Button 
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold" 
                        size="sm"
                    >
                        Generate Videos
                    </Button>
                    </CardContent>
                </Card>
            ))}
            </div>
        )
        ) : (
        // Video Generation View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900/50 shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                    <Wand2 className="w-5 h-5" />
                    Generate Video
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                    Create AI-powered advertisement visuals for {selectedCampaign.name}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Sparkles className="w-4 h-4" />
                    Description/Prompt
                    </label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your product, mood, colors, and advertising goal..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] resize-none"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Use your campaign details to draft a prompt.</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        onClick={handleGeneratePrompt}
                        disabled={promptGenerating}
                      >
                        <Sparkles className="w-3 h-3 mr-1" /> {promptGenerating ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Palette className="w-4 h-4" />
                    Style
                    </label>
                    <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="luxury">Luxury</option>
                    </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Monitor className="w-4 h-4" />
                    Platform
                    </label>
                    <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <VideoIcon className="w-4 h-4" />
                    Resolution
                    </label>
                    <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                    >
                    <option value="square">Square (1:1)</option>
                    <option value="portrait">Portrait (9:16)</option>
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="banner">Banner (3:1)</option>
                    </select>
                </div>

                <div className="pt-4">
                    <Button
                    onClick={handleGenerateVideo}
                    disabled={generating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 font-semibold"
                    >
                    {generating ? (
                        <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                        </>
                    ) : (
                        <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Video (10 Credits)
                        </>
                    )}
                    </Button>
                </div>
                </CardContent>
            </Card>

            {/* Generated Video Display */}
            <Card className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900/50 shadow-lg">
                <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                    <VideoIcon className="w-5 h-5" />
                    Generated Video
                </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                    Your AI-generated advertisement visual
                </CardDescription>
                </CardHeader>
                <CardContent>
              {generating && !generatedVideo ? (
                <GeneratingVideo />
              ) : generatedVideo ? (
                    <div className="space-y-4">
                    <div className="relative group">
                        <video
                        src={generatedVideo.videoUrl}
                        controls
                        className="w-full rounded-lg shadow-md"
                        />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => downloadVideo(generatedVideo.videoUrl, `adcraft-${generatedVideo._id}.mp4`)}
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => copyToClipboard(generatedVideo.prompt)}
                        >
                            {copiedPrompt ? (
                            <Check className="w-4 h-4" />
                            ) : (
                            <Copy className="w-4 h-4" />
                            )}
                        </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={handleRegenerateVideo}
                    disabled={regenerating}
                    title="Regenerate"
                  >
                    <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                  </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                        {generatedVideo.prompt}
                        </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(generatedVideo.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                    <Badge variant="outline" className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40">
                            {generatedVideo.style}
                            </Badge>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700">
                            {generatedVideo.platform}
                            </Badge>
                        </div>
                        </div>
                    </div>

                <DownloadExportButtons
                  caption={generatedVideo.prompt}
                  mediaUrl={generatedVideo.videoUrl}
                  mediaType="video"
                  filename={`video-${generatedVideo._id}`}
                />

                    <div className="pt-4 border-t">
                        <Button
                        onClick={() => setGeneratedVideo(null)}
                        variant="outline"
                  className="w-full dark:border-gray-600 dark:text-gray-200"
                        >
                        Generate Another Video
                        </Button>
                    </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <VideoIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                        No Video Generated Yet
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fill out the form and click "Generate Video" to create your first AI-powered advertisement visual.
                    </p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
        )}

        {selectedCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 text-center text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-pink-50 dark:to-pink-900/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800 font-semibold">
              Generating videos for {selectedCampaign.name} • {selectedCampaign.credits} credits remaining
          </div>
          <RecentGenerations type="videos" campaignId={selectedCampaign._id} />
        </div>
        )}
    </div>
  );
}
