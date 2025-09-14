
// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [uploading, setUploading] = useState(false);
//   const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   // Abrir la cámara al cargar la página
//   useEffect(() => {
//     const openCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "environment" },
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("No se pudo acceder a la cámara:", err);
//       }
//     };
//     openCamera();
//   }, []);

//   const handleCapture = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     // Ajustar canvas al tamaño del video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Dibujar el frame actual del video en el canvas
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convertir la imagen a Blob
//     canvas.toBlob(async (blob) => {
//       if (!blob) return;

//       setUploading(true);
//       setUploadedUrl(null);
//       setSuccess(false);

//       try {
//         const formData = new FormData();
//         formData.append("file", blob, "foto.jpg");

//         const res = await fetch("/api/upload", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await res.json();
//         if (data.secure_url) {
//           setUploadedUrl(data.secure_url);
//           setSuccess(true);
//         }
//       } catch (err) {
//         console.error("Error al subir:", err);
//         setSuccess(false);
//       } finally {
//         setUploading(false);
//       }
//     }, "image/jpeg");
//   };

//   return (
//     <main className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
//       {/* Video en pantalla */}
//       <div className="flex flex-col items-center w-full max-w-xs mt-6">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="w-full rounded-xl shadow-md"
//         />
//         <canvas ref={canvasRef} className="hidden" />
//       </div>

//       {/* Botón Enviar */}
//       <div className="w-full max-w-xs mt-auto mb-6 flex flex-col items-center gap-2">
//         <button
//           onClick={handleCapture}
//           disabled={uploading}
//           className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50 text-lg"
//         >
//           {uploading ? "Subiendo..." : "Tomar foto y enviar"}
//         </button>

//         {/* URL de Cloudinary */}
//         {success && uploadedUrl && (
//           <a
//             href={uploadedUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline break-all text-sm mt-2 text-center"
//           >
//             {uploadedUrl}
//           </a>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Abrir la cámara automáticamente
  useEffect(() => {
    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
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
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
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
    }, "image/jpeg");
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
      {/* Contenedor del video y botón */}
      <div className="flex flex-col items-center w-full max-w-xs mt-6">
        {/* Video en vivo */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-xl shadow-lg"
        />
 <p>Presiona Enviar...</p>
<button
  onClick={handleCapture}
  disabled={uploading}
  className="mt-6 w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-2xl transition transform hover:scale-105 active:scale-95 disabled:opacity-50 text-lg"
>
  {uploading ? "Subiendo..." : "Enviar"}
 
</button>



        {/* URL de Cloudinary */}
        {success && uploadedUrl && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all text-sm mt-3 text-center"
          >
            {uploadedUrl}
          </a>
        )}
      </div>
    </main>
  );
}




