import { CATEGORIES } from "@/data/categories";

export default function CategoryIndex() {
  return (
    <section
      id="colecciones"
      className="scroll-mt-24 border-y border-line/70 bg-white/50 py-14"
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="text-xs tracking-[0.35em] text-olive-dark uppercase">
          Colecciones
        </span>
        <h2 className="mt-4 font-serif text-4xl text-charcoal">
          Compra por categoría
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="rounded-full border border-olive-dark px-6 py-2 text-sm tracking-wide text-charcoal transition-colors hover:bg-olive-dark hover:text-cream"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
