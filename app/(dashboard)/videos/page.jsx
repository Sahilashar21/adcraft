'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { DownloadExportButtons } from "@/components/DownloadExport";
import RecentGenerations from "@/components/RecentGenerations";
import { GeneratingVideo } from "@/components/LoadingStates";

export default function VideosPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);

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

  const fetchVideosForCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?campaignId=${campaignId}`);
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchVideosForCampaign(campaign._id);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setVideos([]);
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

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegenerateVideo = async (videoId) => {
    setRegeneratingId(videoId);
    try {
      const res = await fetch(`/api/videos/${videoId}/regenerate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to regenerate video');
      }
      setVideos((prev) => prev.map((vid) => (vid._id === videoId ? data : vid)));
    } catch (err) {
      console.error('Failed to regenerate video:', err);
      alert('Failed to regenerate video. Please try again.');
    } finally {
      setRegeneratingId(null);
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
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 dark:hover:from-slate-800 hover:to-purple-50 dark:hover:to-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
          )}
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              {selectedCampaign ? selectedCampaign.name : 'Video Library'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-base">
              {selectedCampaign ? 'View all videos for this campaign' : 'Browse your AI-generated videos'}
            </p>
          </div>
        </div>
        <Link href="/generate-video">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 px-6 py-6">
            <Sparkles className="w-5 h-5 mr-2" /> Generate New Video
          </Button>
        </Link>
      </div>

      {!selectedCampaign ? (
        campaigns.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-pink-50 dark:to-pink-900/20 min-h-[400px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/40 rounded-full">
                <Target className="w-16 h-16 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
                No campaigns found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create your first campaign to start generating videos.
              </p>
              <Link href="/campaigns/new">
                <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
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
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
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
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                    View Videos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        loading ? (
          <div className="flex items-center justify-center h-full">
            <GeneratingVideo />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 min-h-[400px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <VideoIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
                No videos found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No videos have been generated for this campaign yet.
              </p>
              <Link href="/generate-video">
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Video
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="relative">
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => downloadVideo(video.videoUrl, `adcraft-${video._id}.mp4`)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(video.prompt, video._id)}
                      >
                        {copiedId === video._id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => handleRegenerateVideo(video._id)}
                        disabled={regeneratingId === video._id}
                        title="Regenerate"
                      >
                        <RefreshCw className={`w-4 h-4 ${regeneratingId === video._id ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-3">
                      {video.prompt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(video.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 text-xs">
                          {video.style}
                        </Badge>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 text-xs">
                          {video.platform}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <DownloadExportButtons
                        caption={video.prompt}
                        mediaUrl={video.videoUrl}
                        mediaType="video"
                        filename={`video-${video._id}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {selectedCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 text-center text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-400/30 font-semibold">
            Showing {videos.length} video{videos.length !== 1 ? 's' : ''} for {selectedCampaign.name}
          </div>
          <RecentGenerations type="videos" campaignId={selectedCampaign._id} />
        </div>
      )}
    </div>
  );
}
