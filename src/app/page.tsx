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
        backgroundColor: "#F3F4F6", // gris claro
        padding: "16px",
        position: "relative",
      }}
    >
      {/* Logo */}
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
          marginTop: "50px",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "280px",
            height: "360px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            objectFit: "cover",
            border: "2px solid #4CAF50",
          }}
        />

        {/* Botón Foto */}
        <button
          onClick={handleCapture}
          disabled={uploading}
          style={{
            marginTop: "4px",
            width: "60px",
            height: "60px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontWeight: "bold",
            borderRadius: "100px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            fontSize: "16px",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {uploading ? "..." : " "}
        </button>

        {/* Mensaje de éxito con URL */}
        {success && uploadedUrl && (
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            {/* ✅ y texto en la misma línea */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#22c55e",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              ✅ ¡Guardado Exitoso!
            </div>

            {/* URL */}
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: "6px",
                color: "#2563EB", // azul
                textDecoration: "underline",
                fontSize: "14px",
                wordBreak: "break-all",
              }}
            >
              {uploadedUrl}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}


