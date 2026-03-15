import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    const { product, audience, platform, tone } = await req.json();

    if (!product || !audience || !platform) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const toneDescriptions = {
      professional: "professional, corporate, and authority-building",
      funny: "humorous, casual, and entertaining",
      viral: "attention-grabbing, trendy, and shareable",
      luxury: "premium, exclusive, and high-end",
      friendly: "warm, approachable, and community-focused"
    };

    const toneDescription = toneDescriptions[tone] || "persuasive";

    const prompt = `You are an expert marketing copywriter. Generate a compelling marketing prompt for creating an ad on ${platform}.

Product/Service: ${product}
Target Audience: ${audience}
Tone: ${toneDescription}

Create a detailed prompt that an AI can use to generate marketing content (captions, images, or scripts) for this product on ${platform}. The prompt should be specific, actionable, and focused on the tone requested.

Respond with just the prompt, nothing else.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const generatedPrompt = result.response.text();

    return Response.json({
      success: true,
      prompt: generatedPrompt,
      metadata: {
        product,
        audience,
        platform,
        tone
      }
    });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return Response.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
