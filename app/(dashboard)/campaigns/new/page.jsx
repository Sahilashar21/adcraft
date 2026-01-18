"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewCampaignPage() {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [credits, setCredits] = useState(0);

  const calcCredits = (n) => {
    n = Number(n);
    if (!n) return 0;
    if (n < 200) return Math.floor(n * 0.9);
    if (n < 500) return Math.floor(n * 1.0);
    return Math.floor(n * 1.2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    await fetch("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });

    router.push("/dashboard");
  };

  return (
    <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Create Campaign</CardTitle>
        <CardDescription className="text-purple-200">Fill in the details to create a new campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Campaign Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Summer Sale" className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-white">Business Name</Label>
              <Input id="businessName" name="businessName" required placeholder="e.g. AdCraft Inc." className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-white">Business Type</Label>
              <Input id="businessType" name="businessType" placeholder="e.g. E-commerce" className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe your business and products." className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objective" className="text-white">Objective</Label>
            <Input id="objective" name="objective" placeholder="e.g. Increase sales, brand awareness" className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-white">Budget (₹)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="e.g. 500"
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                onChange={(e) => {
                  setBudget(e.target.value);
                  setCredits(calcCredits(e.target.value));
                }}
              />
            </div>
            <div className="space-y-2">
              {budget !== "" && (
                <div className="p-3 bg-purple-500/20 border border-purple-400/50 rounded-md backdrop-blur-md">
                  <p className="text-sm font-medium text-purple-200">Estimated Credits: <span className="font-bold text-white">{credits}</span></p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
            <Textarea id="targetAudience" name="targetAudience" placeholder="e.g. Young professionals, students" className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone" className="text-white">Brand Tone</Label>
            <Input id="tone" name="tone" placeholder="e.g. Fun, formal, witty" className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
            Create Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
