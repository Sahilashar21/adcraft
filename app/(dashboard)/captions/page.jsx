"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Sparkles, Copy, Check, ArrowLeft, Target, Building } from "lucide-react";
import { motion } from "framer-motion";

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            scale: 0
          }}
          animate={{
            y: -10,
            scale: [0, 1, 0],
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
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

export default function CaptionsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showParticles, setShowParticles] = useState(false);

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
    setShowParticles(true);
    fetchCaptionsForCampaign(campaign._id);
    setTimeout(() => setShowParticles(false), 3000);
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
        <div className="max-w-7xl mx-auto space-y-6">
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
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
                {selectedCampaign ? `Captions for ${selectedCampaign.name}` : 'Generated Captions'}
              </motion.h2>
            </div>
            <motion.div variants={itemVariants}>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate New Caption
                </Button>
              </Link>
            </motion.div>
          </div>

          {!selectedCampaign ? (
            // Campaign Selection View
            campaigns.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-500/10 min-h-[400px]"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <Target className="w-16 h-16 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    No campaigns found
                  </h3>
                  <p className="text-sm text-purple-200">
                    Create your first campaign to start generating captions.
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
                        <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25" size="sm">
                          View Captions
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )
      ) : (
        // Captions View
        loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading captions...</p>
            </div>
          </div>
        ) : captions.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-500/10 min-h-[400px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <FileText className="w-16 h-16 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold tracking-tight text-white">
                No captions found
              </h3>
              <p className="text-sm text-purple-200">
                No captions have been generated for this campaign yet.
              </p>
              <Link href="/">
                <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Caption
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {captions.map((caption, index) => (
              <motion.div
                key={caption._id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-200 bg-purple-500/10">
                      {caption.source || 'AI Generated'}
                    </Badge>
                    <span className="text-xs text-purple-200">
                      {caption.creditsUsed} credits
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight text-white">
                    "{caption.text}"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-purple-200">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(caption.createdAt).toLocaleDateString()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-purple-200 hover:text-white hover:bg-white/10 backdrop-blur-md"
                      onClick={() => copyToClipboard(caption.text, caption._id)}
                    >
                      {copiedId === caption._id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        )
      )}

      {selectedCampaign && captions.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-purple-200"
        >
          Showing {captions.length} caption{captions.length !== 1 ? 's' : ''} for {selectedCampaign.name}
        </motion.div>
      )}
        </div>
      </motion.div>
    </div>
  );
}
