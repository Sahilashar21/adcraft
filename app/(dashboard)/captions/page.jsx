"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Sparkles, Copy, Check, ArrowLeft, Target, Building } from "lucide-react";

export default function CaptionsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [captions, setCaptions] = useState([]);
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
            <Sparkles className="w-8 h-8 text-purple-600" />
            {selectedCampaign ? `Captions for ${selectedCampaign.name}` : 'Generated Captions'}
          </h2>
        </div>
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Sparkles className="w-4 h-4 mr-2" /> Generate New Caption
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
                    Create your first campaign to start generating captions.
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
                        View Captions
                    </Button>
                    </CardContent>
                </Card>
            ))}
          </div>
        )
      ) : (
        // Captions View
        loading ? (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading captions...</p>
                </div>
          </div>
        ) : captions.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                    No captions found
                    </h3>
                    <p className="text-sm text-gray-500">
                    No captions have been generated for this campaign yet.
                    </p>
                    <Link href="/">
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Caption
                    </Button>
                    </Link>
                </div>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {captions.map((caption) => (
                <Card key={caption._id} className="bg-white shadow-md hover:shadow-lg transition-all duration-300 h-full">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 bg-purple-50">
                            {caption.source || 'AI Generated'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                            {caption.creditsUsed} credits
                            </span>
                        </div>
                        <CardTitle className="text-lg leading-tight text-gray-800">
                            "{caption.text}"
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(caption.createdAt).toLocaleDateString()}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
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
            ))}
          </div>
        )
      )}

      {selectedCampaign && captions.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {captions.length} caption{captions.length !== 1 ? 's' : ''} for {selectedCampaign.name}
        </div>
      )}
    </div>
  );
}
