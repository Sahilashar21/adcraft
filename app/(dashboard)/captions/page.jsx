"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Sparkles, Copy, Check, ArrowLeft, Target, Zap, TrendingUp, RefreshCw, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import ToneSelector from "@/components/ToneSelector";
import AIPromptGenerator from "@/components/AIPromptGenerator";
import { GeneratingCaption } from "@/components/LoadingStates";
import { InstagramPreview, TwitterPreview } from "@/components/SocialMediaPreview";
import { DownloadExportButtons } from "@/components/DownloadExport";
import RecentGenerations from "@/components/RecentGenerations";

const campaignColors = [
  { bg: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-800 dark:text-purple-300', badge: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-300', glow: 'from-purple-400 to-pink-400' },
  { bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-300', badge: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300', glow: 'from-blue-400 to-cyan-400' },
  { bg: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20', border: 'border-pink-300 dark:border-pink-700', text: 'text-pink-800 dark:text-pink-300', badge: 'bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/40 dark:border-pink-700 dark:text-pink-300', glow: 'from-pink-400 to-rose-400' },
  { bg: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20', border: 'border-indigo-300 dark:border-indigo-700', text: 'text-indigo-800 dark:text-indigo-300', badge: 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-300', glow: 'from-indigo-400 to-purple-400' },
];

export default function CaptionsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [selectedTone, setSelectedTone] = useState("professional");
  const [generatingId, setGeneratingId] = useState(null);
  const [prompt, setPrompt] = useState("");

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

  const fetchCaptionsForCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/captions?campaignId=${campaignId}`);
      const data = await res.json();
      setCaptions(data);
    } catch (err) {
      console.error('Failed to fetch captions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchCaptionsForCampaign(campaign._id);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setCaptions([]);
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

  const regenerateCaption = async (captionId) => {
    setGeneratingId(captionId);
    try {
      const res = await fetch(`/api/captions/${captionId}/regenerate`, { method: 'POST' });
      if (res.ok) {
        const newCaption = await res.json();
        setCaptions(captions.map(c => c._id === captionId ? newCaption : c));
      }
    } catch (err) {
      console.error('Failed to regenerate:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  const handlePromptGenerated = (generatedPrompt) => {
    setPrompt(generatedPrompt);
    setShowPromptGenerator(false);
    alert("Prompt generated! You can now use it to generate new captions.");
  };

  if (loading && !selectedCampaign) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <GeneratingCaption />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
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
                className="border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-slate-50 dark:hover:from-slate-700 hover:to-purple-50 dark:hover:to-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
          )}
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
              {selectedCampaign ? selectedCampaign.name : 'Generated Captions'}
            </h2>
            <p className="text-slate-600 dark:text-gray-400 mt-1 text-base">
              {selectedCampaign ? 'View & manage captions for this campaign' : 'Select a campaign to view captions'}
            </p>
          </div>
        </div>
        {selectedCampaign && (
          <Button
            onClick={() => setShowPromptGenerator(!showPromptGenerator)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Prompt with AI
          </Button>
        )}
      </div>

      {/* AI Prompt Generator */}
      {selectedCampaign && showPromptGenerator && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <div className="space-y-4">
            <ToneSelector value={selectedTone} onChange={setSelectedTone} />
            <AIPromptGenerator onGenerate={handlePromptGenerated} tone={selectedTone} />
          </div>
        </motion.div>
      )}

      {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 min-h-[450px]">
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl">
                  <Target className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
                No campaigns found
              </h3>
              <p className="text-base text-slate-600 dark:text-gray-400 max-w-md leading-relaxed">
                Create your first campaign to start generating AI-powered captions.
              </p>
              <Link href="/campaigns">
                <Button className="mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 px-8 py-6 text-base">
                  <Target className="w-5 h-5 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
            {campaigns.map((campaign, idx) => {
              const colors = campaignColors[idx % campaignColors.length];
              return (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleCampaignSelect(campaign)}
                  className="cursor-pointer group"
                  whileHover={{ y: -4 }}
                >
                  <Card className={`${colors.bg} border-2 ${colors.border} hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden dark:hover:shadow-purple-900/50`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    <CardHeader className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
                      </div>
                      <CardTitle className={`text-xl font-bold ${colors.text} group-hover:scale-105 transition-transform`}>
                        {campaign.name}
                      </CardTitle>
                      <CardDescription className={`flex items-center gap-2 font-medium ${colors.text}`}>
                        {campaign.businessName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                        <FileText className="w-4 h-4 mr-2" />
                        View Captions
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        // Captions View
        loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <GeneratingCaption />
          </div>
        ) : captions.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 min-h-[450px]">
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl">
                  <FileText className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
                No captions yet
              </h3>
              <p className="text-base text-slate-600 dark:text-gray-400 max-w-md leading-relaxed">
                Generate AI captions for this campaign using the prompt generator.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Captions Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {captions.map((caption, idx) => {
                    const colors = campaignColors[idx % campaignColors.length];
                    return (
                      <motion.div
                        key={caption._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <Card className={`${colors.bg} border-2 ${colors.border} hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative overflow-hidden group dark:hover:shadow-purple-900/50`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                          <CardHeader className="relative">
                            <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className={`text-xs font-semibold ${colors.badge} shadow-sm`}>
                                AI Generated
                              </Badge>
                              <div className="flex items-center gap-1 px-2 py-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border border-white dark:border-gray-700 shadow-sm">
                                <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                  {caption.creditsUsed || 1}
                                </span>
                              </div>
                            </div>
                            <CardTitle className={`text-base leading-relaxed font-semibold ${colors.text} group-hover:scale-[1.02] transition-transform`}>
                              "{caption.text}"
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow flex flex-col justify-end relative space-y-3">
                            <div className="flex items-center justify-between text-xs bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-2.5 border border-white dark:border-gray-700 shadow-sm">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-400 font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(caption.createdAt).toLocaleDateString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-3 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                                onClick={() => copyToClipboard(caption.text, caption._id)}
                              >
                                {copiedId === caption._id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 mr-1 text-green-600" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Download buttons */}
                            <DownloadExportButtons
                              caption={caption.text}
                              filename={`caption-${caption._id}`}
                            />

                            {/* Regenerate button */}
                            <Button
                              onClick={() => regenerateCaption(caption._id)}
                              disabled={generatingId === caption._id}
                              variant="outline"
                              size="sm"
                              className="w-full text-xs font-semibold dark:border-gray-700 dark:text-gray-300"
                            >
                              <RefreshCw className={`w-3 h-3 mr-1 ${generatingId === caption._id ? 'animate-spin' : ''}`} />
                              {generatingId === caption._id ? 'Regenerating...' : 'Regenerate'}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar - Recent & Preview */}
              <div className="space-y-6">
                {/* Social Preview */}
                {captions.length > 0 && (
                  <Card className="dark:border-gray-700 dark:bg-slate-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Social Preview</CardTitle>
                      <CardDescription>Instagram preview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InstagramPreview caption={captions[0].text} />
                    </CardContent>
                  </Card>
                )}

                {/* Recent Generations */}
                <RecentGenerations type="captions" campaignId={selectedCampaign?._id} />
              </div>
            </div>
          </div>
        )
      )}

      {selectedCampaign && captions.length > 0 && (
        <motion.div
          className="text-center text-sm font-semibold text-slate-700 dark:text-gray-300 bg-gradient-to-r from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/40 dark:to-pink-900/40 p-4 rounded-2xl border-2 border-slate-200 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-2 text-purple-600 dark:text-purple-400" />
          Showing {captions.length} caption{captions.length !== 1 ? 's' : ''} for {selectedCampaign.name}
        </motion.div>
      )}
    </div>
  );
}

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

  const fetchCaptionsForCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/captions?campaignId=${campaignId}`);
      const data = await res.json();
      setCaptions(data);
    } catch (err) {
      console.error('Failed to fetch captions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchCaptionsForCampaign(campaign._id);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setCaptions([]);
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
              {selectedCampaign ? selectedCampaign.name : 'Generated Captions'}
            </h2>
            <p className="text-slate-600 mt-1 text-base">
              {selectedCampaign ? 'View all captions for this campaign' : 'Select a campaign to view captions'}
            </p>
          </div>
        </div>
        <Link href="/">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 px-6 py-6">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate New
          </Button>
        </Link>
      </div>

      {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-slate-50 via-white to-purple-50 min-h-[450px] hover-scale transition-all duration-500">
                <div className="flex flex-col items-center gap-4 text-center p-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                        <Target className="w-16 h-16 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
                      No campaigns found
                    </h3>
                    <p className="text-base text-slate-600 max-w-md leading-relaxed">
                      Create your first campaign to start generating AI-powered captions.
                    </p>
                    <Link href="/campaigns/new">
                      <Button className="mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 px-8 py-6 text-base">
                        <Target className="w-5 h-5 mr-2" />
                        Create Campaign
                      </Button>
                    </Link>
                </div>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
            {campaigns.map((campaign, idx) => {
              const colors = campaignColors[idx % campaignColors.length];
              return (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleCampaignSelect(campaign)}
                  className="cursor-pointer group"
                  whileHover={{ y: -4 }}
                >
                  <Card className={`${colors.bg} border-2 ${colors.border} hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden`}>
                      {/* Glow effect on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      <CardHeader className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
                        </div>
                        <CardTitle className={`text-xl font-bold ${colors.text} group-hover:scale-105 transition-transform`}>{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-slate-700 font-medium">
                            <Building className="w-4 h-4" />
                            {campaign.businessName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-white shadow-sm">
                              <span className="text-slate-700 font-medium">Objective</span>
                              <Badge variant="outline" className={`${colors.badge} font-semibold`}>{campaign.objective}</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-white shadow-sm">
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <Zap className="w-4 h-4 text-purple-600" />
                                Credits
                              </div>
                              <span className="font-bold text-purple-600 text-base">{campaign.credits}</span>
                            </div>
                        </div>
                        <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md group-hover:shadow-lg transition-all" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Captions
                        </Button>
                      </CardContent>
                  </Card>
                </motion.div>
            );
            })}
          </div>
        )
      ) : (
        // Captions View
        loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
          </div>
        ) : captions.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-purple-50 min-h-[450px]">
                <div className="flex flex-col items-center gap-4 text-center p-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                        <FileText className="w-16 h-16 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
                      No captions found
                    </h3>
                    <p className="text-base text-slate-600 max-w-md leading-relaxed">
                      No captions have been generated for this campaign yet.
                    </p>
                    <Link href="/">
                      <Button className="mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 px-8 py-6 text-base">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Caption
                      </Button>
                    </Link>
                </div>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
            {captions.map((caption, idx) => {
              const colors = campaignColors[idx % campaignColors.length];
              return (
                <motion.div
                  key={caption._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={`${colors.bg} border-2 ${colors.border} hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative overflow-hidden group`}>
                      {/* Glow effect on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      <CardHeader className="relative">
                          <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className={`text-xs font-semibold ${colors.badge} shadow-sm`}>
                                {caption.source || 'AI Generated'}
                              </Badge>
                              <div className="flex items-center gap-1 px-2 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-white shadow-sm">
                                <Zap className="w-3 h-3 text-purple-600" />
                                <span className="text-xs font-bold text-purple-600">{caption.creditsUsed}</span>
                              </div>
                          </div>
                          <CardTitle className={`text-base leading-relaxed font-semibold ${colors.text} group-hover:scale-[1.02] transition-transform`}>
                              "{caption.text}"
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-end relative">
                          <div className="flex items-center justify-between text-xs bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-white shadow-sm">
                              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(caption.createdAt).toLocaleDateString()}
                              </div>
                              <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-3 text-xs font-semibold text-slate-700 hover:bg-white hover:text-purple-600 transition-all"
                                    onClick={() => copyToClipboard(caption.text, caption._id)}
                                >
                                    {copiedId === caption._id ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 mr-1 text-green-600" />
                                        Copied
                                    </>
                                    ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5 mr-1" />
                                        Copy
                                    </>
                                    )}
                                </Button>
                          </div>
                      </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )
      )}

      {selectedCampaign && captions.length > 0 && (
        <motion.div 
          className="text-center text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-50 via-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-slate-200 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-2 text-purple-600" />
          Showing {captions.length} caption{captions.length !== 1 ? 's' : ''} for {selectedCampaign.name}
        </motion.div>
      )}
    </div>
  );
}
