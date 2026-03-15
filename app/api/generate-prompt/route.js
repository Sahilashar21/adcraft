import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

const MODEL = 'llama-3.1-8b-instant';

const toneDescriptions = {
  professional: 'professional, corporate, and authority-building',
  funny: 'humorous, casual, and entertaining',
  viral: 'attention-grabbing, trendy, and shareable',
  luxury: 'premium, exclusive, and high-end',
  friendly: 'warm, approachable, and community-focused'
};

function buildCampaignPromptRequest({ type, campaign, userPrompt, style, platform, resolution }) {
  const baseDetails = [
    `Business Name: ${campaign.businessName}`,
    campaign.businessType ? `Business Type: ${campaign.businessType}` : '',
    campaign.description ? `Description: ${campaign.description}` : '',
    campaign.targetAudience ? `Target Audience: ${campaign.targetAudience}` : '',
    campaign.objective ? `Objective: ${campaign.objective}` : '',
    campaign.tone ? `Tone: ${campaign.tone}` : '',
    style ? `Style: ${style}` : '',
    platform ? `Platform: ${platform}` : '',
    resolution ? `Resolution: ${resolution}` : '',
    userPrompt ? `User notes: ${userPrompt}` : ''
  ].filter(Boolean).join('\n');

  if (type === 'script') {
    return `Create a concise prompt for generating a video ad script.\n\n${baseDetails}\n\nRules:\n- Output only the prompt, no labels.\n- 1-2 sentences.\n- Clear, concrete, and specific.\n- Focus on the key message and call-to-action.`;
  }

  return `Create a concise prompt for generating an ad visual.\n\n${baseDetails}\n\nRules:\n- Output only the prompt, no labels.\n- 1-2 sentences.\n- Focus on visual composition, lighting, mood, and product context.\n- Do NOT include any text, words, typography, or watermarks in the image.`;
}

function buildGenericPromptRequest({ product, audience, platform, tone }) {
  const toneDescription = toneDescriptions[tone] || 'persuasive';
  return `You are an expert marketing copywriter. Generate a compelling marketing prompt for creating an ad on ${platform}.\n\nProduct/Service: ${product}\nTarget Audience: ${audience}\nTone: ${toneDescription}\n\nCreate a detailed prompt that an AI can use to generate marketing content (captions, images, or scripts) for this product on ${platform}. The prompt should be specific and actionable.\n\nRespond with just the prompt, nothing else.`;
}

async function callGroq(promptText) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.7
    })
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: 'Groq API failed', details: data, status: res.status };
  }

  const prompt = data?.choices?.[0]?.message?.content?.trim();
  if (!prompt) {
    return { error: 'Groq returned empty response', status: 500 };
  }

  return { prompt };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { campaignId, type, userPrompt, style, platform, resolution } = body;
    const { product, audience, tone } = body;

    if (campaignId) {
      if (!type) {
        return NextResponse.json({ error: 'type is required when using campaignId' }, { status: 400 });
      }

      await connectDB();
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const promptRequest = buildCampaignPromptRequest({
        type,
        campaign,
        userPrompt,
        style,
        platform,
        resolution
      });

      const result = await callGroq(promptRequest);
      if (result.error) {
        return NextResponse.json(
          { error: result.error, details: result.details },
          { status: result.status || 500 }
        );
      }

      return NextResponse.json({ prompt: result.prompt });
    }

    if (!product || !audience || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const promptRequest = buildGenericPromptRequest({ product, audience, platform, tone });
    const result = await callGroq(promptRequest);
    if (result.error) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prompt: result.prompt,
      metadata: { product, audience, platform, tone }
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
