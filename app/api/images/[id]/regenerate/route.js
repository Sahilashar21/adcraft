import Image from "@/models/Image";
import { connectDB } from "@/lib/mongodb";

export const maxDuration = 60;
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

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const image = await Image.findById(id);
    if (!image) {
      return Response.json({ error: "Image not found" }, { status: 404 });
    }

    const prompt = image.prompt || "Generate a marketing image";

    let dimensions = { width: 512, height: 512 };
    switch (image.resolution) {
      case 'portrait':
        dimensions = { width: 512, height: 768 };
        break;
      case 'landscape':
        dimensions = { width: 768, height: 512 };
        break;
      case 'banner':
        dimensions = { width: 1024, height: 256 };
        break;
      case 'square':
      default:
        dimensions = { width: 512, height: 512 };
        break;
    }

    const buffer = await generateFluxImage(prompt, {
      width: dimensions.width,
      height: dimensions.height
    });
    const base64Image = buffer.toString('base64');
    const newImageUrl = `data:image/jpeg;base64,${base64Image}`;

    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { imageUrl: newImageUrl, updatedAt: new Date() },
      { new: true }
    );

    return Response.json(updatedImage);
  } catch (error) {
    console.error("Error regenerating image:", error);
    return Response.json(
      { error: "Failed to regenerate image" },
      { status: 500 }
    );
  }
}
