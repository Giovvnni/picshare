/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import UploadControls from "./UploadControls";
import ImageGrid from "./ImageGrid";

export default function AlbumView({ session, images, setRefreshTrigger, albumNameDisplay, logout }: any) {
  return (
  <div className="flex-col items-center justify-center w-full max-w-4xl p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
    {/*
    <h2 className="text-xl font-semibold mb-2 text-gray-700">
        Álbum Key: <span className="font-mono">{session.masterKey ?? session.readonlyKey}</span>
      </h2>
      */}
      <p className="text-2xl font-pixelcute mb-4">
        <span className="bg-[#5e3a1b] bg-opacity-100 text-white px-1">Name of the album:</span>
        <span className="bg-[#5e3a1b] bg-opacity-100 text-white px-1">{albumNameDisplay}</span>
      </p>


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
