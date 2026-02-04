import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Image from '@/models/Image';

// Configure route for longer execution time (60 seconds)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function fetchPollinationsImage(prompt, { timeoutMs = 30000, retries = 2 } = {}) {
  const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(`Pollinations API attempt ${attempt + 1}/${retries + 1}...`);
      
      const imageRes = await fetch(pollUrl, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!imageRes.ok) {
        const errorText = await imageRes.text().catch(() => 'No error details');
        throw new Error(`Pollinations API error: ${imageRes.status} ${imageRes.statusText}`);
      }

      const arrayBuffer = await imageRes.arrayBuffer();
      console.log(`✓ Successfully fetched image (${arrayBuffer.byteLength} bytes)`);
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < retries) {
        const delay = 1000 * (attempt + 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
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

    // Generate image using Pollinations.ai
    console.log('Starting image generation for campaign:', campaignId);
    const buffer = await fetchPollinationsImage(enhancedPrompt);
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
    
    // Determine appropriate status code
    let status = 500;
    let errorMessage = 'Internal server error';
    
    if (error?.message?.includes('Pollinations API')) {
      status = 502;
      errorMessage = 'Image API temporarily unavailable. Please try again in a moment.';
    } else if (error?.message?.includes('timeout')) {
      status = 504;
      errorMessage = 'Request timeout. The image is taking too long to generate. Please try again.';
    } else if (error?.name === 'AbortError') {
      status = 504;
      errorMessage = 'Request timeout. Please try again with a simpler prompt.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}