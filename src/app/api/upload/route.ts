
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "next_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Guardar en Supabase vía Prisma
    const acceso = await prisma.acceso.create({
      data: {
        nombre_apellido: "Usuario de prueba",
        url: uploadResult.secure_url,
      },
    });

    return NextResponse.json({
      message: "Archivo subido y guardado en Supabase",
      cloudinaryUrl: uploadResult.secure_url,
      acceso,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
