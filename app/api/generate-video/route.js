import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Video from '@/models/Video';

import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

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

/* =========================================
   FFmpeg PATH FIX (WINDOWS + NEXT.JS SAFE)
========================================= */
let ffmpegPath = ffmpegStatic;

if (
  !ffmpegPath ||
  ffmpegPath.includes('ROOT')
) {
  const binary = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  ffmpegPath = path.join(
    process.cwd(),
    'node_modules',
    'ffmpeg-static',
    binary
  );
}

if (!fs.existsSync(ffmpegPath)) {
  throw new Error(`FFmpeg binary not found at ${ffmpegPath}`);
}

ffmpeg.setFfmpegPath(ffmpegPath);

/* ========================================= */

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

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.credits < 10) {
      return NextResponse.json(
        { error: 'Insufficient credits. Video costs 10 credits.' },
        { status: 400 }
      );
    }

    // Determine video size based on resolution
    let videoSize;
    switch (resolution) {
      case 'portrait':
        videoSize = '720x1280';
        break;
      case 'landscape':
        videoSize = '1280x720';
        break;
      case 'banner':
        videoSize = '1080x360';
        break;
      case 'square':
      default:
        videoSize = '720x720';
        break;
    }

    /* ================= PROMPT ================= */
    const promptParts = [
      `Advertisement for ${campaign.businessName}`,
      campaign.description || '',
      campaign.targetAudience ? `Target audience: ${campaign.targetAudience}` : '',
      campaign.tone ? `Tone: ${campaign.tone}` : '',
      prompt
    ];

    let enhancedPrompt = promptParts.filter(Boolean).join('. ');

    switch (style) {
      case 'professional':
        enhancedPrompt += ', professional corporate advertisement';
        break;
      case 'creative':
        enhancedPrompt += ', creative artistic advertisement';
        break;
      case 'minimalist':
        enhancedPrompt += ', minimalist clean design';
        break;
      case 'vibrant':
        enhancedPrompt += ', vibrant energetic visuals';
        break;
      case 'luxury':
        enhancedPrompt += ', luxury premium style';
        break;
    }

    switch (platform) {
      case 'instagram':
        enhancedPrompt += ', instagram reel style';
        break;
      case 'facebook':
        enhancedPrompt += ', facebook ad style';
        break;
      case 'twitter':
        enhancedPrompt += ', twitter ad style';
        break;
      case 'linkedin':
        enhancedPrompt += ', linkedin professional video';
        break;
      case 'tiktok':
        enhancedPrompt += ', tiktok viral style';
        break;
    }

    /* ================= IMAGE GENERATION ================= */
    const imageBuffer = await fetchPollinationsImage(enhancedPrompt, { timeoutMs: 20000, retries: 2 });

    /* ================= TEMP FILES ================= */
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const imagePath = path.join(tmpDir, `img-${Date.now()}.jpg`);
    const videoPath = path.join(tmpDir, `vid-${Date.now()}.mp4`);

    fs.writeFileSync(imagePath, imageBuffer);

    /* ================= IMAGE → VIDEO ================= */
    await new Promise((resolve, reject) => {
      ffmpeg(imagePath)
        .loop(6)
        .videoFilters([
          {
            filter: 'zoompan',
            options: {
              z: 'min(zoom+0.0015,1.15)',
              d: 180,
              x: 'iw/2-(iw/zoom/2)',
              y: 'ih/2-(ih/zoom/2)',
            },
          },
        ])
        .size(videoSize)
        .fps(30)
        .outputOptions([
          '-pix_fmt yuv420p',
          '-movflags +faststart',
        ])
        .save(videoPath)
        .on('end', resolve)
        .on('error', reject);
    });

    const videoBuffer = fs.readFileSync(videoPath);
    const base64Video = videoBuffer.toString('base64');
    const videoUrl = `data:video/mp4;base64,${base64Video}`;

    /* ================= CLEANUP ================= */
    fs.unlinkSync(imagePath);
    fs.unlinkSync(videoPath);

    /* ================= DB ================= */
    campaign.credits -= 10;
    await campaign.save();

    const newVideo = new Video({
      campaignId,
      prompt: enhancedPrompt,
      videoUrl,
      style,
      platform,
    });

    await newVideo.save();

    return NextResponse.json({
      _id: newVideo._id,
      campaignId,
      videoUrl,
      prompt: enhancedPrompt,
      style,
      platform,
      createdAt: newVideo.createdAt
    });

  } catch (error) {
    console.error('Video generation error:', error);
    const status = error?.message?.includes('Pollinations API') ? 502 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status }
    );
  }
}
