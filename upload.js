import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage for 2 uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "paymitra_uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// DISABLE default body parser (REQUIRED)
export const config = {
  api: {
    bodyParser: false,
  },
};

// MAIN API FUNCTION
export default function handler(req, res) {
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "qr", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const photoUrl = req.files?.photo?.[0]?.path || null;
    const qrUrl = req.files?.qr?.[0]?.path || null;

    const {
      payerPhone,
      receiver,
      amount,
      note,
      latitude,
      longitude,
    } = req.body;

    return res.json({
      success: true,
      photoUrl,
      qrUrl,
      payerPhone,
      receiver,
      amount,
      note,
      location: { latitude, longitude },
    });
  });
}
