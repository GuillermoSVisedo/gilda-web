import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { searchProducts } from "@/lib/search";
import { groupProductsBySize } from "@/lib/products";
import { logoutAction } from "./actions";

export const metadata = { title: "Fotos de producto | Gilda" };

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const rawResults = query ? await searchProducts(query) : [];
  const results = groupProductsBySize(rawResults).slice(0, 40);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-serif text-2xl tracking-[0.2em] text-olive-dark">
            GILDA
          </span>
          <h1 className="mt-1 text-sm text-charcoal-soft">
            Panel · Fotos de producto
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-charcoal-soft hover:text-olive-dark"
          >
            Salir
          </button>
        </form>
      </div>

      <form action="/admin" className="mt-8 flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Busca un producto por nombre..."
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

      {query && results.length === 0 && (
        <p className="mt-10 text-sm text-charcoal-soft">
          Sin resultados para &ldquo;{query}&rdquo;.
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-8 divide-y divide-line/70 border-y border-line/70">
          {results.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/admin/producto/${product.slug}`}
                className="flex items-center justify-between px-1 py-3 text-sm text-charcoal transition-colors hover:text-olive-dark"
              >
                <span>{product.name}</span>
                <span className="text-charcoal-soft/50">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.length === 40 && (
        <p className="mt-4 text-xs text-charcoal-soft/60">
          Mostrando los primeros 40 resultados — afina la búsqueda si no
          encuentras el que buscas.
        </p>
      )}
    </main>
  );
}
