/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import UploadControls from "./UploadControls";
import ImageGrid from "./ImageGrid";
import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Image from "next/image"

export default function AlbumView({ session, images, setRefreshTrigger, albumNameDisplay, logout, setAlbumNameDisplay }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(albumNameDisplay);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleNameChange = async () => {
    if (!newName.trim() || !session.albumId || !session.masterKey) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/albums/change_name/`,
        {
          album_id: session.albumId,
          album_name: newName.trim(),
          master_key: session.masterKey,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setAlbumNameDisplay(newName.trim());
      localStorage.setItem("album_name", newName.trim());
      setIsEditing(false);
    } catch {
      alert("Failed to change album name");
    }
  };

  return (
  <div className="flex-col items-center justify-center w-full max-w-4xl p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
      {isEditing ? (
        <div className="mb-4 relative">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNameChange();
            }}
            onBlur={(e) => {
              // Si el nuevo foco es el botón "Cancel", no hagas el cambio
              if (e.relatedTarget === cancelButtonRef.current) return;
              handleNameChange();
            }}
            autoFocus
            className="text-2xl text-black text-center font-pixelcute px-2 py-1 rounded border border-gray-400"
          />
          <button
            ref={cancelButtonRef}
            onClick={() => {
              setNewName(albumNameDisplay); // Restablece el nombre
              setIsEditing(false); // Sale del modo edición
            }}
            className="absolute ml-4 mt-2 text-lg font-pixelcute text-red-500 hover:underline"
          >
             Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-center w-full max-w-4xl p-4 bg-white/0 rounded-lg">
          <div className="bg-[#5e3a1b] rounded-2xl px-4 py-2 text-center">
            <span className="block text-white font-pixelcute text-sm mb-1">
              Album Name
            </span>

            <button
              onClick={() => setIsEditing(true)}
              className="relative text-2xl font-pixelcute text-white group"
              
            >
              &quot; {albumNameDisplay} &quot;
              <Image
                src="/edit-pencil2.png"
                alt="edit"
                width={40}
                height={40}
                className="absolute -top-0 -right-12 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Image
                src="/edit-pencil.png"
                alt="edit"
                width={40}
                height={40}
                className="absolute -top-0 -left-12 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
        )}
      


      {session.masterKey && (
        <UploadControls session={session} setRefreshTrigger={setRefreshTrigger} />
      )}

      {session.readonlyKey && (
        <p className="mt-2 text-yellow-600 font-pixelcute font-medium">Guest.</p>
      )}

      <ImageGrid images={images} />

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 font-pixelcute bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log out
      </button>
    </div>
  );
}
