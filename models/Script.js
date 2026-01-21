import mongoose from 'mongoose';

const ScriptSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Script || mongoose.model('Script', ScriptSchema);
