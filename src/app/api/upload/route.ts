import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convertir File a base64 (Cloudinary acepta Data URI)
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri);

    // Devuelve JSON con secure_url
    return NextResponse.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error("Error en /api/upload:", err);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
};





