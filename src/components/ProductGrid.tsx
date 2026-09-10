import Image from "next/image";
import Link from "next/link";
import { formatSizeLabel, type GroupedProduct } from "@/lib/products";

export default function ProductGrid({
  products,
  emptyMessage = "No hay productos aquí ahora mismo.",
}: {
  products: GroupedProduct[];
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
        <Link
          key={product.id}
          href={`/producto/${product.slug}`}
          className="flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-white/60 transition-colors hover:border-olive-dark"
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

            {product.sizes ? (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {product.sizes.map((size) => (
                  <span
                    key={size.label}
                    title={
                      size.inStock > 0
                        ? `${formatSizeLabel(size.label)}: en stock (${size.inStock})`
                        : `${formatSizeLabel(size.label)}: agotada`
                    }
                    className={`rounded-full border px-2 py-0.5 text-[11px] tracking-wide ${
                      size.inStock > 0
                        ? "border-olive-dark text-charcoal"
                        : "border-line text-charcoal-soft/40 line-through"
                    }`}
                  >
                    {formatSizeLabel(size.label)}
                  </span>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
