import { connectDB } from "@/lib/mongodb";
import Script from "@/models/Script";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Script.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Script not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error deleting script:", err);
    return Response.json({ error: "Failed to delete script" }, { status: 500 });
  }
}
