"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StripePaymentButton from "@/components/StripePaymentButton";

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
    // Updated credit calculation matching new campaign logic
    if (n < 100) return Math.floor(n * 1.0);
    if (n < 500) return Math.floor(n * 1.5);
    if (n < 1000) return Math.floor(n * 2.0);
    return Math.floor(n * 2.5);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // If adding budget, redirect to payment instead of saving directly
    if (addBudget && Number(addBudget) > 0) {
      // Don't save yet, just show payment button
      return;
    }
    
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
        credits: campaign.credits || 0, // Keep existing credits if no payment
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

      router.push("/campaigns");
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Save failed");
      setSaving(false);
    }
  };

  const handlePaymentSuccess = async () => {
    // After payment, update the campaign with new credits
    setSaving(true);
    try {
      const form = document.querySelector('form');
      const payload = {
        name: form.name.value,
        businessName: form.businessName.value,
        businessType: form.businessType.value,
        description: form.description.value,
        objective: form.objective.value,
        budget: (campaign.budget || 0) + Number(addBudget),
        credits: (campaign.credits || 0) + additionalCredits,
        targetAudience: form.targetAudience.value,
        tone: form.tone.value,
      };

      const res = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/campaigns/${campaignId}?payment=success`);
      }
    } catch (err) {
      console.error("Update after payment failed:", err);
      setError(err.message || "Update failed");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-md p-3">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={campaign.name || ""} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input id="businessName" name="businessName" defaultValue={campaign.businessName || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <Input id="businessType" name="businessType" defaultValue={campaign.businessType || ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={campaign.description || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective">Objective</Label>
        <Input id="objective" name="objective" defaultValue={campaign.objective || ""} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label htmlFor="addBudget">Add Credits (₹)</Label>
          <Input
            id="addBudget"
            name="addBudget"
            type="number"
            placeholder="e.g. 500"
            value={addBudget}
            onChange={(e) => {
              setAddBudget(e.target.value);
              setAdditionalCredits(calcCredits(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          {addBudget !== "" && (
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-700">
                Credits to Add: <span className="font-bold text-purple-800 text-lg">{additionalCredits}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Textarea id="targetAudience" name="targetAudience" defaultValue={campaign.targetAudience || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Input id="tone" name="tone" defaultValue={campaign.tone || ""} />
      </div>

      {addBudget && Number(addBudget) > 0 ? (
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Payment Required</h3>
            <p className="text-sm text-purple-700 mb-1">
              You're adding <strong>₹{addBudget}</strong> to get <strong>{additionalCredits} credits</strong>
            </p>
            <p className="text-xs text-purple-600">
              Total credits after payment: <strong>{(campaign.credits || 0) + additionalCredits}</strong>
            </p>
          </div>
          <StripePaymentButton
            amount={Number(addBudget)}
            campaignName={campaign.name}
            businessName={campaign.businessName}
            campaignId={campaignId}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      ) : (
        <div>
          <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
