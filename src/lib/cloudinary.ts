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

// dataUri: "data:image/jpeg;base64,...."
export async function uploadProductPhoto(
  slug: string,
  dataUri: string
): Promise<void> {
  await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER,
    tags: [productTag(slug)],
  });
}

export async function deleteProductPhoto(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
