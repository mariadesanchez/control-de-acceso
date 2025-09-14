"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Abrir cámara frontal automáticamente
  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // frontal
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("No se pudo acceder a la cámara:", err);
      }
    };
    openCamera();
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const scale = 0.3; // reducir tamaño de la foto al 30%

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        setUploading(true);
        setUploadedUrl(null);
        setSuccess(false);

        try {
          const formData = new FormData();
          formData.append("file", blob, "foto.jpg");

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
      },
      "image/jpeg"
    );
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f3f3",
        padding: "16px",
        position: "relative",
      }}
    >
      {/* Logo encima de todo */}
      <img
        src="/logoCelulosaLaPlata.png"
        alt="Logo Celulosa La Plata"
        style={{
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "auto",
          zIndex: 999,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Video pequeño */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "240px",
            height: "320px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            objectFit: "cover",
            border: "2px solid #34D399", // verde
          }}
        />

        {/* Botón Foto */}
        <button
          onClick={handleCapture}
          disabled={uploading}
          style={{
            marginTop: "8px",
            width: "60px",
            height: "60px",
            backgroundColor: "#10B981", // verde
            color: "white",
            fontWeight: "bold",
            padding: "10px 0",
            borderRadius: "100px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            fontSize: "16px",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {uploading ? "Subiendo..." : " "}
        </button>

        {/* URL de Cloudinary */}
        {success && uploadedUrl && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#3B82F6", // azul
              textDecoration: "underline",
              wordBreak: "break-all",
              marginTop: "8px",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {uploadedUrl}
          </a>
        )}
      </div>
    </main>
  );
}
