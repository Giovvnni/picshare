/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [view, setView] = useState<"home" | "create" | "access">("home");
  const [albumName, setAlbumName] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [albumNameDisplay, setAlbumNameDisplay] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [session, setSession] = useState<{
    albumId: string | null;
    masterKey: string | null;
    readonlyKey: string | null;
  }>({
    albumId: null,
    masterKey: null,
    readonlyKey: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const albumId = localStorage.getItem("album_id");
      const masterKey = localStorage.getItem("master_key");
      const readonlyKey = localStorage.getItem("readonly_key");
      const albumNameLS = localStorage.getItem("album_name");

      setSession({ albumId, masterKey, readonlyKey });
      setAlbumNameDisplay(albumNameLS || "");

      if (albumId && (masterKey || readonlyKey)) {
        const key = masterKey ?? readonlyKey;
        axios
          .get(`http://localhost:8000/images/${albumId}?access_key=${key}`)
          .then((res) => {
            setImages(res.data.images.map((img: any) => img.filename));
          })
          .catch((err) => {
            console.warn("No se pudieron obtener las imágenes:", err.message);
            setImages([]);
          });
      }
    }
  }, []);

  useEffect(() => {
    const key = session.masterKey ?? session.readonlyKey;
    if (session.albumId && key) {
      axios
        .get(`http://localhost:8000/images/${session.albumId}?access_key=${key}`)
        .then((res) => {
          setImages(res.data.images.map((img: any) => img.filename));
        })
        .catch((err) => {
          console.warn("No se pudieron obtener las imágenes:", err.message);
          setImages([]);
        });
    }
  }, [session.albumId, session.masterKey, session.readonlyKey, refreshTrigger]);

  const createAlbum = async () => {
    const res = await axios.post("http://localhost:8000/albums/create", {
      album_name: albumName,
    });
    const { album } = res.data;

    localStorage.setItem("album_id", album._id);
    localStorage.setItem("master_key", album.master_key);
    localStorage.setItem("album_name", album.album_name);

    setSession({
      albumId: album._id,
      masterKey: album.master_key,
      readonlyKey: null,
    });
    setAlbumNameDisplay(album.album_name);
    setView("home");
  };

  const accessAlbum = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/albums/verify_key?key=${accessKey}`
      );
      if (res.data.access_type === "master") {
        localStorage.setItem("album_id", res.data.album_id);
        localStorage.setItem("master_key", accessKey);
        localStorage.setItem("album_name", res.data.album_name);
        setSession({
          albumId: res.data.album_id,
          masterKey: accessKey,
          readonlyKey: null,
        });
      } else {
        localStorage.setItem("album_id", res.data.album_id);
        localStorage.setItem("readonly_key", accessKey);
        localStorage.setItem("album_name", res.data.album_name);
        setSession({
          albumId: res.data.album_id,
          masterKey: null,
          readonlyKey: accessKey,
        });
      }
      setAlbumNameDisplay(res.data.album_name);
      setView("home");
    } catch (error) {
      alert("Error: Clave incorrecta o no válida.");
    }
  };

  const logout = () => {
    localStorage.removeItem("album_id");
    localStorage.removeItem("master_key");
    localStorage.removeItem("readonly_key");
    localStorage.removeItem("album_name");
    setSession({
      albumId: null,
      masterKey: null,
      readonlyKey: null,
    });
    setImages([]);
    setAlbumNameDisplay("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-center">
      {!session.albumId && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Bienvenido</h1>
          <div className="flex flex-col gap-4 items-center">
            <button onClick={() => setView("create")} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
              Crear álbum
            </button>
            <button onClick={() => setView("access")} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
              Acceder a álbum
            </button>

            {view === "create" && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <input
                  className="border border-gray-300 rounded px-3 py-2 w-64"
                  placeholder="Nombre del álbum"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                />
                <button onClick={createAlbum} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Crear
                </button>
              </div>
            )}

            {view === "access" && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <input
                  className="border border-gray-300 rounded px-3 py-2 w-64"
                  placeholder="Clave de acceso"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />
                <button onClick={accessAlbum} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Acceder
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {session.albumId && (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Álbum Key: <span className="font-mono">{session.masterKey ?? session.readonlyKey}</span>
          </h2>
          <p className="text-gray-600 mb-4">Nombre del álbum: {albumNameDisplay}</p>

          {session.masterKey && (
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={() => alert(session.masterKey)}
              >
                Ver clave maestra
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                onClick={() => document.getElementById("uploadInput")?.click()}
              >
                Subir imagen
              </button>
              <input
                id="uploadInput"
                type="file"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  await axios.post(
                    `http://localhost:8000/images/upload/${session.albumId}?access_key=${session.masterKey}`,
                    formData,
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    }
                  );
                  alert("Imagen subida");
                  setRefreshTrigger((prev) => prev + 1);
                }}
              />
            </div>
          )}

          {session.readonlyKey && (
            <p className="mt-2 text-yellow-600 font-medium">Acceso en modo solo lectura.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {images.map((filename, index) => (
              <div key={index} className="rounded overflow-hidden shadow">
                <img
                  src={`http://localhost:8000/static/${filename}`}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>

          <button
            onClick={logout}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
