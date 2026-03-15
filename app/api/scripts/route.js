import { connectDB } from "@/lib/mongodb";
import Script from "@/models/Script";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 0;

    const query = campaignId ? { campaignId } : {};

    const scripts = await Script.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limit) ? 0 : limit)
      .lean();

    return Response.json(scripts);
  } catch (err) {
    console.error("Error fetching scripts:", err);
    return Response.json({ error: "Failed to fetch scripts" }, { status: 500 });
  }
}
