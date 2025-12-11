"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Campaign</h2>

      <form
        onSubmit={async (e) => {
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
        }}
        className="space-y-4"
      >
        {/* Inputs */}
        <input name="name" required className="input" placeholder="Campaign Name" />
        <input name="businessName" required className="input" placeholder="Business Name" />
        <input name="businessType" className="input" placeholder="Business Type" />
        <textarea name="description" className="input" placeholder="Description" />

        <input name="objective" className="input" placeholder="Objective (sales/awareness)" />

        {/* Budget + credits */}
        <input
          name="budget"
          type="number"
          className="input"
          placeholder="Budget (₹)"
          onChange={(e) => {
            setBudget(e.target.value);
            setCredits(calcCredits(e.target.value));
          }}
        />

        {budget !== "" && (
          <p className="text-blue-600 font-medium">Credits: {credits}</p>
        )}

        <textarea
          name="targetAudience"
          className="input"
          placeholder="Target Audience"
        />

        <input name="tone" className="input" placeholder="Brand Tone (fun/formal)" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Create
        </button>
      </form>
    </div>
  );
}
