
"use client";
import { useRouter } from "next/navigation";
export default function EditForm({ campaign }) {
  const router = useRouter();
  const save = async e => {
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
      tone: f.tone.value
    };
    await fetch(`/api/campaigns/${campaign._id}`, { method: "PUT", body: JSON.stringify(data) });
    router.push("/dashboard");
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <input defaultValue={campaign.name} name="name" className="border p-2 w-full"/>
      <input defaultValue={campaign.businessName} name="businessName" className="border p-2 w-full"/>
      <input defaultValue={campaign.businessType} name="businessType" className="border p-2 w-full"/>
      <textarea defaultValue={campaign.description} name="description" className="border p-2 w-full"/>
      <input defaultValue={campaign.objective} name="objective" className="border p-2 w-full"/>
      <input defaultValue={campaign.budget} name="budget" type="number" className="border p-2 w-full"/>
      <textarea defaultValue={campaign.targetAudience} name="targetAudience" className="border p-2 w-full"/>
      <input defaultValue={campaign.tone} name="tone" className="border p-2 w-full"/>
      <button className="bg-blue-600 text-white p-2 w-full">Save</button>
    </form>
  );
}
