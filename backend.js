import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage for 2 files (photo + qr)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "paymitra_uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ⬇️ MULTIPLE FILES + TEXT DATA
app.post(
  "/upload",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "qr", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const photoUrl = req.files.photo?.[0]?.path || null;
      const qrUrl = req.files.qr?.[0]?.path || null;

      const { payerPhone, receiver, amount, note, latitude, longitude } =
        req.body;

      return res.json({
        success: true,
        photoUrl,
        qrUrl,
        data: {
          payerPhone,
          receiver,
          amount,
          note,
          location: { latitude, longitude },
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

const PORT = 5000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
