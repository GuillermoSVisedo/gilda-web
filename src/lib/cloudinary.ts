import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = "gilda-productos";

// Cada foto sube etiquetada con "producto-<slug>" — es lo que usamos para
// encontrar las fotos de un artículo, sin necesidad de una base de datos
// propia (Cloudinary hace de índice).
function productTag(slug: string): string {
  return `producto-${slug}`;
}

export type ProductPhoto = {
  publicId: string;
  url: string;
};

export async function getProductPhotos(slug: string): Promise<ProductPhoto[]> {
  // Se usa la Admin API (resources_by_tag) en vez de la Search API: la
  // Search API tiene retraso de indexación (una foto recién subida podía
  // tardar en aparecer, comprobado manualmente), resources_by_tag refleja
  // subidas y borrados al instante.
  type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    created_at: string;
  };

  const result = await cloudinary.api.resources_by_tag(productTag(slug), {
    max_results: 30,
  });

  const resources = (result.resources ?? []) as CloudinaryResource[];
  resources.sort((a, b) => a.created_at.localeCompare(b.created_at));

  return resources.map((resource) => ({
    publicId: resource.public_id,
    url: resource.secure_url,
  }));
}

export async function deleteProductPhoto(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export type UploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  tags: string;
};

// El servidor de Vercel rechaza cualquier petición de más de 4,5 MB (límite
// fijo de la infraestructura, no configurable) — una foto de móvil normal ya
// lo supera. Por eso el archivo no pasa por nuestro servidor: el navegador
// sube directamente a Cloudinary, y aquí solo se firma la subida (con
// nuestra clave secreta, que nunca sale del servidor) para que Cloudinary
// sepa que viene de una fuente autorizada.
export function createUploadSignature(slug: string): UploadSignature {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !apiSecret || !cloudName) {
    throw new Error(
      "Faltan las variables CLOUDINARY_* en el entorno (ver .env.example)."
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const tags = productTag(slug);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: FOLDER, tags },
    apiSecret
  );

  return { timestamp, signature, apiKey, cloudName, folder: FOLDER, tags };
}
