import type { Product } from "@/lib/collections";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="mt-14 text-center text-charcoal-soft">
        No hay productos en esta colección ahora mismo.
      </p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-white/60"
        >
          {/* TODO: sustituir por la foto real del producto (next/image) en
              cuanto haya fotos subidas en Loyverse — de momento ningún
              producto tiene image_url. */}
          <div className="flex aspect-3/4 items-center justify-center border-b border-dashed border-olive-dark/40 bg-olive/40">
            <span className="text-xs tracking-wide text-charcoal-soft">
              Sin foto
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <span className="text-sm text-charcoal">{product.name}</span>
            {product.price != null && (
              <span className="text-sm font-medium text-charcoal">
                {product.price.toFixed(2)} €
              </span>
            )}
            <span
              className={`mt-auto text-xs tracking-wide ${
                product.inStock > 0
                  ? "text-olive-dark"
                  : "text-charcoal-soft/50"
              }`}
            >
              {product.inStock > 0
                ? `En stock (${product.inStock})`
                : "Agotado"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
