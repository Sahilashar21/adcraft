import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Link from "next/link";

export default async function DashboardPage() {
  await connectDB();
  const campaigns = await Campaign.find({ userId: "default_user" }).sort({ createdAt: -1 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Campaigns</h2>

        <Link
          href="/campaigns/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campaigns.map((c) => (
          <div
            key={c._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition border"
          >
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-600">{c.businessName}</p>

            <div className="mt-2 text-sm text-gray-800">
              Budget: ₹{c.budget} • Credits: {c.credits}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/campaigns/${c._id}/edit`}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>

              <form
                action={async () => {
                  "use server";
                  await connectDB();
                  await Campaign.findByIdAndDelete(c._id);
                }}
              >
                <button className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No campaigns yet.</p>
      )}
    </div>
  );
}
