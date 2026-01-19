'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, Palette, Users, Monitor, DollarSign, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"
          initial={{
            x: particle.x,
            y: window.innerHeight + 10,
            scale: 0
          }}
          animate={{
            y: -10,
            scale: [0, 1, 0],
            x: particle.x
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function GenerateImagePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

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
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);
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
    setShowParticles(true);

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
      setTimeout(() => setShowParticles(false), 3000);
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center p-4 relative"
      >
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading campaigns...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

      {showParticles && <FloatingParticles />}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {selectedCampaign && (
                <motion.div variants={itemVariants}>
                  <Button
                    variant="ghost"
                    onClick={handleBackToCampaigns}
                    className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Campaigns
                  </Button>
                </motion.div>
              )}
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wand2 className="w-8 h-8 text-purple-400" />
                </motion.div>
                AI Image Generator
              </motion.h2>
            </div>
            <motion.div variants={itemVariants}>
              <Link href="/images">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
                  <ImageIcon className="w-4 h-4 mr-2" /> View Images
                </Button>
              </Link>
            </motion.div>
          </div>

          {!selectedCampaign ? (
            // Campaign Selection View
            campaigns.length === 0 ? (
              <motion.div
                key="empty-state"
                variants={itemVariants}
                className="flex flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-500/10 min-h-[400px]"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <Target className="w-16 h-16 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    No campaigns found
                  </h3>
                  <p className="text-sm text-purple-200">
                    Create your first campaign to start generating images.
                  </p>
                  <Link href="/campaigns/new">
                    <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
                      <Target className="w-4 h-4 mr-2" /> Create Campaign
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="campaign-list"
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer h-full"
                      onClick={() => handleCampaignSelect(campaign)}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-white">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-purple-200">
                          <Building className="w-4 h-4" />
                          {campaign.businessName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Objective:</span>
                            <Badge variant="outline" className="border-purple-400/50 text-purple-200 bg-purple-500/10">{campaign.objective}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Credits:</span>
                            <span className="font-medium text-white">{campaign.credits}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Platform:</span>
                            <span className="font-medium text-white">{campaign.platform}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCampaignSelect(campaign);
                          }}
                        >
                          Generate Images
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            // Image Generation View
            <div key="generation-form" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Generation Form */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Wand2 className="w-5 h-5" />
                      Generate Image
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      Create AI-powered advertisement visuals for {selectedCampaign.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Description/Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your product, mood, colors, and advertising goal..."
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400 focus:outline-none min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Style
                      </label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
                      >
                        <option value="professional">Professional</option>
                        <option value="creative">Creative</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="vibrant">Vibrant</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Platform
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="tiktok">TikTok</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Resolution
                      </label>
                      <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
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
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 disabled:opacity-50"
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
              </motion.div>

              {/* Generated Image Display */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Generated Image
                    </CardTitle>
                    <CardDescription className="text-purple-200">
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
                            className="w-full rounded-lg shadow-lg"
                          />
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-md"
                              onClick={() => downloadImage(generatedImage.imageUrl, `adcraft-${generatedImage._id}.png`)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-md"
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
                          <p className="text-sm text-purple-200 line-clamp-3">
                            {generatedImage.prompt}
                          </p>
                          <div className="flex justify-between items-center text-xs text-purple-300">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(generatedImage.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-200 bg-purple-500/10">
                                {generatedImage.style}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-200 bg-purple-500/10">
                                {generatedImage.platform}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                          <Button
                            onClick={() => setGeneratedImage(null)}
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                          >
                            Generate Another Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <ImageIcon className="w-16 h-16 text-purple-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          No Image Generated Yet
                        </h3>
                        <p className="text-sm text-purple-200">
                          Fill out the form and click "Generate Image" to create your first AI-powered advertisement visual.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {selectedCampaign && (
            <motion.div
              variants={itemVariants}
              className="text-center text-sm text-purple-200"
            >
              Generating images for {selectedCampaign.name} • {selectedCampaign.credits} credits remaining
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}