"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditForm({ campaign }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [addBudget, setAddBudget] = useState("");
  const [additionalCredits, setAdditionalCredits] = useState(0);

  const campaignId = campaign?._id || campaign?.id;

  const calcCredits = (n) => {
    n = Number(n);
    if (!n) return 0;
    if (n < 200) return Math.floor(n * 0.9);
    if (n < 500) return Math.floor(n * 1.0);
    return Math.floor(n * 1.2);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const form = e.target;
      const payload = {
        name: form.name.value,
        businessName: form.businessName.value,
        businessType: form.businessType.value,
        description: form.description.value,
        objective: form.objective.value,
        credits: (campaign.credits || 0) + additionalCredits,
        targetAudience: form.targetAudience.value,
        tone: form.tone.value,
      };

      const res = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Save failed");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className="text-red-400 font-medium bg-red-500/20 border border-red-400/50 rounded-md p-3 backdrop-blur-md">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">Name</Label>
        <Input id="name" name="name" defaultValue={campaign.name || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-white">Business Name</Label>
          <Input id="businessName" name="businessName" defaultValue={campaign.businessName || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessType" className="text-white">Business Type</Label>
          <Input id="businessType" name="businessType" defaultValue={campaign.businessType || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea id="description" name="description" defaultValue={campaign.description || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective" className="text-white">Objective</Label>
        <Input id="objective" name="objective" defaultValue={campaign.objective || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label htmlFor="addBudget" className="text-white">Add Credits (₹)</Label>
          <Input
            id="addBudget"
            name="addBudget"
            type="number"
            placeholder="e.g. 500"
            className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
            value={addBudget}
            onChange={(e) => {
              setAddBudget(e.target.value);
              setAdditionalCredits(calcCredits(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          {addBudget !== "" && (
            <div className="p-3 bg-purple-500/20 border border-purple-400/50 rounded-md backdrop-blur-md">
              <p className="text-sm font-medium text-purple-200">Credits to Add: <span className="font-bold text-white">{additionalCredits}</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
        <Textarea id="targetAudience" name="targetAudience" defaultValue={campaign.targetAudience || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone" className="text-white">Tone</Label>
        <Input id="tone" name="tone" defaultValue={campaign.tone || ""} className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400" />
      </div>

      <div>
        <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 disabled:opacity-50">
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
