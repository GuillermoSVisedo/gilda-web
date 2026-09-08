import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { COLLECTIONS } from "@/data/collections";
import { getCollectionProducts } from "@/lib/collections";

const PAGE_SIZE = 24;

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
  const products = onlyInStock
    ? allProducts.filter((product) => product.inStock > 0)
    : allProducts;

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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

            <Link
              href={
                onlyInStock
                  ? `/coleccion/${slug}`
                  : `/coleccion/${slug}?stock=1`
              }
              className={
                onlyInStock
                  ? "rounded-full bg-olive-dark px-5 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
                  : "rounded-full border border-olive-dark px-5 py-2 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
              }
            >
              {onlyInStock ? "✓ Solo en stock" : "Solo en stock"}
            </Link>
          </div>

          <ProductGrid products={pageProducts} />

          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-4">
              <PageLink
                slug={slug}
                page={currentPage - 1}
                onlyInStock={onlyInStock}
                disabled={currentPage <= 1}
              >
                Anterior
              </PageLink>
              <span className="text-sm text-charcoal-soft">
                Página {currentPage} de {totalPages}
              </span>
              <PageLink
                slug={slug}
                page={currentPage + 1}
                onlyInStock={onlyInStock}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </PageLink>
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function PageLink({
  slug,
  page,
  onlyInStock,
  disabled,
  children,
}: {
  slug: string;
  page: number;
  onlyInStock: boolean;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-full border border-line px-5 py-2 text-sm text-charcoal-soft/40">
        {children}
      </span>
    );
  }

  const query = onlyInStock ? `page=${page}&stock=1` : `page=${page}`;

  return (
    <Link
      href={`/coleccion/${slug}?${query}`}
      className="rounded-full border border-olive-dark px-5 py-2 text-sm text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
    >
      {children}
    </Link>
  );
}
