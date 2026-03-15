import { GoogleGenerativeAI } from "@google/generative-ai";
import Caption from "@/models/Caption";
import { connectDB } from "@/lib/mongodb";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const caption = await Caption.findById(id);
    if (!caption) {
      return Response.json({ error: "Caption not found" }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(caption.prompt || "Generate a marketing caption");
    const newText = result.response.text();

    const updatedCaption = await Caption.findByIdAndUpdate(
      id,
      { text: newText, updatedAt: new Date() },
      { new: true }
    );

    return Response.json(updatedCaption);
  } catch (error) {
    console.error("Error regenerating caption:", error);
    return Response.json(
      { error: "Failed to regenerate caption" },
      { status: 500 }
    );
  }
}
