import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Caption from '@/models/Caption';
import Image from '@/models/Image';
import Video from '@/models/Video';
import Script from '@/models/Script'; // Import Script model

export async function GET(request, { params }) {
  const { campaignId } = params;

  if (!campaignId) {
    return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const captions = await Caption.find({ campaignId });
    const images = await Image.find({ campaignId });
    const videos = await Video.find({ campaignId });
    const scripts = await Script.find({ campaignId }); // Fetch scripts

    return NextResponse.json({
      captions,
      images,
      videos,
      scripts, // Include scripts in the response
    });
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
