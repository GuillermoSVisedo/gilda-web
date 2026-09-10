import { getAllInventory, getAllItems } from "./loyverse";
import {
  buildStockMap,
  groupProductsBySize,
  toProduct,
  type Product,
} from "./products";

// Todos los productos del catálogo, sin filtrar por categoría ni nombre —
// usado por la página de producto y el panel de admin, que necesitan
// resolver cualquier artículo por su slug sin depender de en qué colección
// o búsqueda se generó.
export async function getAllProducts(): Promise<Product[]> {
  const [items, inventory] = await Promise.all([
    getAllItems(),
    getAllInventory(),
  ]);

  const stockByVariant = buildStockMap(inventory);
  return items.map((item) => toProduct(item, stockByVariant));
}

export async function getGroupedProductBySlug(slug: string) {
  const products = await getAllProducts();
  const grouped = groupProductsBySize(products);
  return grouped.find((product) => product.slug === slug) ?? null;
}
