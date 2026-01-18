import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  style: {
    type: String,
    enum: ['professional', 'creative', 'minimalist', 'vibrant', 'luxury'],
    default: 'professional'
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'],
    default: 'instagram'
  },
  resolution: {
    type: String,
    enum: ['square', 'portrait', 'landscape', 'banner'],
    default: 'square'
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);