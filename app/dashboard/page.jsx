import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Link from "next/link";

export default async function DashboardPage() {
  await connectDB();

  const campaigns = await Campaign.find({
    userId: "default_user",
  }).sort({ createdAt: -1 });

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <Link
        href="api/campaigns/new"
        className="bg-black text-white px-4 py-2 rounded inline-block"
      >
        + New Campaign
      </Link>

      <div className="space-y-3 mt-6">
        {campaigns.map((c) => (
          <div key={c._id} className="border p-3 rounded">
            <h2 className="text-lg font-medium">{c.name}</h2>
            <p className="text-sm text-gray-500">
              {c.businessName} • Budget ₹{c.budget}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
