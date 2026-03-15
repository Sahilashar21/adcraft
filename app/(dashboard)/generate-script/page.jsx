'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Copy, Check, ArrowLeft, Target, Building, Sparkles, Wand2, RefreshCw } from "lucide-react";
import { DownloadExportButtons } from "@/components/DownloadExport";
import RecentGenerations from "@/components/RecentGenerations";
import { GeneratingScript } from "@/components/LoadingStates";

export default function GenerateScriptPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [promptGenerating, setPromptGenerating] = useState(false);

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

    const handleGeneratePrompt = async () => {
        if (!selectedCampaign) return;
        setPromptGenerating(true);
        try {
            const res = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: selectedCampaign._id,
                    type: 'script',
                    userPrompt: prompt
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to generate prompt');
            }

            setPrompt(data.prompt || '');
        } catch (err) {
            console.error('Failed to generate prompt:', err);
            alert('Failed to generate prompt. Please try again.');
        } finally {
            setPromptGenerating(false);
        }
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

    const handleRegenerateScript = async () => {
        if (!generatedScript?._id) return;
        setRegenerating(true);
        try {
            const res = await fetch(`/api/generate-script/${generatedScript._id}/regenerate`, {
                method: 'POST'
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to regenerate script');
            }
            setGeneratedScript({
                ...generatedScript,
                script: data.text || data.script || generatedScript.script
            });
        } catch (err) {
            console.error('Failed to regenerate script:', err);
            alert('Failed to regenerate script. Please try again.');
        } finally {
            setRegenerating(false);
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
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            {selectedCampaign && (
            <Button
                variant="outline"
                onClick={handleBackToCampaigns}
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
            </Button>
            )}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-purple-600" />
                AI Script Generator
            </h2>
        </div>
        <Link href="/scripts">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all px-6 py-6">
                <FileText className="w-4 h-4 mr-2" /> View Scripts
            </Button>
        </Link>
        </div>

        {!selectedCampaign ? (
        // Campaign Selection View
        campaigns.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-700/50 bg-white dark:bg-slate-800 min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                                        <div className="p-4 bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/40 rounded-full mb-4">
                                            <Target className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                    </div>
                                        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
                    No campaigns found
                    </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create your first campaign to start generating scripts.
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
            {campaigns.map((campaign) => (
                <Card
                    key={campaign._id}
                    className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
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
                    <Button 
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold" 
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
            <Card className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900/50 shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                    <Wand2 className="w-5 h-5" />
                    Generate Script
                </CardTitle>
                <CardDescription>
                    Create an AI-powered script for {selectedCampaign.name}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Sparkles className="w-4 h-4" />
                    Story/Text Input
                    </label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a story, a product description, or any text to generate a script from..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 min-h-[200px] resize-none"
                    />
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>Use your campaign details to draft a prompt.</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                                                onClick={handleGeneratePrompt}
                                                disabled={promptGenerating}
                                            >
                                                <Sparkles className="w-3 h-3 mr-1" /> {promptGenerating ? 'Generating...' : 'Generate with AI'}
                                            </Button>
                                        </div>
                </div>

                <div className="pt-4">
                    <Button
                    onClick={handleGenerateScript}
                    disabled={generating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 font-semibold"
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
            <Card className="bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900/50 shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText className="w-5 h-5" />
                    Generated Script
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                    Your AI-generated script
                </CardDescription>
                </CardHeader>
                <CardContent>
                {generating && !generatedScript ? (
                    <GeneratingScript />
                ) : generatedScript ? (
                    <div className="space-y-4">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-100">
                            {generatedScript.script}
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(generatedScript.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                  size="sm"
                                  variant="ghost"
                                  className="dark:hover:bg-slate-700"
                                  onClick={() => copyToClipboard(generatedScript.script)}
                              >
                                  {copiedPrompt ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                      <Copy className="w-4 h-4" />
                                  )}
                                  Copy
                              </Button>
                              <Button
                                  size="sm"
                                  variant="ghost"
                                  className="dark:hover:bg-slate-700"
                                  onClick={handleRegenerateScript}
                                  disabled={regenerating}
                              >
                                  <RefreshCw className={`w-4 h-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                                  Regenerate
                              </Button>
                            </div>
                        </div>

                        <DownloadExportButtons
                          caption={generatedScript.script}
                          filename={`script-${generatedScript._id}`}
                        />

                        <div className="pt-4 border-t">
                            <Button
                            onClick={() => setGeneratedScript(null)}
                            variant="outline"
                            className="w-full dark:border-gray-600 dark:text-gray-200"
                            >
                            Generate Another Script
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                            No Script Generated Yet
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fill out the form and click "Generate Script" to create your first AI-powered script.
                        </p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
        )}

                {selectedCampaign && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 text-center text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-pink-50 dark:to-pink-900/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800 font-semibold">
                            Generating scripts for {selectedCampaign.name} • {selectedCampaign.credits} credits remaining
                    </div>
                    <RecentGenerations type="scripts" campaignId={selectedCampaign._id} />
                </div>
                )}
    </div>
  );
}