'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";

const campaignColors = [
  { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-300', text: 'text-purple-800', badge: 'bg-purple-100 border-purple-300 text-purple-800', glow: 'from-purple-400 to-pink-400' },
  { bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', border: 'border-blue-300', text: 'text-blue-800', badge: 'bg-blue-100 border-blue-300 text-blue-800', glow: 'from-blue-400 to-cyan-400' },
  { bg: 'bg-gradient-to-br from-pink-50 to-rose-50', border: 'border-pink-300', text: 'text-pink-800', badge: 'bg-pink-100 border-pink-300 text-pink-800', glow: 'from-pink-400 to-rose-400' },
  { bg: 'bg-gradient-to-br from-indigo-50 to-purple-50', border: 'border-indigo-300', text: 'text-indigo-800', badge: 'bg-indigo-100 border-indigo-300 text-indigo-800', glow: 'from-indigo-400 to-purple-400' },
];

export default function ImagesPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

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

  const fetchImagesForCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/images?campaignId=${campaignId}`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchImagesForCampaign(campaign._id);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setImages([]);
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

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading && !selectedCampaign) {
    return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            {selectedCampaign && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                    variant="outline"
                    onClick={handleBackToCampaigns}
                    className="border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-purple-50 hover:border-purple-300 transition-all duration-300"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
              </motion.div>
            )}
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedCampaign ? selectedCampaign.name : 'Image Library'}
              </h2>
              <p className="text-slate-600 mt-1 text-base">
                {selectedCampaign ? 'View all images for this campaign' : 'Browse your AI-generated images'}
              </p>
            </div>
        </div>
        <Link href="/generate-image">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 px-6 py-6">
                <ImageIcon className="w-5 h-5 mr-2" />
                Generate New Image
            </Button>
        </Link>
        </div>

        {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 min-h-[400px] backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                      <Target className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-200">
                    No campaigns found
                    </h3>
                    <p className="text-sm text-gray-400">
                    Create your first campaign to start generating images.
                    </p>
                    <Link href="/campaigns/new">
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold">
                        <Target className="w-4 h-4 mr-2" /> Create Campaign
                    </Button>
                    </Link>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, idx) => {
              const gradient = campaignGradients[idx % campaignGradients.length];
              return (
                <motion.div
                  key={campaign._id}
                  whileHover={{ translateY: -5 }}
                  onClick={() => handleCampaignSelect(campaign)}
                  className="cursor-pointer group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500" />
                  <Card
                      className={`relative bg-gradient-to-br ${gradient} border-2 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group-hover:translate-y-[-2px] h-full`}
                  >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-lg" />
                      </div>
                      <CardHeader className="relative z-10">
                      <CardTitle className="text-xl text-white font-bold">{campaign.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-300">
                          <Building className="w-4 h-4" />
                          {campaign.businessName}
                      </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                      <div className="space-y-3">
                          <div className="flex justify-between text-sm p-2 bg-white/10 rounded-lg border border-white/20">
                          <span className="text-gray-300">Objective:</span>
                          <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-500/20 font-semibold">{campaign.objective}</Badge>
                          </div>
                          <div className="flex justify-between text-sm p-2 bg-white/10 rounded-lg border border-white/20">
                          <span className="text-gray-300">Credits:</span>
                          <span className="font-bold text-cyan-300 flex items-center gap-1"><Zap className="w-3 h-3" />{campaign.credits}</span>
                          </div>
                      </div>
                      <motion.div className="w-full mt-4" whileHover={{ scale: 1.02 }}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold border-0" size="sm">
                            View Images
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
        // Images View
        loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-cyan-500"
              />
            </div>
        ) : images.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 min-h-[400px] backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
                      <ImageIcon className="w-16 h-16 text-cyan-300" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-200">
                    No images found
                    </h3>
                    <p className="text-sm text-gray-400">
                    No images have been generated for this campaign yet.
                    </p>
                    <Link href="/generate-image">
                    <Button className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold">
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Image
                    </Button>
                    </Link>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, idx) => {
              const gradient = imageGradients[idx % imageGradients.length];
              return (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500" />
                  <Card className={`relative bg-gradient-to-br ${gradient} border-2 backdrop-blur-sm overflow-hidden group-hover:shadow-2xl transition-all duration-300 group-hover:translate-y-[-2px]`}>
                    <CardContent className="p-0 relative">
                    <div className="relative">
                        <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button
                                size="icon"
                                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold h-9 w-9"
                                onClick={() => downloadImage(image.imageUrl, `adcraft-${image._id}.png`)}
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button
                                size="icon"
                                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold h-9 w-9"
                                onClick={() => copyToClipboard(image.prompt, image._id)}
                            >
                                {copiedId === image._id ? (
                                <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                <Copy className="w-4 h-4" />
                                )}
                            </Button>
                          </motion.div>
                        </div>
                    </div>
                    <div className="p-4 relative z-10">
                        <p className="text-sm text-gray-200 line-clamp-2 mb-3 font-semibold">
                        {image.prompt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-300">
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded border border-white/20">
                            <Calendar className="w-3 h-3" />
                            {new Date(image.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                            <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-500/20 text-xs font-semibold">
                            {image.style}
                            </Badge>
                            <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 bg-cyan-500/20 text-xs font-semibold">
                            {image.platform}
                            </Badge>
                        </div>
                        </div>
                    </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            </div>
        )
        )}

        {selectedCampaign && images.length > 0 && (
        <motion.div 
          className="text-center text-sm text-gray-300 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-400/30 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
            Showing {images.length} image{images.length !== 1 ? 's' : ''} for {selectedCampaign.name}
        </motion.div>
        )}
    </div>
  );
}