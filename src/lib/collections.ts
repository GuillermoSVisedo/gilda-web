import type { Collection } from "@/data/collections";
import { getAllInventory, getAllItems, getCategories } from "./loyverse";
import { buildStockMap, sortProductsByName, toProduct } from "./products";

export type { Product } from "./products";

function normalize(name: string): string {
  return name.trim().toUpperCase();
}

export async function getCollectionProducts(collection: Collection) {
  const [categories, items, inventory] = await Promise.all([
    getCategories(),
    getAllItems(),
    getAllInventory(),
  ]);

  const wantedNames = new Set(
    collection.loyverseCategoryNames.map(normalize)
  );
  const matchingCategoryIds = new Set(
    categories
      .filter((category) => wantedNames.has(normalize(category.name)))
      .map((category) => category.id)
  );

  const stockByVariant = buildStockMap(inventory);

  const products = items
    .filter(
      (item) => item.category_id && matchingCategoryIds.has(item.category_id)
    )
    .map((item) => toProduct(item, stockByVariant));

  return sortProductsByName(products);
}
