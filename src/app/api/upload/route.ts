
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import prisma from "@/lib/prismaClient";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;
//     const nombre_apellido = formData.get("nombre_apellido") as string; // obligatorio

//     if (!file || !nombre_apellido) {
//       return NextResponse.json(
//         { error: "Falta archivo o nombre_apellido" },
//         { status: 400 }
//       );
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const uploadResult = await new Promise<any>((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "next_uploads" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       stream.end(buffer);
//     });

//     const acceso = await prisma.acceso.create({
//       data: {
//         url: uploadResult.secure_url,
//         nombre_apellido,
//         // fecha_hora_ingreso y activo se llenan por default
//       },
//     });

//     return NextResponse.json({
//       message: "Archivo subido y guardado en Supabase",
//       cloudinaryUrl: uploadResult.secure_url,
//       acceso,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

// (Opcional) si quieres forzar el runtime node:
// export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const nombre_apellido = (formData.get("nombre_apellido") as string) || "Usuario de prueba";

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // --- convertir Blob a base64 Data URI (compatible con uploader.upload)
    const blob = file as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // obtener mime type si existe
    const mime = (blob as any).type || "application/octet-stream";
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mime};base64,${base64}`;

    // Subida a Cloudinary (usamos .upload con dataUri)
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "next_uploads",
      // puedes añadir transformation, public_id, etc.
    });

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Cloudinary no devolvió secure_url");
    }

    // Guardar en Supabase vía Prisma
    const acceso = await prisma.acceso.create({
      data: {
        nombre_apellido,
        url: uploadResult.secure_url,
      },
    });

    // Serializamos fechas para JSON
    const accesoSerialized = {
      ...acceso,
      fecha_hora_ingreso: acceso.fecha_hora_ingreso?.toISOString?.() ?? null,
      fecha_hora_egreso: acceso.fecha_hora_egreso ? acceso.fecha_hora_egreso.toISOString() : null,
    };

    return NextResponse.json({
      success: true,
      message: "Archivo subido y guardado en Supabase",
      cloudinaryUrl: uploadResult.secure_url,
      acceso: accesoSerialized,
    });
  } catch (err: unknown) {
    console.error("API /api/upload ERROR:", err);
    const message = err instanceof Error ? err.message : "Error desconocido al subir archivo";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

