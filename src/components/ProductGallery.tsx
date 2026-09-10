"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-3/4 items-center justify-center rounded-2xl border border-dashed border-olive-dark/40 bg-olive/40">
        <span className="text-sm text-charcoal-soft">Sin foto</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-line/70 bg-olive/10">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === active ? "border-olive-dark" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
