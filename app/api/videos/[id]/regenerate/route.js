import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import Video from "@/models/Video";
import { connectDB } from "@/lib/mongodb";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

async function generateFluxImage(
  prompt,
  { timeoutMs = 30000, retries = 2, width, height } = {}
) {
  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    throw new Error('POLLINATIONS_API_KEY not configured in environment variables');
  }

  const pollUrl = new URL(
    `/image/${encodeURIComponent(prompt)}`,
    'https://gen.pollinations.ai'
  );
  pollUrl.searchParams.set('model', 'flux');
  pollUrl.searchParams.set('seed', Math.floor(Math.random() * 1000000).toString());
  if (width && height) {
    pollUrl.searchParams.set('width', String(width));
    pollUrl.searchParams.set('height', String(height));
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const imageRes = await fetch(pollUrl.toString(), {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'image/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!imageRes.ok) {
        throw new Error(`Flux API error: ${imageRes.status} ${imageRes.statusText}`);
      }

      const arrayBuffer = await imageRes.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (lastError?.name === 'AbortError') {
    throw new Error('Flux generation timeout. Please try again.');
  }

  throw lastError || new Error('Flux image generation failed. Please try again.');
}

/* =========================================
   FFmpeg PATH FIX (WINDOWS + NEXT.JS SAFE)
========================================= */
let ffmpegPath = ffmpegStatic;

if (!ffmpegPath || ffmpegPath.includes('ROOT')) {
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

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const video = await Video.findById(id);
    if (!video) {
      return Response.json({ error: "Video not found" }, { status: 404 });
    }

    const prompt = video.prompt || "Generate a marketing video";

    let videoSize = '720x720';
    let imageWidth = 720;
    let imageHeight = 720;

    switch (video.resolution) {
      case 'portrait':
        videoSize = '720x1280';
        imageWidth = 720;
        imageHeight = 1280;
        break;
      case 'landscape':
        videoSize = '1280x720';
        imageWidth = 1280;
        imageHeight = 720;
        break;
      case 'banner':
        videoSize = '1080x360';
        imageWidth = 1080;
        imageHeight = 360;
        break;
      case 'square':
      default:
        videoSize = '720x720';
        imageWidth = 720;
        imageHeight = 720;
        break;
    }

    const imageBuffer = await generateFluxImage(prompt, {
      width: imageWidth,
      height: imageHeight
    });

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const imagePath = path.join(tmpDir, `img-${Date.now()}.jpg`);
    const videoPath = path.join(tmpDir, `vid-${Date.now()}.mp4`);

    fs.writeFileSync(imagePath, imageBuffer);

    await new Promise((resolve, reject) => {
      const ffmpegTimeout = setTimeout(() => {
        reject(new Error('FFmpeg processing timeout after 60 seconds'));
      }, 60000);

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
        .on('end', () => {
          clearTimeout(ffmpegTimeout);
          resolve();
        })
        .on('error', (err) => {
          clearTimeout(ffmpegTimeout);
          reject(err);
        });
    });

    const videoBuffer = fs.readFileSync(videoPath);
    const base64Video = videoBuffer.toString('base64');
    const newVideoUrl = `data:video/mp4;base64,${base64Video}`;

    fs.unlinkSync(imagePath);
    fs.unlinkSync(videoPath);

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { videoUrl: newVideoUrl, updatedAt: new Date() },
      { new: true }
    );

    return Response.json(updatedVideo);
  } catch (error) {
    console.error("Error regenerating video:", error);
    return Response.json(
      { error: "Failed to regenerate video" },
      { status: 500 }
    );
  }
}
