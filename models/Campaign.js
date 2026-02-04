import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default_user" },

    name: { type: String, required: true },
    businessName: { type: String, required: true },
    businessType: String,
    description: String,
    objective: String,
    budget: Number,
    credits: Number,
    targetAudience: String,
    tone: String,
    
    // Payment fields
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    stripePaymentIntentId: String,
    stripeSessionId: String,
    paidAmount: Number,
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", CampaignSchema);
