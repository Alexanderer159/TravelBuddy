import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";
import auth from "../middleware/auth.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router  = Router();
const upload  = multer({ storage: multer.memoryStorage() });

const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "travelbuddy" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    Readable.from(buffer).pipe(stream);
  });

// POST /api/upload  (protected)
router.post("/", auth, upload.array("images", 20), async (req, res) => {
  try {
    const results = await Promise.all(req.files.map((f) => streamUpload(f.buffer)));
    res.json({ urls: results.map((r) => r.secure_url) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;