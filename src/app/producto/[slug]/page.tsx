import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getGroupedProductBySlug } from "@/lib/catalog";
import { getProductPhotos } from "@/lib/cloudinary";
import { formatSizeLabel } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getGroupedProductBySlug(slug);
  return { title: product ? `${product.name} | Gilda` : "Gilda" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getGroupedProductBySlug(slug);
  if (!product) notFound();

  const extraPhotos = await getProductPhotos(slug);
  const images = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...extraPhotos.map((photo) => photo.url),
  ];

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/#colecciones"
            className="text-sm text-olive-dark hover:underline"
          >
            ← Todas las colecciones
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <ProductGallery images={images} alt={product.name} />

            <div>
              <h1 className="font-serif text-3xl text-charcoal">
                {product.name}
              </h1>
              {product.price != null && (
                <p className="mt-2 text-lg text-charcoal">
                  {product.price.toFixed(2)} €
                </p>
              )}

              {product.sizes ? (
                <div className="mt-6">
                  <p className="text-xs tracking-wide text-charcoal uppercase">
                    Tallas
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size.label}
                        title={
                          size.inStock > 0
                            ? `${formatSizeLabel(size.label)}: en stock (${size.inStock})`
                            : `${formatSizeLabel(size.label)}: agotada`
                        }
                        className={`rounded-full border px-3 py-1 text-sm ${
                          size.inStock > 0
                            ? "border-olive-dark text-charcoal"
                            : "border-line text-charcoal-soft/40 line-through"
                        }`}
                      >
                        {formatSizeLabel(size.label)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p
                  className={`mt-6 text-sm tracking-wide ${
                    product.inStock > 0
                      ? "text-olive-dark"
                      : "text-charcoal-soft/50"
                  }`}
                >
                  {product.inStock > 0
                    ? `En stock (${product.inStock})`
                    : "Agotado"}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
