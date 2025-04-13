/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import axios from "axios";

export default function UploadControls({ session, setRefreshTrigger }: any) {
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    // Busca una imagen en los datos del portapapeles
    const file = Array.from(items).find(item => item.type.startsWith("image/"));
    if (file) {
      const blob = file.getAsFile();
      if (blob) {
        // Obtén el tipo MIME de la imagen
        const mimeType = blob.type; // ejemplo: "image/png", "image/jpeg"
        
        // Determina la extensión basada en el tipo MIME
        let extension = "";
        if (mimeType === "image/png") extension = ".png";
        else if (mimeType === "image/jpeg") extension = ".jpg";
        else if (mimeType === "image/gif") extension = ".gif";

        // Si no se puede determinar la extensión, asigna ".png" por defecto
        if (!extension) extension = ".png";
        

        // Agrega el archivo al FormData con la extensión correcta
        const formData = new FormData();
        formData.append("files", blob);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/images/upload/${session.albumId}?access_key=${session.masterKey}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setRefreshTrigger((prev: number) => prev + 1); // Actualiza el trigger
      }
    }
  };

  useEffect(() => {
    // Agrega el listener al evento paste cuando el componente se monta
    document.addEventListener("paste", handlePaste);

    // Elimina el listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [session.albumId, session.masterKey]);

  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        className="px-4 py-2 font-pixelcute bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={() => {
          navigator.clipboard.writeText(session.masterKey || "").then(() => {
            alert("Clave copiada al portapapeles");
          });
        }}
      >
        Copiar clave del álbum
      </button>

      <button
        className="px-4 py-2 font-pixelcute bg-indigo-500 text-white rounded hover:bg-indigo-600"
        onClick={() => document.getElementById("uploadInput")?.click()}
      >
        Upload Photos
      </button>

      <input
        id="uploadInput"
        type="file"
        hidden
        multiple
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;

          const formData = new FormData();
          for (const file of files) {
            formData.append("files", file);
          }

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/images/upload/${session.albumId}?access_key=${session.masterKey}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          setRefreshTrigger((prev: number) => prev + 1); // Actualiza el trigger
        }}
      />
    </div>
  );
}
