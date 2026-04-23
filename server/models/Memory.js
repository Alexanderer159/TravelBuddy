import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    place:  { type: String, required: true },
    date:   { type: Date,   required: true },
    images: [{ type: String }], // Cloudinary secure_urls
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);