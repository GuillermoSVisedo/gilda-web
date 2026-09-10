import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import StockFilterToggle from "@/components/StockFilterToggle";
import { COLLECTIONS } from "@/data/collections";
import { getCollectionProducts } from "@/lib/collections";
import { groupProductsBySize, paginateProducts } from "@/lib/products";

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((item) => item.slug === slug);
  return { title: collection ? `${collection.name} | Gilda` : "Gilda" };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; stock?: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((item) => item.slug === slug);
  if (!collection) notFound();

  const { page: pageParam, stock: stockParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const onlyInStock = stockParam === "1";

  const allProducts = await getCollectionProducts(collection);
  const grouped = groupProductsBySize(allProducts);
  const products = onlyInStock
    ? grouped.filter((product) => product.inStock > 0)
    : grouped;

  const { totalPages, currentPage, pageProducts } = paginateProducts(
    products,
    requestedPage
  );

  const buildHref = (page: number) =>
    `/coleccion/${slug}?${new URLSearchParams({
      page: String(page),
      ...(onlyInStock ? { stock: "1" } : {}),
    })}`;

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-6 py-16">
          <Link
            href="/#colecciones"
            className="text-sm text-olive-dark hover:underline"
          >
            ← Todas las colecciones
          </Link>

          <div className="mt-4 max-w-xl">
            <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
              Colección
            </span>
            <h1 className="mt-4 font-serif text-4xl text-charcoal">
              {collection.name}
            </h1>
            <p className="mt-3 text-charcoal-soft">{collection.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-charcoal-soft/70">
              {products.length} {products.length === 1 ? "producto" : "productos"}
              {onlyInStock && " en stock"}
            </p>

            <StockFilterToggle
              active={onlyInStock}
              hrefOn={`/coleccion/${slug}?stock=1`}
              hrefOff={`/coleccion/${slug}`}
            />
          </div>

          <ProductGrid
            products={pageProducts}
            emptyMessage="No hay productos en esta colección ahora mismo."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
