'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoIcon, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles } from "lucide-react";

export default function VideosPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [videos, setVideos] = useState([]);
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

  if (loading && !selectedCampaign) {
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
                <VideoIcon className="w-8 h-8 text-purple-600" />
                {selectedCampaign ? `Videos for ${selectedCampaign.name}` : 'Video Library'}
            </h2>
        </div>
        <Link href="/generate-video">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Generate New Video
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
                    Create your first campaign to start generating videos.
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
                    <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                        View Videos
                    </Button>
                    </CardContent>
                </Card>
            ))}
            </div>
        )
        ) : (
        // Videos View
        loading ? (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading videos...</p>
                </div>
            </div>
        ) : videos.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <VideoIcon className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                    No videos found
                    </h3>
                    <p className="text-sm text-gray-500">
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
                <Card key={video._id} className="bg-white shadow-md hover:shadow-lg transition-all duration-300 group">
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
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {video.prompt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                            <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">
                            {video.style}
                            </Badge>
                            <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">
                            {video.platform}
                            </Badge>
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            ))}
            </div>
        )
        )}

        {selectedCampaign && videos.length > 0 && (
        <div className="text-center text-sm text-gray-500">
            Showing {videos.length} video{videos.length !== 1 ? 's' : ''} for {selectedCampaign.name}
        </div>
        )}
    </div>
  );
}
