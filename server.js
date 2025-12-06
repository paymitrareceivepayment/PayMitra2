import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { photoBase64, recipient, payerPhone, amount, note, location } = body;

    if (!photoBase64)
      return Response.json({ error: "Missing photo" }, { status: 400 });

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${photoBase64}`
    );

    return Response.json({
      success: true,
      photoUrl: uploadResult.secure_url,
      data: {
        recipient,
        payerPhone,
        amount,
        note,
        location,
      },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
