import { NextResponse } from "next/server";
import cloudinary from "@/helper/cloudinary";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { message: "Image required" },
        { status: 400 }
      );
    }

    const upload = await cloudinary.uploader.upload(image, {
      folder: "linkedin/posts",
    });

    return NextResponse.json({
      imageUrl: upload.secure_url,
      sucess : true
    });
  } catch (err) {
    console.error("UPLOAD ERROR 👉", err);
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}
