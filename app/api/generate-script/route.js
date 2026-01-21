import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Script from '@/models/Script';

export async function POST(request) {
  const { prompt, campaignId } = await request.json();

  if (!prompt || !campaignId) {
    return NextResponse.json({ error: 'Prompt and campaignId are required' }, { status: 400 });
  }

  await dbConnect();

  try {
    // TODO: Replace this with a real call to the Pollinations.ai API
    const generatedScriptText = `This is a mock script generated for the prompt: "${prompt}"`;

    const newScript = new Script({
      text: generatedScriptText,
      campaignId,
    });

    await newScript.save();

    return NextResponse.json({ script: generatedScriptText });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
