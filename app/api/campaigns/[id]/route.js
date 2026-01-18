// app/api/campaigns/[id]/route.js
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Caption from "@/models/Caption";

/**
 * Helper to produce JSON Responses consistently
 */
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function GET(req, context) {
  try {
    // context.params may be a Promise — await it
    const params = await (context?.params ?? {});
    const { id } = params;

    if (!id) return json({ error: "Missing id param" }, 400);

    await connectDB();
    const campaign = await Campaign.findById(id).lean();

    if (!campaign) return json({ error: "Not found" }, 404);

    return json(campaign, 200);
  } catch (err) {
    console.error("GET /api/campaigns/[id] error:", err);
    return json({ error: "Internal server error" }, 500);
  }
}

export async function PUT(req, context) {
  try {
    const params = await (context?.params ?? {});
    const { id } = params;

    if (!id) return json({ error: "Missing id param" }, 400);

    const body = await req.json();

    await connectDB();
    const updated = await Campaign.findByIdAndUpdate(id, body, { new: true });

    if (!updated) return json({ error: "Not found" }, 404);

    // Convert Mongoose document -> plain JSON before returning
    return json(JSON.parse(JSON.stringify(updated)), 200);
  } catch (err) {
    console.error("PUT /api/campaigns/[id] error:", err);
    return json({ error: "Internal server error" }, 500);
  }
}

export async function DELETE(req, context) {
  try {
    const params = await (context?.params ?? {});
    const { id } = params;

    if (!id) return json({ error: "Missing id param" }, 400);

    await connectDB();
    
    // Delete associated captions first
    await Caption.deleteMany({ campaignId: id });
    
    // Then delete the campaign
    const deleted = await Campaign.findByIdAndDelete(id);

    if (!deleted) return json({ error: "Not found" }, 404);

    return json({ message: "Deleted" }, 200);
  } catch (err) {
    console.error("DELETE /api/campaigns/[id] error:", err);
    return json({ error: "Internal server error" }, 500);
  }
}



// import { connectDB } from "@/lib/mongodb";
// import Campaign from "@/models/Campaign";

// export async function GET(req, { params }) {
//   await connectDB();
//   const campaign = await Campaign.findById(params.id).lean();
//   if (!campaign) return Response.json({ error: "Not found" }, { status: 404 });
//   return Response.json(campaign);
// }

// export async function PUT(req, { params }) {
//   await connectDB();
//   const body = await req.json();
//   const updated = await Campaign.findByIdAndUpdate(params.id, body, { new: true });
//   // Convert Mongoose doc → plain JSON
// return Response.json(JSON.parse(JSON.stringify(updated)));
//   //return Response.json(updated);
// }

// export async function DELETE(req, { params }) {
//   await connectDB();
//   await Campaign.findByIdAndDelete(params.id);
//   return Response.json({ message: "Deleted" });
// }
