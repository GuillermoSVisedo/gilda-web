import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getGroupedProductBySlug } from "@/lib/catalog";
import { getProductPhotos } from "@/lib/cloudinary";
import { deletePhotoAction, uploadPhotoAction } from "../../actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getGroupedProductBySlug(slug);
  return { title: product ? `${product.name} | Panel` : "Panel" };
}

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const product = await getGroupedProductBySlug(slug);
  if (!product) notFound();

  const photos = await getProductPhotos(slug);
  const uploadWithSlug = uploadPhotoAction.bind(null, slug);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/admin"
        className="text-sm text-olive-dark hover:underline"
      >
        ← Buscar otro producto
      </Link>

      <h1 className="mt-4 font-serif text-3xl text-charcoal">
        {product.name}
      </h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        {product.imageUrl
          ? "Ya tiene 1 foto en Loyverse, más las que subas aquí."
          : "Sin foto en Loyverse todavía — las que subas aquí se mostrarán igualmente."}
      </p>

      <form
        action={uploadWithSlug}
        className="mt-8 flex flex-col gap-3 rounded-2xl border border-line/70 p-5"
      >
        <label className="text-sm text-charcoal">
          Añadir fotos (puedes seleccionar varias a la vez)
        </label>
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          required
          className="text-sm text-charcoal-soft"
        />
        <button
          type="submit"
          className="self-start rounded-full bg-olive-dark px-6 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
        >
          Subir
        </button>
      </form>

      <h2 className="mt-10 text-sm tracking-wide text-charcoal uppercase">
        Fotos subidas ({photos.length})
      </h2>

      {photos.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal-soft">
          Todavía no has subido ninguna foto de este producto.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
          {photos.map((photo) => {
            const deleteWithIds = deletePhotoAction.bind(
              null,
              photo.publicId,
              slug
            );
            return (
              <div key={photo.publicId} className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-line/70">
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
                <form action={deleteWithIds}>
                  <button
                    type="submit"
                    className="w-full rounded-full border border-line px-3 py-1 text-xs text-charcoal-soft transition-colors hover:border-red-300 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
