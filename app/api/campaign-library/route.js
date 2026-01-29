import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Caption from '@/models/Caption';
import Image from '@/models/Image';
import Video from '@/models/Video';
import Script from '@/models/Script';
import Campaign from '@/models/Campaign';

export async function GET() {
  try {
    await connectDB();

    // Fetch all assets and campaigns in parallel
    const [captions, images, videos, scripts, campaigns] = await Promise.all([
      Caption.find({}).sort({ createdAt: -1 }).lean(),
      Image.find({}).sort({ createdAt: -1 }).lean(),
      Video.find({}).sort({ createdAt: -1 }).lean(),
      Script.find({}).sort({ createdAt: -1 }).lean(),
      Campaign.find({}, 'name').lean()
    ]);

    // Create a map of campaignId -> campaignName for quick lookup
    const campaignMap = campaigns.reduce((acc, camp) => {
      acc[camp._id.toString()] = camp.name;
      return acc;
    }, {});

    return NextResponse.json({
      captions,
      images,
      videos,
      scripts,
      campaignMap
    });
  } catch (error) {
    console.error('Error fetching library data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { id, type } = await request.json();

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    let deletedItem;
    switch (type) {
      case 'image':
        deletedItem = await Image.findByIdAndDelete(id);
        break;
      case 'video':
        deletedItem = await Video.findByIdAndDelete(id);
        break;
      case 'caption':
        deletedItem = await Caption.findByIdAndDelete(id);
        break;
      case 'script':
        deletedItem = await Script.findByIdAndDelete(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}