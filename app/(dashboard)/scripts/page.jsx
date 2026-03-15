'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Copy, Check, ArrowLeft, Target, Building, Sparkles, RefreshCw } from "lucide-react";
import { DownloadExportButtons } from "@/components/DownloadExport";
import RecentGenerations from "@/components/RecentGenerations";
import { GeneratingScript } from "@/components/LoadingStates";

export default function ScriptsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [scripts, setScripts] = useState([]);
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

  const fetchScriptsForCampaign = async (campaignId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scripts?campaignId=${campaignId}`);
      const data = await res.json();
      setScripts(data);
    } catch (err) {
      console.error('Failed to fetch scripts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchScriptsForCampaign(campaign._id);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setScripts([]);
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

  const handleRegenerateScript = async (scriptId) => {
    setRegeneratingId(scriptId);
    try {
      const res = await fetch(`/api/generate-script/${scriptId}/regenerate`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to regenerate script');
      }
      setScripts((prev) => prev.map((item) => (item._id === scriptId ? { ...item, text: data.text || item.text } : item)));
    } catch (err) {
      console.error('Failed to regenerate script:', err);
      alert('Failed to regenerate script. Please try again.');
    } finally {
      setRegeneratingId(null);
    }
  };

  if (loading && !selectedCampaign) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <GeneratingScript />
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
              Back
            </Button>
          )}
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {selectedCampaign ? selectedCampaign.name : 'Script Library'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-base">
              {selectedCampaign ? 'View all scripts for this campaign' : 'Browse your AI-generated scripts'}
            </p>
          </div>
        </div>
        <Link href="/generate-script">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 px-6 py-6">
            <FileText className="w-5 h-5 mr-2" />
            Generate New Script
          </Button>
        </Link>
      </div>

      {!selectedCampaign ? (
        campaigns.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-pink-50 dark:to-pink-900/20 min-h-[400px]">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/40 rounded-full">
                <Target className="w-16 h-16 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
                No campaigns found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create your first campaign to start generating scripts.
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
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                    View Scripts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        loading ? (
          <div className="flex items-center justify-center h-full">
            <GeneratingScript />
          </div>
        ) : scripts.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-pink-50 dark:to-pink-900/20 min-h-[400px]">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/40 rounded-full">
                <FileText className="w-16 h-16 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
                No scripts found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No scripts have been generated for this campaign yet.
              </p>
              <Link href="/generate-script">
                <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Script
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scripts.map((script) => (
              <Card key={script._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap line-clamp-6">
                    {script.text}
                  </p>
                  <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(script.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="dark:hover:bg-slate-700"
                        onClick={() => copyToClipboard(script.text, script._id)}
                      >
                        {copiedId === script._id ? (
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
                        onClick={() => handleRegenerateScript(script._id)}
                        disabled={regeneratingId === script._id}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${regeneratingId === script._id ? 'animate-spin' : ''}`} />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <DownloadExportButtons
                    caption={script.text}
                    filename={`script-${script._id}`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {selectedCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 text-center text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-pink-50 dark:to-pink-900/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800 font-semibold">
            Showing {scripts.length} script{scripts.length !== 1 ? 's' : ''} for {selectedCampaign.name}
          </div>
          <RecentGenerations type="scripts" campaignId={selectedCampaign._id} />
        </div>
      )}
    </div>
  );
}
