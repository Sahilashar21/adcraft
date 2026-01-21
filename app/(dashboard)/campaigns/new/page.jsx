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

    router.push("/campaigns");
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">Create Campaign</CardTitle>
        <CardDescription>Fill in the details to create a new campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Summer Sale" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" name="businessName" required placeholder="e.g. AdCraft Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input id="businessType" name="businessType" placeholder="e.g. E-commerce" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe your business and products." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objective">Objective</Label>
            <Input id="objective" name="objective" placeholder="e.g. Increase sales, brand awareness" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="e.g. 500"
                onChange={(e) => {
                  setBudget(e.target.value);
                  setCredits(calcCredits(e.target.value));
                }}
              />
            </div>
            <div className="space-y-2">
              {budget !== "" && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-sm font-medium text-purple-700">Estimated Credits: <span className="font-bold text-gray-800">{credits}</span></p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Textarea id="targetAudience" name="targetAudience" placeholder="e.g. Young professionals, students" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Brand Tone</Label>
            <Input id="tone" name="tone" placeholder="e.g. Fun, formal, witty" />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Create Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
