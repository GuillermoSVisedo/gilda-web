import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import StockFilterToggle from "@/components/StockFilterToggle";
import { searchProducts } from "@/lib/search";
import { paginateProducts } from "@/lib/products";

export const metadata = { title: "Buscar | Gilda" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; stock?: string }>;
}) {
  const { q, page: pageParam, stock: stockParam } = await searchParams;
  const query = (q ?? "").trim();
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const onlyInStock = stockParam === "1";

  const allResults = query ? await searchProducts(query) : [];
  const results = onlyInStock
    ? allResults.filter((product) => product.inStock > 0)
    : allResults;

  const { totalPages, currentPage, pageProducts } = paginateProducts(
    results,
    requestedPage
  );

  const buildHref = (page: number) =>
    `/buscar?${new URLSearchParams({
      q: query,
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
              Buscar
            </span>
            <h1 className="mt-4 font-serif text-4xl text-charcoal">
              Busca un producto
            </h1>
          </div>

          <form
            action="/buscar"
            className="mt-6 flex max-w-lg gap-3"
          >
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Ej. vestido azul, jersey punto..."
              autoFocus
              className="w-full rounded-full border border-line/70 bg-white px-5 py-2.5 text-sm text-charcoal placeholder:text-charcoal-soft/60 focus:border-olive-dark focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-olive-dark px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-olive-deep"
            >
              Buscar
            </button>
          </form>

          {query && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-charcoal-soft/70">
                {results.length}{" "}
                {results.length === 1 ? "resultado" : "resultados"} para
                &ldquo;{query}&rdquo;
                {onlyInStock && " en stock"}
              </p>

              {allResults.length > 0 && (
                <StockFilterToggle
                  active={onlyInStock}
                  hrefOn={`/buscar?${new URLSearchParams({ q: query, stock: "1" })}`}
                  hrefOff={`/buscar?${new URLSearchParams({ q: query })}`}
                />
              )}
            </div>
          )}

          {query ? (
            <ProductGrid
              products={pageProducts}
              emptyMessage={`No hemos encontrado ningún producto con "${query}".`}
            />
          ) : (
            <p className="mt-14 text-center text-charcoal-soft">
              Escribe el nombre de una prenda para buscarla en todo el
              catálogo.
            </p>
          )}

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
