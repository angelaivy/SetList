import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    showDetails: { 
      artist: { type: String, required: true },
      venue: { type: String },
      // Future proof: populate the date when I can get it 
      // from the TM API for filtering later, but use dateRaw
      // for manual user entry when the user may not have an exact date.
      date: { type: Date },
      dateRaw: { type: String }
    },
    notes: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    status: { type: String, enum: ["Wishlist", "Attended"], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketmasterId: { type: String }
  }
);
// Sparse true allows multiple null entries for ticketmasterId; 
// We only want unique when the entry comes from ticketmaster itself.
showSchema.index({ ticketmasterId: 1 }, { unique: true, sparse: true })

export default mongoose.model('Show', showSchema);
