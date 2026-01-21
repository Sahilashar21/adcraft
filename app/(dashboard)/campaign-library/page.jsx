'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CampaignLibrary() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState({ images: [], videos: [], captions: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCampaigns() {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    }
    fetchCampaigns();
  }, []);

  const handleCampaignSelect = async (campaignId) => {
    if (!campaignId) return;
    setSelectedCampaign(campaignId);
    setLoading(true);
    const res = await fetch(`/api/campaign-library/${campaignId}`);
    const data = await res.json();
    setCampaignData(data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Campaign Library</h1>
      
      <div className="mb-6 max-w-sm">
        <Select onValueChange={handleCampaignSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a campaign" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign._id} value={campaign._id}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <p>Loading...</p>}

      {selectedCampaign && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Captions */}
          <Card>
            <CardHeader>
              <CardTitle>Captions</CardTitle>
            </CardHeader>
            <CardContent>
              {campaignData.captions.length > 0 ? (
                <ul className="space-y-2">
                  {campaignData.captions.map((caption) => (
                    <li key={caption._id} className="border p-2 rounded-md">{caption.text}</li>
                  ))}
                </ul>
              ) : (
                <p>No captions found for this campaign.</p>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              {campaignData.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {campaignData.images.map((image) => (
                    <img key={image._id} src={image.url} alt="Generated image" className="rounded-md" />
                  ))}
                </div>
              ) : (
                <p>No images found for this campaign.</p>
              )}
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {campaignData.videos.length > 0 ? (
                <div className="space-y-4">
                  {campaignData.videos.map((video) => (
                    <video key={video._id} src={video.url} controls className="rounded-md w-full" />
                  ))}
                </div>
              ) : (
                <p>No videos found for this campaign.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
