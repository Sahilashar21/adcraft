'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, AlertCircle, Zap, Loader2, Star, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);

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

// Typing animation component
const TypingText = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-purple-400"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

export default function CaptionGenerator() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCampaignId) {
      setError('Please select a campaign');
      return;
    }

    setLoading(true);
    setError(null);
    setCaption(null);
    setShowParticles(true);

    try {
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: selectedCampaignId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setCaption(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setShowParticles(false), 3000);
    }
  };

  const copyToClipboard = () => {
    if (caption) {
      navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

      {showParticles && <FloatingParticles />}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20">
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl" />
              <motion.h2
                className="text-3xl font-bold flex items-center gap-3 relative z-10 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
                AI Caption Generator
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-purple-100 mt-3 relative z-10 text-lg"
              >
                Craft the perfect marketing copy in seconds with AI magic ✨
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-sm font-medium backdrop-blur-md border border-white/10 shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                </motion.div>
                Cost: 5 Credits
              </motion.div>
            </motion.div>

            <div className="p-8 space-y-6">
              {/* Campaign Selection */}
              <motion.div
                variants={itemVariants}
                className="space-y-3"
              >
                <motion.label
                  className="text-sm font-semibold text-purple-100 ml-1 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <Rocket className="w-4 h-4" />
                  Select Campaign
                </motion.label>
                <motion.select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all appearance-none cursor-pointer"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="" className="bg-slate-800 text-white">Choose a campaign...</option>
                  {campaigns.map((campaign) => (
                    <option
                      key={campaign._id}
                      value={campaign._id}
                      className="bg-slate-800 text-white"
                    >
                      {campaign.name} - {campaign.businessName} ({campaign.objective}) - {campaign.credits || 0} credits left
                    </option>
                  ))}
                </motion.select>
                {campaigns.length === 0 && !loading && (
                  <p className="text-purple-200 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No campaigns found. <a href="/campaigns/new" className="text-purple-300 hover:text-purple-100 underline">Create one first</a> in the dashboard.
                  </p>
                )}
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="bg-red-500/20 text-red-300 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-400/30 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    </motion.div>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result Area */}
              <motion.div
                variants={itemVariants}
                className="relative min-h-[140px] flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border-2 border-dashed border-purple-400/30 group transition-all hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm"
              >
                {loading ? (
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-10 h-10 text-purple-400" />
                    </motion.div>
                    <motion.span
                      className="text-sm text-purple-200 font-medium"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Generating magic...
                    </motion.span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : caption ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-full p-6 text-center relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-xl" />
                    <motion.div
                      className="relative z-10"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <TypingText text={`"${caption}"`} speed={30} />
                    </motion.div>
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyToClipboard}
                      className="absolute top-3 right-3 p-3 text-purple-300 hover:text-white bg-white/10 rounded-lg shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm hover:bg-white/20"
                      title="Copy to clipboard"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                          >
                            <Check className="w-5 h-5 text-green-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                          >
                            <Copy className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.span
                    className="text-purple-300 text-sm flex items-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-4 h-4" />
                    Your caption will appear here
                  </motion.span>
                )}
              </motion.div>

              {/* Action Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-bold text-white shadow-xl shadow-purple-500/30 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:shadow-purple-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Caption
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}