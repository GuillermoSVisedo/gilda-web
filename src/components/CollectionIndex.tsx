import Link from "next/link";
import { COLLECTIONS } from "@/data/collections";

export default function CollectionIndex() {
  return (
    <section
      id="colecciones"
      className="scroll-mt-24 border-y border-line/70 bg-white/50 py-16"
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
          Colecciones
        </span>
        <h2 className="mt-4 font-serif text-4xl text-charcoal">
          Compra por categoría
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-charcoal-soft">
          El catálogo completo, con disponibilidad real de cada prenda.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.slug}
              href={`/coleccion/${collection.slug}`}
              className="rounded-2xl border border-olive-dark px-4 py-6 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
            >
              {collection.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
