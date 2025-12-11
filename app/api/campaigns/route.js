import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const campaign = await Campaign.create({
    ...body,
    userId: "default_user",
  });
  // Convert Mongoose doc → plain JSON
return Response.json(JSON.parse(JSON.stringify(campaign)), { status: 201 });

  // return Response.json(campaign, { status: 201 });
}

export async function GET() {
  await connectDB();
  const campaigns = await Campaign.find({ userId: "default_user" }).lean();
  return Response.json(campaigns);
}
