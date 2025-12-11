"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditForm({ campaign }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // id may be in campaign._id or campaign.id (defensive)
  const campaignId = campaign?._id || campaign?.id;

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
        budget: form.budget.value ? Number(form.budget.value) : 0,
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

      // success — redirect back to dashboard (change if you have a campaign view)
      router.push("/dashboard");
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Save failed");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}

      <label className="block">
        <div className="text-sm font-medium">Name</div>
        <input name="name" defaultValue={campaign.name || ""} className="border p-2 w-full" />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Business name</div>
        <input name="businessName" defaultValue={campaign.businessName || ""} className="border p-2 w-full" />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Business type</div>
        <input name="businessType" defaultValue={campaign.businessType || ""} className="border p-2 w-full" />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Description</div>
        <textarea name="description" defaultValue={campaign.description || ""} className="border p-2 w-full" rows={4} />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Objective</div>
        <input name="objective" defaultValue={campaign.objective || ""} className="border p-2 w-full" />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Budget</div>
        <input name="budget" type="number" defaultValue={campaign.budget ?? ""} className="border p-2 w-full" />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Target audience</div>
        <textarea name="targetAudience" defaultValue={campaign.targetAudience || ""} className="border p-2 w-full" rows={3} />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Tone</div>
        <input name="tone" defaultValue={campaign.tone || ""} className="border p-2 w-full" />
      </label>

      <div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}




// "use client";
// import { useRouter } from "next/navigation";
// export default function EditForm({ campaign }) {
//   const router = useRouter();
//   const save = async e => {
//     e.preventDefault();
//     const f = e.target;
//     const data = {
//       name: f.name.value,
//       businessName: f.businessName.value,
//       businessType: f.businessType.value,
//       description: f.description.value,
//       objective: f.objective.value,
//       budget: Number(f.budget.value),
//       targetAudience: f.targetAudience.value,
//       tone: f.tone.value
//     };
//     await fetch(`/api/campaigns/${campaign._id}`, { method: "PUT", body: JSON.stringify(data) });
//     router.push("/dashboard");
//   };

//   return (
//     <form onSubmit={save} className="space-y-3">
//       <input defaultValue={campaign.name} name="name" className="border p-2 w-full"/>
//       <input defaultValue={campaign.businessName} name="businessName" className="border p-2 w-full"/>
//       <input defaultValue={campaign.businessType} name="businessType" className="border p-2 w-full"/>
//       <textarea defaultValue={campaign.description} name="description" className="border p-2 w-full"/>
//       <input defaultValue={campaign.objective} name="objective" className="border p-2 w-full"/>
//       <input defaultValue={campaign.budget} name="budget" type="number" className="border p-2 w-full"/>
//       <textarea defaultValue={campaign.targetAudience} name="targetAudience" className="border p-2 w-full"/>
//       <input defaultValue={campaign.tone} name="tone" className="border p-2 w-full"/>
//       <button className="bg-blue-600 text-white p-2 w-full">Save</button>
//     </form>
//   );
// }
