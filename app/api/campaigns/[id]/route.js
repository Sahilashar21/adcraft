import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(req, { params }) {
  await connectDB();
  const campaign = await Campaign.findById(params.id);
  if (!campaign) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(campaign);
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updated = await Campaign.findByIdAndUpdate(params.id, body, { new: true });
  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Campaign.findByIdAndDelete(params.id);
  return Response.json({ message: "Deleted" });
}
