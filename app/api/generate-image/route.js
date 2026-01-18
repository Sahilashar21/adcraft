import Replicate from 'replicate';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Image from '@/models/Image';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    // Generate enhanced prompt based on style and platform
    let enhancedPrompt = prompt;

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

    // Generate image using Stable Diffusion via Replicate
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: enhancedPrompt,
          negative_prompt: "blurry, low quality, distorted, ugly, poorly drawn, cartoon, anime, text, watermark, signature",
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          scheduler: "K_EULER"
        }
      }
    );

    // The output should be an array with the image URL
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}