'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Download, Copy, Check, ArrowLeft, Target, Building, Sparkles, Wand2 } from "lucide-react";

export default function GenerateScriptPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Form state for script generation
  const [prompt, setPrompt] = useState('');

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
    setGeneratedScript(null);
    setPrompt('');
  };

  const handleGenerateScript = async () => {
    if (!selectedCampaign || !prompt.trim()) {
      alert('Please select a campaign and enter a prompt');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign._id,
          prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setGeneratedScript(data);
      setPrompt('');
    } catch (err) {
      console.error('Failed to generate script:', err);
      alert('Failed to generate script: ' + err.message);
    } finally {
      setGenerating(false);
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
                <Wand2 className="w-8 h-8 text-purple-600" />
                AI Script Generator
            </h2>
        </div>
        <Link href="/scripts">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <FileText className="w-4 h-4 mr-2" /> View Scripts
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
                    Create your first campaign to start generating scripts.
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
                    <Button 
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white" 
                        size="sm"
                    >
                        Generate Scripts
                    </Button>
                    </CardContent>
                </Card>
            ))}
            </div>
        )
        ) : (
        // Script Generation View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Generate Script
                </CardTitle>
                <CardDescription>
                    Create an AI-powered script for {selectedCampaign.name}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Story/Text Input
                    </label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a story, a product description, or any text to generate a script from..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 min-h-[200px] resize-none"
                    />
                </div>

                <div className="pt-4">
                    <Button
                    onClick={handleGenerateScript}
                    disabled={generating || !prompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                    >
                    {generating ? (
                        <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                        </>
                    ) : (
                        <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Script (2 Credits)
                        </>
                    )}
                    </Button>
                </div>
                </CardContent>
            </Card>

            {/* Generated Script Display */}
            <Card className="bg-white shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated Script
                </CardTitle>
                <CardDescription>
                    Your AI-generated script
                </CardDescription>
                </CardHeader>
                <CardContent>
                {generatedScript ? (
                    <div className="space-y-4">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {generatedScript.script}
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(generatedScript.createdAt).toLocaleDateString()}
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(generatedScript.script)}
                            >
                                {copiedPrompt ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                                Copy
                            </Button>
                        </div>

                        <div className="pt-4 border-t">
                            <Button
                            onClick={() => setGeneratedScript(null)}
                            variant="outline"
                            className="w-full"
                            >
                            Generate Another Script
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            No Script Generated Yet
                        </h3>
                        <p className="text-sm text-gray-500">
                            Fill out the form and click "Generate Script" to create your first AI-powered script.
                        </p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
        )}

        {selectedCampaign && (
        <div className="text-center text-sm text-gray-500">
            Generating scripts for {selectedCampaign.name} • {selectedCampaign.credits} credits remaining
        </div>
        )}
    </div>
  );
}