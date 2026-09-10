import type { LoyverseInventoryLevel, LoyverseItem } from "./loyverse";

export type Product = {
  id: string;
  name: string;
  price: number | null;
  inStock: number;
  imageUrl: string | null;
};

// Cuántos productos se muestran por página, tanto en una colección como en
// resultados de búsqueda.
export const PAGE_SIZE = 24;

export function buildStockMap(
  inventory: LoyverseInventoryLevel[]
): Map<string, number> {
  return new Map(inventory.map((level) => [level.variant_id, level.in_stock]));
}

export function toProduct(
  item: LoyverseItem,
  stockByVariant: Map<string, number>
): Product {
  const prices = item.variants
    .map((variant) => variant.default_price)
    .filter((price): price is number => price != null);

  const inStock = item.variants.reduce(
    (sum, variant) => sum + (stockByVariant.get(variant.variant_id) ?? 0),
    0
  );

  return {
    id: item.id,
    name: item.item_name,
    price: prices.length > 0 ? Math.min(...prices) : null,
    inStock,
    imageUrl: item.image_url,
  };
}

export function sortProductsByName(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function paginateProducts(
  products: Product[],
  requestedPage: number,
  pageSize: number = PAGE_SIZE
) {
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const pageProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return { totalPages, currentPage, pageProducts };
}
