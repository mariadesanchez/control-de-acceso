"use client";

import { useState, ChangeEvent } from "react";
import { Camera } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setUploadedUrl(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error al subir:", err);
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
      {/* Contenedor principal */}
      <div className="flex flex-col items-center gap-8 w-full max-w-xs mt-10">

        {/* Ícono de cámara grande y centrado */}
        <label className="cursor-pointer">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 shadow-lg transition">
            <Camera className="w-14 h-14 text-green-100" />
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCapture}
          />
        </label>

        {/* Mensaje archivo seleccionado */}
        {file && (
          <p className="text-sm text-gray-700 text-center">Archivo listo para enviar</p>
        )}

      </div>

      {/* Botón Enviar grande, verde y centrado al final */}
      <div className="w-full max-w-xs mt-auto mb-6 flex flex-col items-center gap-2">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50 text-lg"
        >
          {uploading ? "Subiendo..." : "Enviar"}
        </button>

        {/* Mostrar URL de Cloudinary */}
        {success && uploadedUrl && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all text-sm mt-2 text-center"
          >
            {uploadedUrl}
          </a>
        )}
      </div>
    </main>
  );
}



