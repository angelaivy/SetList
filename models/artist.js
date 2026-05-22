import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genre: { type: String },
    notes: { type: String },
    favorite: { type: Boolean },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

artistSchema.index({ userId: 1 });
artistSchema.index({ name: 'text', genre: 'text' });

export default mongoose.model('Artist', artistSchema);
