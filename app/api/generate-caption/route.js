import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Caption from "@/models/Caption";

export async function POST(req) {
  try {
    const { campaignId } = await req.json();

    if (!campaignId) {
      return Response.json({ error: "Campaign ID missing" }, { status: 400 });
    }

    await connectDB();

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.credits < 5) {
      return Response.json({ error: "Insufficient credits" }, { status: 400 });
    }

    const prompt = `
Generate ONE short, catchy marketing caption.

Business Name: ${campaign.businessName}
Business Type: ${campaign.businessType}
Target Audience: ${campaign.targetAudience}
Objective: ${campaign.objective}
Tone: ${campaign.tone}

Rules:
- Max 20 words
- No emojis
- No hashtags
`;

    // 🔥 Groq API call
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API error:", data);
      return Response.json(
        { error: "Groq API failed", details: data },
        { status: res.status }
      );
    }

    const captionText =
      data?.choices?.[0]?.message?.content?.trim();

    if (!captionText) {
      return Response.json(
        { error: "Groq returned empty response" },
        { status: 500 }
      );
    }

    // ✅ Deduct credits ONLY on success
    campaign.credits -= 5;
    await campaign.save();

    const saved = await Caption.create({
      campaignId,
      text: captionText,
      creditsUsed: 5,
      source: "groq",
    });

    return Response.json(
      {
        text: saved.text,
        source: "groq",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Groq crash:", err);
    return Response.json(
      { error: "Caption generation failed" },
      { status: 500 }
    );
  }
}
