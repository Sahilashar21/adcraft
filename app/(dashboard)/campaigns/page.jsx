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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Campaigns</h1>
        <Link href="/campaigns/new">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
            <CirclePlus className="w-4 h-4 mr-2" /> Create New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-500/10 min-h-[400px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <Target className="w-16 h-16 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold tracking-tight text-white">
              No campaigns yet
            </h3>
            <p className="text-sm text-purple-200">
              Create your first campaign to get started with AI-powered marketing.
            </p>
            <Link href="/campaigns/new">
              <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
                <CirclePlus className="w-4 h-4 mr-2" /> Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c._id.toString()} className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex justify-between items-start text-white">
                  <span className="text-xl">{c.name}</span>
                  <Badge variant="outline" className="border-purple-400/50 text-purple-200 bg-purple-500/10">{c.objective}</Badge>
                </CardTitle>
                <CardDescription className="text-purple-200">{c.businessName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-200 mb-4 line-clamp-2">
                  {c.description}
                </p>
                <div className="flex justify-between items-center text-sm text-purple-200 mb-4">
                  <span>Budget: ${c.budget}</span>
                  <span>Credits: {c.credits || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/campaigns/${c._id}/edit`}>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Link href={`/campaigns/${c._id}`}>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
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