import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Image from '@/models/Image';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const images = await Image.find({ campaignId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(images);

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}