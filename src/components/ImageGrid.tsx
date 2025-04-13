import React from "react";
import Image from "next/image";

export default function ImageGrid({ images }: { images: string[] }) {
  return (
    <div
      className={`
        grid
        gap-4
        mt-6
        justify-center
        mx-auto
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        max-w-screen-md
      `}
    >
      {images.map((filename, index) => (
        <div
          key={index}
          className="relative aspect-[4/3] rounded overflow-hidden shadow w-full"
        >
          <Image
            src={`http://localhost:8000/static/${filename}`}
            alt={`Imagen ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
