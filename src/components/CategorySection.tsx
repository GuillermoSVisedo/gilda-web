import type { Category } from "@/data/categories";

// TODO: sustituir por los productos reales de cada categoría (foto, nombre,
// precio, disponibilidad) cuando se conecte la API de Loyverse.
const PLACEHOLDER_PRODUCTS = 4;

export default function CategorySection({ category }: { category: Category }) {
  return (
    <section
      id={category.slug}
      className="scroll-mt-24 border-b border-line/70 py-20 last:border-b-0"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
            Colección
          </span>
          <h2 className="mt-4 font-serif text-4xl text-charcoal">
            {category.name}
          </h2>
          <p className="mt-3 text-charcoal-soft">{category.description}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {Array.from({ length: PLACEHOLDER_PRODUCTS }).map((_, index) => (
            <div
              key={index}
              className="flex aspect-3/4 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-olive-dark/50 bg-olive/40 px-3 text-center"
            >
              <span className="text-sm text-charcoal-soft">Producto</span>
              <span className="text-xs tracking-wide text-charcoal-soft/70">
                Próximamente
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
