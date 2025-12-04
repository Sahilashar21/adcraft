import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      businessName,
      businessType,
      description,
      objective,
      budget,
      targetAudience,
      tone,
    } = body;

    if (!name || !businessName || !budget) {
      return Response.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.create({
      name,
      businessName,
      businessType,
      description,
      objective,
      budget,
      targetAudience,
      tone,
      userId: "default_user",
    });

    return Response.json(
      { message: "Campaign created", campaign },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  const campaigns = await Campaign.find({
    userId: "default_user",
  }).sort({ createdAt: -1 });

  return Response.json({ campaigns });
}
