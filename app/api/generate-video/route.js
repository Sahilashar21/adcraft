import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Video from '@/models/Video';

import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Configure route for longer execution time (5 minutes for video processing)
export const maxDuration = 300;
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
    console.log('Starting image generation for video...');
    const imageBuffer = await fetchPollinationsImage(enhancedPrompt);

    /* ================= TEMP FILES ================= */
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const imagePath = path.join(tmpDir, `img-${Date.now()}.jpg`);
    const videoPath = path.join(tmpDir, `vid-${Date.now()}.mp4`);

    fs.writeFileSync(imagePath, imageBuffer);

    /* ================= IMAGE → VIDEO ================= */
    console.log('Starting FFmpeg video processing...');
    
    await new Promise((resolve, reject) => {
      const ffmpegTimeout = setTimeout(() => {
        reject(new Error('FFmpeg processing timeout after 60 seconds'));
      }, 60000); // 1 minute timeout for video processing

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
        .on('start', (cmd) => {
          console.log('FFmpeg command:', cmd);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Processing: ${Math.round(progress.percent)}% done`);
          }
        })
        .on('end', () => {
          clearTimeout(ffmpegTimeout);
          console.log('FFmpeg processing completed successfully');
          resolve();
        })
        .on('error', (err) => {
          clearTimeout(ffmpegTimeout);
          console.error('FFmpeg error:', err);
          reject(err);
        });
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
    
    // Clean up temp files if they exist
    try {
      const tmpDir = path.join(process.cwd(), 'tmp');
      if (fs.existsSync(tmpDir)) {
        const files = fs.readdirSync(tmpDir);
        files.forEach(file => {
          try {
            fs.unlinkSync(path.join(tmpDir, file));
          } catch (e) {
            // Ignore cleanup errors
          }
        });
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    // Determine appropriate status code
    let status = 500;
    let errorMessage = 'Failed to generate video';
    
    if (error?.message?.includes('Pollinations API')) {
      status = 502;
      errorMessage = 'Image API temporarily unavailable. Please try again in a moment.';
    } else if (error?.message?.includes('timeout')) {
      status = 504;
      errorMessage = 'Request timeout. Video generation is taking too long. Please try again.';
    } else if (error?.name === 'AbortError') {
      status = 504;
      errorMessage = 'Request timeout. Please try again with a simpler prompt.';
    } else if (error?.message?.includes('FFmpeg')) {
      status = 500;
      errorMessage = 'Video processing failed. Please try again or contact support.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
