"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import StripePaymentButton from "@/components/StripePaymentButton";

export default function NewCampaignPage() {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [credits, setCredits] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignCreated, setCampaignCreated] = useState(null);
  const [formData, setFormData] = useState({});

  const calcCredits = (n) => {
    n = Number(n);
    if (!n) return 0;
    // Updated credit calculation:
    // ₹1-99: 1 credit per ₹1 (100%)
    // ₹100-499: 1.5 credits per ₹1 (150%)
    // ₹500-999: 2 credits per ₹1 (200%)
    // ₹1000+: 2.5 credits per ₹1 (250%)
    if (n < 100) return Math.floor(n * 1.0);
    if (n < 500) return Math.floor(n * 1.5);
    if (n < 1000) return Math.floor(n * 2.0);
    return Math.floor(n * 2.5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const f = e.target;

    const data = {
      name: f.name.value,
      businessName: f.businessName.value,
      businessType: f.businessType.value,
      description: f.description.value,
      objective: f.objective.value,
      budget: Number(f.budget.value),
      targetAudience: f.targetAudience.value,
      tone: f.tone.value,
      credits,
    };

    setFormData(data);

    const response = await fetch("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const createdCampaign = await response.json();
    setCampaignCreated(createdCampaign);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {campaignCreated && (
        <Card className="bg-white shadow-2xl border-2 border-green-200 mb-6">
          <div className="h-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600"></div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">✓ Campaign Created Successfully!</h3>
                <p className="text-gray-600">Your campaign "<strong>{campaignCreated.name}</strong>" has been created. Complete the payment to activate it.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700 mb-2"><strong>Campaign Budget:</strong> ₹{campaignCreated.budget}</p>
                <p className="text-sm text-gray-700"><strong>Earned Credits:</strong> {campaignCreated.credits} credits</p>
              </div>
              <StripePaymentButton
                amount={campaignCreated.budget}
                campaignName={campaignCreated.name}
                businessName={campaignCreated.businessName}
                campaignId={campaignCreated._id}
                onPaymentSuccess={() => {
                  setTimeout(() => router.push("/campaigns"), 2000);
                }}
              />
              <Button 
                variant="outline" 
                onClick={() => {
                  setCampaignCreated(null);
                  router.push("/campaigns");
                }}
                className="w-full"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!campaignCreated && (
        <Card className="bg-white shadow-2xl border-2 border-purple-100">
          <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
          
          <CardHeader className="pb-6 pt-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Create <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Campaign</span>
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600">
              Fill in the details to create a new marketing campaign with AI-powered features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Campaign Name</Label>
              <Input 
                id="name" 
                name="name" 
                required 
                placeholder="e.g. Summer Sale 2026" 
                className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base py-6"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-semibold text-gray-700">Business Name</Label>
                <Input 
                  id="businessName" 
                  name="businessName" 
                  required 
                  placeholder="e.g. AdCraft Inc." 
                  className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base py-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-sm font-semibold text-gray-700">Business Type</Label>
                <Input 
                  id="businessType" 
                  name="businessType" 
                  placeholder="e.g. E-commerce, SaaS" 
                  className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base py-6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe your business, products, and campaign goals..." 
                className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective" className="text-sm font-semibold text-gray-700">Objective</Label>
              <Input 
                id="objective" 
                name="objective" 
                placeholder="e.g. Increase sales, Brand awareness" 
                className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base py-6"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Budget (₹)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="e.g. 500"
                  className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base py-6"
                  onChange={(e) => {
                    setBudget(e.target.value);
                    setCredits(calcCredits(e.target.value));
                  }}
                />
              </div>
              <div className="space-y-2">
                {budget !== "" && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg transition-all duration-500 animate-slide-up">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <p className="text-sm font-semibold text-purple-700">Estimated Credits</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {credits}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700">Target Audience</Label>
              <Textarea 
                id="targetAudience" 
                name="targetAudience" 
                placeholder="e.g. Young professionals aged 25-35, tech enthusiasts" 
                className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm font-semibold text-gray-700">Brand Tone</Label>
              <Input 
                id="tone" 
                name="tone" 
                placeholder="e.g. Fun, Professional, Witty, Inspiring" 
                className="border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 text-base py-6"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
