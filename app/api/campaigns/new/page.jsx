"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    const form = e.target;

    const data = {
      name: form.name.value,
      businessName: form.businessName.value,
      businessType: form.businessType.value,
      description: form.description.value,
      objective: form.objective.value,
      budget: Number(form.budget.value),
      targetAudience: form.targetAudience.value,
      tone: form.tone.value,
    };

    const res = await fetch("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setErr(json.error);
      setLoading(false);
      return;
    }

    setMsg("Campaign created!");
    setTimeout(() => router.push("/dashboard"), 800);
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Create New Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Campaign Name *" required className="w-full p-2 border rounded" />

        <input name="businessName" placeholder="Business Name *" required className="w-full p-2 border rounded" />

        <input name="businessType" placeholder="Business Type" className="w-full p-2 border rounded" />

        <textarea name="description" placeholder="Business Description" className="w-full p-2 border rounded"></textarea>

        <input name="objective" placeholder="Objective (sales/awareness)" className="w-full p-2 border rounded" />

        <input name="budget" type="number" placeholder="Budget (₹) *" required className="w-full p-2 border rounded" />

        <textarea name="targetAudience" placeholder="Target Audience" className="w-full p-2 border rounded"></textarea>

        <input name="tone" placeholder="Brand Tone (fun/formal)" className="w-full p-2 border rounded" />

        {err && <p className="text-red-600 text-sm">{err}</p>}
        {msg && <p className="text-green-600 text-sm">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </main>
  );
}
