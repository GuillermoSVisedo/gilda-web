import Image from "next/image";
import type { Product } from "@/lib/collections";

export default function ProductGrid({
  products,
  emptyMessage = "No hay productos aquí ahora mismo.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="mt-14 text-center text-charcoal-soft">{emptyMessage}</p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-white/60"
        >
          {product.imageUrl ? (
            <div className="relative aspect-3/4 border-b border-line/70 bg-olive/20">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-3/4 items-center justify-center border-b border-dashed border-olive-dark/40 bg-olive/40">
              <span className="text-xs tracking-wide text-charcoal-soft">
                Sin foto
              </span>
            </div>
          )}

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
