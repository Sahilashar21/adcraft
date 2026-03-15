'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft, CheckCircle, AlertCircle, Zap, TrendingUp, Target, Users } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCampaign(data);
        }
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Campaign Not Found</h2>
            <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/campaigns')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {paymentStatus === 'success' && (
        <Card className="bg-green-50 border-green-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Payment Successful!</h3>
                <p className="text-green-700 text-sm">
                  Your payment of ₹{campaign.budget} has been processed. Your campaign is now active with {campaign.credits} credits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push('/campaigns')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="border-2 border-purple-200">
        <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2 flex items-center gap-3">
                {campaign.name}
                <Badge
                  className={
                    campaign.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : campaign.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {campaign.paymentStatus === 'completed' ? '✓ Paid' : campaign.paymentStatus === 'failed' ? '✗ Failed' : '⏳ Pending'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                {campaign.businessName} • {campaign.businessType || 'General'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-semibold text-purple-700">Budget</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">₹{campaign.budget}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-semibold text-blue-700">Credits</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{campaign.credits}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-pink-600" />
                <p className="text-sm font-semibold text-pink-700">Objective</p>
              </div>
              <p className="text-sm font-medium text-pink-600">{campaign.objective || 'Not specified'}</p>
            </div>
          </div>

          {campaign.description && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Description
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {campaign.description}
              </p>
            </div>
          )}

          {campaign.targetAudience && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Target Audience
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {campaign.targetAudience}
              </p>
            </div>
          )}

          {campaign.tone && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Brand Tone</h3>
              <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1">
                {campaign.tone}
              </Badge>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Link href={`/campaigns/${campaign._id}/edit`}>
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  Edit Campaign
                </Button>
              </Link>
              <Link href="/generate-image">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
