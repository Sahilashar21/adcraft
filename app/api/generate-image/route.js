import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Image from '@/models/Image';

async function fetchPollinationsImage(prompt, { timeoutMs = 20000, retries = 2 } = {}) {
  const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const imageRes = await fetch(pollUrl, {
        signal: controller.signal,
        cache: 'no-store'
      });

      if (!imageRes.ok) {
        const errorText = await imageRes.text();
        throw new Error(`Pollinations API error: ${imageRes.status} ${imageRes.statusText} - ${errorText}`);
      }

      const arrayBuffer = await imageRes.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (lastError?.name === 'AbortError') {
    throw new Error('Pollinations API timeout. Please try again.');
  }

  throw lastError || new Error('Pollinations API error. Please try again.');
}

export async function POST(request) {
  try {
    await connectDB();

    const { campaignId, prompt, style, platform, resolution } = await request.json();

    if (!campaignId || !prompt) {
      return NextResponse.json(
        { error: 'Campaign ID and prompt are required' },
        { status: 400 }
      );
    }

    // Check if campaign exists and has enough credits
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.credits < 5) {
      return NextResponse.json(
        { error: 'Insufficient credits. Image generation costs 5 credits.' },
        { status: 400 }
      );
    }

    // Generate enhanced prompt including all campaign details
    const promptParts = [
      `Advertisement for ${campaign.businessName}`,
      campaign.businessType ? `Business Type: ${campaign.businessType}` : '',
      campaign.description ? `Description: ${campaign.description}` : '',
      campaign.targetAudience ? `Target Audience: ${campaign.targetAudience}` : '',
      campaign.tone ? `Tone: ${campaign.tone}` : '',
      `Objective: ${campaign.objective}`,
      prompt
    ];

    let enhancedPrompt = promptParts.filter(Boolean).join('. ');

    // Add style-specific enhancements
    switch (style) {
      case 'professional':
        enhancedPrompt += ', professional business advertisement, clean design, corporate style, high quality';
        break;
      case 'creative':
        enhancedPrompt += ', creative artistic advertisement, innovative design, eye-catching, modern art style';
        break;
      case 'minimalist':
        enhancedPrompt += ', minimalist design, clean white background, simple elegant, uncluttered';
        break;
      case 'vibrant':
        enhancedPrompt += ', vibrant colorful advertisement, bright colors, energetic, dynamic';
        break;
      case 'luxury':
        enhancedPrompt += ', luxury premium advertisement, elegant gold accents, sophisticated, high-end';
        break;
    }

    // Add platform-specific dimensions and considerations
    let dimensions = { width: 512, height: 512 }; // default square

    switch (resolution) {
      case 'square':
        dimensions = { width: 512, height: 512 };
        break;
      case 'portrait':
        dimensions = { width: 512, height: 768 };
        break;
      case 'landscape':
        dimensions = { width: 768, height: 512 };
        break;
      case 'banner':
        dimensions = { width: 1024, height: 256 };
        break;
    }

    // Add platform-specific text overlays or considerations
    switch (platform) {
      case 'instagram':
        enhancedPrompt += ', instagram post, social media advertisement, engaging visual';
        break;
      case 'facebook':
        enhancedPrompt += ', facebook advertisement, social media post, clickable design';
        break;
      case 'twitter':
        enhancedPrompt += ', twitter header image, concise visual message, social media';
        break;
      case 'linkedin':
        enhancedPrompt += ', linkedin professional post, business networking, corporate image';
        break;
      case 'tiktok':
        enhancedPrompt += ', tiktok video thumbnail, trendy design, viral potential, youth-oriented';
        break;
    }

    // Generate image using Pollinations.ai (Free API)
    // Using a random seed to ensure unique generations for the same prompt
    const seed = Math.floor(Math.random() * 1000000);
    const apiKey = process.env.POLLINATIONS_API_KEY;
    
    const buffer = await fetchPollinationsImage(enhancedPrompt, { timeoutMs: 20000, retries: 2 });
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // Deduct credits from campaign
    campaign.credits -= 5;
    await campaign.save();

    // Save image to database
    const newImage = new Image({
      campaignId,
      prompt: enhancedPrompt,
      style,
      platform,
      resolution,
      imageUrl
    });

    await newImage.save();

    return NextResponse.json({
      _id: newImage._id,
      campaignId: newImage.campaignId,
      prompt: newImage.prompt,
      style: newImage.style,
      platform: newImage.platform,
      resolution: newImage.resolution,
      imageUrl: newImage.imageUrl,
      createdAt: newImage.createdAt
    });

  } catch (error) {
    console.error('Image generation error:', error);
    const status = error?.message?.includes('Pollinations API') ? 502 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}