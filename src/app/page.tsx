"use client";

import { useState, ChangeEvent } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
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
      setFile(null); // limpiar archivo después de enviar
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 w-full max-w-xs">

        {/* Botón de cámara pequeño */}
        <label className="relative">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 cursor-pointer shadow-md transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h3l2-3h8l2 3h3a2 2 0 012 2v10a2 
                   2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 
                   012-2zm9 3a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCapture}
          />
        </label>

        {/* Botón Subir Imagen, aparece solo si hay archivo */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50 text-sm"
          >
            {uploading ? "Subiendo..." : "Enviar"}
          </button>
        )}

        {/* Mensaje de envío exitoso */}
        {success && uploadedUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-700 font-semibold">¡Envío exitoso ✅</p>
            <a
              href={uploadedUrl}
              target="_blank"
              className="text-blue-600 hover:underline break-all text-xs"
            >
              {uploadedUrl}
            </a>
          </div>
        )}

      </div>
    </main>
  );
}

