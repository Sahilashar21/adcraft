import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = {
    pollinations: { status: 'unknown', latency: null },
    huggingface: { status: 'unknown', latency: null },
  };

  // Check Pollinations
  try {
    const start = Date.now();
    const response = await fetch('https://image.pollinations.ai/prompt/test', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    services.pollinations = {
      status: response.ok ? 'operational' : 'degraded',
      latency: Date.now() - start,
      statusCode: response.status
    };
  } catch (error) {
    services.pollinations = {
      status: 'down',
      error: error.message
    };
  }

  // Check Hugging Face
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (HF_API_TOKEN) {
    try {
      const start = Date.now();
      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
        {
          method: 'HEAD',
          headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
          signal: AbortSignal.timeout(5000),
        }
      );
      services.huggingface = {
        status: response.ok || response.status === 503 ? 'operational' : 'degraded',
        latency: Date.now() - start,
        statusCode: response.status
      };
    } catch (error) {
      services.huggingface = {
        status: 'down',
        error: error.message
      };
    }
  } else {
    services.huggingface = { status: 'not_configured' };
  }

  // Determine overall status
  const hasOperationalService = 
    services.pollinations.status === 'operational' || 
    services.huggingface.status === 'operational';

  return NextResponse.json({
    overall: hasOperationalService ? 'operational' : 'degraded',
    services,
    timestamp: new Date().toISOString()
  });
}
