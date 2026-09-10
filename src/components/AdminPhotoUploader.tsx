"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUploadSignatureAction,
  finalizeUploadAction,
} from "@/app/admin/actions";

export default function AdminPhotoUploader({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Una firma vale para varias subidas del mismo lote (mismo folder,
      // tags y timestamp) — no hace falta pedir una por archivo.
      const signature = await createUploadSignatureAction(slug);

      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        body.append("api_key", signature.apiKey);
        body.append("timestamp", String(signature.timestamp));
        body.append("signature", signature.signature);
        body.append("folder", signature.folder);
        body.append("tags", signature.tags);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          { method: "POST", body }
        );

        if (!res.ok) {
          throw new Error(`No se pudo subir "${file.name}".`);
        }
      }

      await finalizeUploadAction(slug);
      setFiles([]);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron subir las fotos."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-3 rounded-2xl border border-line/70 p-5"
    >
      <label className="text-sm text-charcoal">
        Añadir fotos (puedes seleccionar varias a la vez)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) =>
          setFiles(Array.from(event.target.files ?? []))
        }
        className="text-sm text-charcoal-soft"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={files.length === 0 || uploading}
        className="self-start rounded-full bg-olive-dark px-6 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Subiendo..."
          : `Subir${files.length > 0 ? ` (${files.length})` : ""}`}
      </button>
    </form>
  );
}
