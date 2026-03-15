import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Link from "next/link";
import DeleteCampaignButton from "@/components/DeleteCampaignButton.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CirclePlus, Target, Edit, Eye, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CampaignsPage() {
  await connectDB();

  const campaigns = await Campaign.find({ userId: "default_user" })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">My</span> Campaigns
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Create and manage your marketing campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold">
            <CirclePlus className="w-5 h-5 mr-2" /> Create Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white min-h-[450px] transition-all duration-500">
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <Target className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-gray-800 mt-2">
              No campaigns yet
            </h3>
            <p className="text-base text-gray-600 max-w-md leading-relaxed">
              Create your first campaign to get started with AI-powered marketing and unlock creative potential.
            </p>
            <Link href="/campaigns/new">
              <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base font-semibold">
                <CirclePlus className="w-5 h-5 mr-2" /> Create Your First Campaign
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c, index) => (
            <Card 
              key={c._id.toString()} 
              className="bg-white border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl group"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 font-semibold px-3 py-1">
                    {c.objective}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {c.name}
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">{c.businessName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
                <div className="flex justify-between items-center text-sm mb-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">Budget: <span className="text-gray-900 font-bold">${c.budget}</span></span>
                  </div>
                  <span className="text-gray-600">Credits: <span className="text-purple-600 font-bold">{c.credits || 0}</span></span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/campaigns/${c._id.toString()}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 font-semibold transition-all duration-300">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Link href={`/campaigns/${c._id.toString()}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 font-semibold transition-all duration-300">
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