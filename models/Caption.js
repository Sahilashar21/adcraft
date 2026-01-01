import mongoose from "mongoose";

const CaptionSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  text: String,
  creditsUsed: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Caption ||
  mongoose.model("Caption", CaptionSchema);
