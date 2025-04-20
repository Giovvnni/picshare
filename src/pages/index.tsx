/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AlbumView from "@/components/AlbumView";
import AuthSection from "@/components/AuthSection";

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
    const albumId = localStorage.getItem("album_id");
    const masterKey = localStorage.getItem("master_key");
    const readonlyKey = localStorage.getItem("readonly_key");
    const albumNameLS = localStorage.getItem("album_name");

    setSession({ albumId, masterKey, readonlyKey });
    setAlbumNameDisplay(albumNameLS || "");

    if (albumId && (masterKey || readonlyKey)) {
      const key = masterKey ?? readonlyKey;
      axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${albumId}?access_key=${key}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
        .then((res) => {
          setImages(res.data.images.map((img: any) => img.filename));
        })
        .catch(() => setImages([]));
    }
  }, []);

  useEffect(() => {
    const key = session.masterKey ?? session.readonlyKey;
    if (session.albumId && key) {
      axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${session.albumId}?access_key=${key}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )        .then((res) => {
          setImages(res.data.images.map((img: any) => img.filename));
        })
        .catch(() => setImages([]));
    }
  }, [session, refreshTrigger]);
  

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-no-repeat bg-cover text-center"
      style={{
        backgroundImage: "url('/bg-animaated.gif')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {!session.albumId ? (
        <AuthSection
          view={view}
          setView={setView}
          albumName={albumName}
          setAlbumName={setAlbumName}
          accessKey={accessKey}
          setAccessKey={setAccessKey}
          setSession={setSession}
          setAlbumNameDisplay={setAlbumNameDisplay}
        />
      ) : (
        <AlbumView
          session={session}
          images={images}
          setRefreshTrigger={setRefreshTrigger}
          albumNameDisplay={albumNameDisplay}
          setAlbumNameDisplay={setAlbumNameDisplay}
          logout={() => {
            localStorage.clear();
            setSession({ albumId: null, masterKey: null, readonlyKey: null });
            setImages([]);
            setAlbumNameDisplay("");
          }}
        />
      )}
    </div>
  );
}
