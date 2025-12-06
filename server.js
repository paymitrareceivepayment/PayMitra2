import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

export default async function handler(req, res) {
  try {
    const { photoBase64, recipient, payerPhone, amount, note, location } = req.body;

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${photoBase64}`
    );

    return res.json({
      success: true,
      url: uploadResult.secure_url,
      metadata: {
        recipient,
        payerPhone,
        amount,
        note,
        location
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}
