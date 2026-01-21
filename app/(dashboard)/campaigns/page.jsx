import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Link from "next/link";
import DeleteCampaignButton from "@/components/DeleteCampaignButton.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CirclePlus, Target, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CampaignsPage() {
  await connectDB();

  const campaigns = await Campaign.find({ userId: "default_user" })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
        <Link href="/campaigns/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <CirclePlus className="w-4 h-4 mr-2" /> Create New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <Target className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold tracking-tight text-gray-800">
              No campaigns yet
            </h3>
            <p className="text-sm text-gray-500">
              Create your first campaign to get started with AI-powered marketing.
            </p>
            <Link href="/campaigns/new">
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                <CirclePlus className="w-4 h-4 mr-2" /> Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c._id.toString()} className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex justify-between items-start text-gray-800">
                  <span className="text-xl">{c.name}</span>
                  <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50">{c.objective}</Badge>
                </CardTitle>
                <CardDescription>{c.businessName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {c.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>Budget: ${c.budget}</span>
                  <span>Credits: {c.credits || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/campaigns/${c._id.toString()}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Link href={`/campaigns/${c._id.toString()}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </Link>
                  <DeleteCampaignButton id={c._id.toString()} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}