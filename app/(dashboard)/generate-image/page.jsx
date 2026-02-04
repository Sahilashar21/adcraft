'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, Palette, Monitor, Wand2, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
      
      // Show user-friendly error message
      let errorMessage = err.message;
      if (errorMessage.includes('temporarily unavailable') || errorMessage.includes('service')) {
        errorMessage += '\n\nThis is likely a temporary issue with the image generation service. Please try again in a few minutes.';
      }
      
      alert('Failed to generate image:\n\n' + errorMessage);
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"
          />
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            {selectedCampaign && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                  variant="outline"
                  onClick={handleBackToCampaigns}
                  className="border-slate-300 text-slate-700 hover:bg-purple-50 hover:border-purple-300 font-semibold"
              >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
              </Button>
            </motion.div>
            )}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wand2 className="w-8 h-8 text-purple-600" />
                </motion.div>
                AI Image Generator
            </h2>
        </div>
        <Link href="/images">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl border-0 transition-all px-6 py-6">
                <ImageIcon className="w-4 h-4 mr-2" /> View Images
            </Button>
          </motion.div>
        </Link>
        </div>

        {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-white min-h-[400px]">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                      <Target className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                    No campaigns found
                    </h3>
                    <p className="text-sm text-gray-600">
                    Create your first campaign to start generating images.
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
            {campaigns.map((campaign, idx) => {
              const gradients = [
                "from-purple-50 to-pink-50 border-purple-200",
                "from-blue-50 to-cyan-50 border-blue-200",
                "from-indigo-50 to-purple-50 border-indigo-200",
              ];
              const gradient = gradients[idx % gradients.length];
              return (
                <motion.div
                  key={campaign._id}
                  whileHover={{ translateY: -5 }}
                  onClick={() => handleCampaignSelect(campaign)}
                  className="cursor-pointer group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500" />
                    <Card
                      className={`relative bg-gradient-to-br ${gradient} border-2 hover:shadow-2xl transition-all duration-300 group-hover:translate-y-[-2px] h-full`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-lg" />
                      </div>
                      <CardHeader className="relative z-10">
                      <CardTitle className="text-xl text-gray-800 font-bold">{campaign.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-600">
                          <Building className="w-4 h-4" />
                          {campaign.businessName}
                      </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm p-2 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-600">Objective:</span>
                        <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50 font-semibold">{campaign.objective}</Badge>
                          </div>
                        <div className="flex justify-between text-sm p-2 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-bold text-purple-600 flex items-center gap-1"><Zap className="w-3 h-3" />{campaign.credits}</span>
                          </div>
                      </div>
                      <motion.div className="w-full mt-4" whileHover={{ scale: 1.02 }}>
                        <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold border-0" 
                            size="sm"
                        >
                            Generate Images
                        </Button>
                      </motion.div>
                      </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            </div>
        )
        ) : (
        // Image Generation View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <Card className="relative bg-white border-2 border-purple-100 shadow-lg group-hover:shadow-2xl transition-all">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-800 font-bold">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Wand2 className="w-5 h-5 text-purple-600" />
                    </motion.div>
                    Generate Image
                </CardTitle>
                <CardDescription className="text-gray-600">
                    Create AI-powered advertisement visuals for {selectedCampaign.name}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Description/Prompt
                    </label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your product, mood, colors, and advertising goal..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] resize-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <Palette className="w-4 h-4 text-pink-500" />
                    Style
                    </label>
                    <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="luxury">Luxury</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <Monitor className="w-4 h-4 text-blue-500" />
                    Platform
                    </label>
                    <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <ImageIcon className="w-4 h-4 text-purple-500" />
                    Resolution
                    </label>
                    <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                    <option value="square">Square (1:1)</option>
                    <option value="portrait">Portrait (9:16)</option>
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="banner">Banner (3:1)</option>
                    </select>
                </div>

                <div className="pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                    onClick={handleGenerateImage}
                    disabled={generating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl border-0 transition-all"
                    >
                    {generating ? (
                        <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="inline-block mr-2">
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Generating...
                        </>
                    ) : (
                        <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Image (5 Credits)
                        </>
                    )}
                    </Button>
                  </motion.div>
                </div>
                </CardContent>
            </Card>
            </motion.div>

            {/* Generated Image Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <Card className="relative bg-white border-2 border-blue-100 shadow-lg group-hover:shadow-2xl transition-all">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-800 font-bold">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    Generated Image
                </CardTitle>
                <CardDescription className="text-gray-600">
                    Your AI-generated advertisement visual
                </CardDescription>
                </CardHeader>
                <CardContent>
                {generatedImage ? (
                    <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative group/image"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover/image:opacity-70 transition duration-500" />
                        <img
                        src={generatedImage.imageUrl}
                        alt={generatedImage.prompt}
                        className="relative w-full rounded-lg shadow-lg group-hover/image:shadow-2xl transition-all"
                        />
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                              size="sm"
                              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold h-8 w-8 p-0"
                              onClick={() => downloadImage(generatedImage.imageUrl, `adcraft-${generatedImage._id}.png`)}
                          >
                              <Download className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                              size="sm"
                              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold h-8 w-8 p-0"
                              onClick={() => copyToClipboard(generatedImage.prompt)}
                          >
                              {copiedPrompt ? (
                              <Check className="w-4 h-4 text-green-500" />
                              ) : (
                              <Copy className="w-4 h-4" />
                              )}
                          </Button>
                        </motion.div>
                        </div>
                    </motion.div>

                    <div className="space-y-3">
                        <p className="text-sm text-gray-700 line-clamp-3 font-semibold">
                        {generatedImage.prompt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-600">
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                            <Calendar className="w-3 h-3" />
                            {new Date(generatedImage.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 text-xs font-semibold">
                            {generatedImage.style}
                            </Badge>
                          <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50 text-xs font-semibold">
                            {generatedImage.platform}
                            </Badge>
                        </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                        onClick={() => setGeneratedImage(null)}
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold transition-all"
                        variant="outline"
                        >
                        Generate Another Image
                        </Button>
                      </motion.div>
                    </div>
                    </div>
                ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                      <ImageIcon className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        No Image Generated Yet
                    </h3>
                    <p className="text-sm text-gray-600">
                        Fill out the form and click "Generate Image" to create your first AI-powered advertisement visual.
                    </p>
                    </motion.div>
                )}
                </CardContent>
            </Card>
            </motion.div>
        </div>
        )}

        {selectedCampaign && (
        <motion.div 
          className="text-center text-sm text-gray-600 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 font-semibold flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Generating images for {selectedCampaign.name} • 
            <span className="text-purple-600 flex items-center gap-1"><Zap className="w-3 h-3" />{selectedCampaign.credits} credits remaining</span>
        </motion.div>
        )}
    </div>
  );
}