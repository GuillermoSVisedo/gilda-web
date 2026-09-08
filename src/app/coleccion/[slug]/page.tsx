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
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((item) => item.slug === slug);
  if (!collection) notFound();

  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  const products = await getCollectionProducts(collection);
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
            <p className="mt-1 text-sm text-charcoal-soft/70">
              {products.length}{" "}
              {products.length === 1 ? "producto" : "productos"}
            </p>
          </div>

          <ProductGrid products={pageProducts} />

          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-4">
              <PageLink
                slug={slug}
                page={currentPage - 1}
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
  disabled,
  children,
}: {
  slug: string;
  page: number;
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

  return (
    <Link
      href={`/coleccion/${slug}?page=${page}`}
      className="rounded-full border border-olive-dark px-5 py-2 text-sm text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
    >
      {children}
    </Link>
  );
}
