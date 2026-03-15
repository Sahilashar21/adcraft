import { GoogleGenerativeAI } from "@google/generative-ai";
import Script from "@/models/Script";
import { connectDB } from "@/lib/mongodb";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const script = await Script.findById(id);
    if (!script) {
      return Response.json({ error: "Script not found" }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(script.text || "Generate a marketing script");
    const newContent = result.response.text();

    const updatedScript = await Script.findByIdAndUpdate(
      id,
      { text: newContent, updatedAt: new Date() },
      { new: true }
    );

    return Response.json(updatedScript);
  } catch (error) {
    console.error("Error regenerating script:", error);
    return Response.json(
      { error: "Failed to regenerate script" },
      { status: 500 }
    );
  }
}
