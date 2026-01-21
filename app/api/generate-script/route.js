import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Script from '@/models/Script';
import Campaign from '@/models/Campaign'; // Added Campaign import

export async function POST(request) {
  try { // Added try-catch block
    const { prompt, campaignId } = await request.json();

    if (!prompt || !campaignId) {
      return NextResponse.json({ error: 'Prompt and campaignId are required' }, { status: 400 });
    }

    await connectDB();

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.credits < 10) { // Assuming 10 credits for script generation
      return NextResponse.json({ error: 'Insufficient credits. Script generation costs 10 credits.' }, { status: 400 });
    }

    const groqPrompt = `
Generate a short marketing script for a video advertisement.

Business Name: ${campaign.businessName}
Business Type: ${campaign.businessType || 'general'}
Target Audience: ${campaign.targetAudience || 'everyone'}
Objective: ${campaign.objective || 'brand awareness'}
Tone: ${campaign.tone || 'neutral'}
User Prompt: ${prompt}

Rules:
- Generate a script for a video advertisement, including visual descriptions and dialogue.
- The script should be engaging and concise.
- Focus on the key message from the user prompt.
- Keep the script under 150 words.
- Format the script clearly with scene descriptions and dialogue.
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
            content: groqPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { error: "Groq API failed", details: data },
        { status: res.status }
      );
    }

    const generatedScriptText = data?.choices?.[0]?.message?.content?.trim();

    if (!generatedScriptText) {
      return NextResponse.json(
        { error: "Groq returned empty response" },
        { status: 500 }
      );
    }

    // ✅ Deduct credits ONLY on success
    campaign.credits -= 10;
    await campaign.save();

    const newScript = new Script({
      text: generatedScriptText,
      campaignId,
      creditsUsed: 10,
      source: "groq", // Add source
    });

    await newScript.save();

    return NextResponse.json({
      script: generatedScriptText,
      _id: newScript._id,
      campaignId: newScript.campaignId,
      createdAt: newScript.createdAt,
      creditsUsed: newScript.creditsUsed,
      source: newScript.source,
    });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
