// "use client";

// import { useState, useEffect } from "react";

// export default function HomePage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Crear URL de previsualización cuando cambie el archivo
//   useEffect(() => {
//     if (!file) {
//       setPreview(null);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);

//     return () => URL.revokeObjectURL(objectUrl);
//   }, [file]);

//   const handleSubmit = async () => {
//     if (!file) return;

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (data.url) setUrl(data.url);
//       else alert("Error al subir imagen");
//     } catch (err) {
//       alert("Error en la subida");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Subir Imagen JPEG a Cloudinary</h1>

//       <input
//         type="file"
//         accept="image/jpeg"
//         onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//         style={{ margin: "20px 0" }}
//       />

//       {/* Previsualización más pequeña */}
//       {preview && (
//         <div style={{ marginBottom: "20px" }}>
//           <p>Previsualización:</p>
//           <img
//             src={preview}
//             alt="preview"
//             style={{
//               maxWidth: "150px",
//               maxHeight: "150px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//       )}

//       {/* Botón solo aparece si hay un archivo cargado */}
//       {file && !url && (
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           style={{
//             backgroundColor: "green",
//             color: "white",
//             padding: "10px 20px",
//             border: "none",
//             cursor: "pointer",
//             opacity: loading ? 0.6 : 1,
//           }}
//         >
//           {loading ? "Subiendo..." : "Subir Imagen"}
//         </button>
//       )}

//       {url && (
//         <div style={{ marginTop: "20px" }}>
//           <p>URL asignada:</p>
//           <a href={url} target="_blank" rel="noopener noreferrer">
//             {url}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Crear URL de previsualización
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) setUrl(data.url);
      else alert("Error al subir imagen");
    } catch (err) {
      alert("Error en la subida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Subir Imagen o Sacar Foto</h1>

      {/* Input normal (seleccionar archivo desde galería/disco) */}
      <input
        type="file"
        accept="image/jpeg"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ margin: "10px" }}
      />

      {/* Input especial (abrir cámara en móviles) */}
      <input
        type="file"
        accept="image/jpeg"
        capture="environment"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ margin: "10px" }}
      />

      {/* Previsualización */}
      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <p>Previsualización:</p>
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: "150px",
              maxHeight: "150px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      )}

      {/* Botón solo aparece si hay un archivo válido */}
      {file && !url && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Subiendo..." : "Subir Imagen"}
        </button>
      )}

      {url && (
        <div style={{ marginTop: "20px" }}>
          <p>URL asignada:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}



