'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GenerateScript() {
  const [prompt, setPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');

  useEffect(() => {
    async function fetchCampaigns() {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    }
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt || !selectedCampaign) {
      alert('Please enter a prompt and select a campaign.');
      return;
    }

    setLoading(true);
    setGeneratedScript('');

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, campaignId: selectedCampaign }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.json();
      setGeneratedScript(data.script);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">AI Script Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mb-8">
        <div>
            <Select onValueChange={setSelectedCampaign}>
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
        <div>
          <Textarea
            placeholder="Enter a story or a few sentences to generate a script..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Script'}
        </Button>
      </form>

      {generatedScript && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Script</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{generatedScript}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
