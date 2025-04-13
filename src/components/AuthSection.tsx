/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";

export default function AuthSection({
  view,
  setView,
  albumName,
  setAlbumName,
  accessKey,
  setAccessKey,
  setSession,
  setAlbumNameDisplay,
}: any) {
  const createAlbum = async () => {
    console.log("📦 Creando álbum con nombre:", albumName);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/albums/create`, {
        album_name: albumName,
      });
      const { album } = res.data;
      console.log("✅ Álbum creado:", album);

      localStorage.setItem("album_id", album._id);
      localStorage.setItem("master_key", album.master_key);
      localStorage.setItem("album_name", album.album_name);

      setSession({ albumId: album._id, masterKey: album.master_key, readonlyKey: null });
      console.log("🧠 Sesión seteada (create):", {
        albumId: album._id,
        masterKey: album.master_key,
        readonlyKey: null,
      });

      setAlbumNameDisplay(album.album_name);
      console.log("🎨 Nombre de álbum mostrado:", album.album_name);

      setView("home");
      console.log("🚀 Vista cambiada a 'home' (desde create)");
    } catch (error) {
      console.error("❌ Error al crear álbum:", error);
    }
  };

  const accessAlbum = async () => {
    console.log("🔑 Accediendo a álbum con clave:", accessKey);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/albums/verify_key?key=${accessKey}`
      );

      console.log("✅ Respuesta de verificación:", res.data);

      localStorage.setItem("album_id", res.data.album_id);
      localStorage.setItem(
        res.data.access_type === "master" ? "master_key" : "readonly_key",
        accessKey
      );
      localStorage.setItem("album_name", res.data.album_name);

      const sessionData = {
        albumId: res.data.album_id,
        masterKey: res.data.access_type === "master" ? accessKey : null,
        readonlyKey: res.data.access_type !== "master" ? accessKey : null,
      };

      setSession(sessionData);
      console.log("🧠 Sesión seteada (access):", sessionData);

      setAlbumNameDisplay(res.data.album_name);
      console.log("🎨 Nombre de álbum mostrado:", res.data.album_name);

      setView("home");
      console.log("🚀 Vista cambiada a 'home' (desde access)");
    } catch (err) {
      console.error("❌ Error al acceder al álbum:", err);
      alert("Clave incorrecta o no válida.");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-pixelcute mb-8 text-gray-800">Welcome!</h1>
      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={() => {
            console.log("🧭 Navegando a vista: create");
            setView("create");
          }}
          className="px-4 py-2 animate-heartbeat text-2xl font-pixelcute bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Create a new album
        </button>
        <button
          onClick={() => {
            console.log("🧭 Navegando a vista: access");
            setView("access");
          }}
          className="px-4 py-2 animate-heartbeat font-pixelcute text-2xl bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          See your album!
        </button>

        {view === "create" && (
          <div className="mt-4 flex flex-col items-center gap-4">
            <input
              className="text-center border border-orange-400 font-pixelcute text-xl text-black rounded-lg px-5 py-3 w-64 bg-gradient-to-r from-yellow-50 to-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200 ease-in-out shadow-md"
              placeholder="Name your album!"
              value={albumName}
              onChange={(e) => {
                console.log("✏️ Cambiando nombre del álbum:", e.target.value);
                setAlbumName(e.target.value);
              }}
            />

            <button
              onClick={createAlbum}
              className="px-6 py-3 font-pixelcute bg-pink-600 bg-opacity-90 border-2 border-red-600 text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:bg-red-300 hover:bg-opacity-100 hover:text-white hover:border-red-600 hover:scale-105 hover:shadow-xl"
            >
              Create it!
            </button>
          </div>
        )}

        {view === "access" && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <input
              className="text-center border border-orange-400 font-pixelcute text-xl text-black rounded-lg px-5 py-3 w-64 bg-gradient-to-r from-yellow-50 to-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200 ease-in-out shadow-md"
              placeholder="Enter your key"
              value={accessKey}
              onChange={(e) => {
                console.log("🔐 Cambiando clave:", e.target.value);
                setAccessKey(e.target.value);
              }}
            />
            <button
              onClick={accessAlbum}
              className="px-6 py-3 font-pixelcute bg-pink-600 bg-opacity-90 border-2 border-red-600 text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:bg-red-300 hover:bg-opacity-100 hover:text-white hover:border-red-600 hover:scale-105 hover:shadow-xl"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </>
  );
}
