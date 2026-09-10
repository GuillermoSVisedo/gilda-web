import { getAllInventory, getAllItems } from "./loyverse";
import { buildStockMap, sortProductsByName, toProduct } from "./products";

// Busca en TODO el catálogo (no solo en las categorías agrupadas en las 10
// colecciones), por coincidencia de texto en el nombre del producto. Sin
// tildes/mayúsculas no distingue.
export async function searchProducts(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const [items, inventory] = await Promise.all([
    getAllItems(),
    getAllInventory(),
  ]);

  const stockByVariant = buildStockMap(inventory);

  const matches = items
    .filter((item) => item.item_name.toLowerCase().includes(normalizedQuery))
    .map((item) => toProduct(item, stockByVariant));

  return sortProductsByName(matches);
}
