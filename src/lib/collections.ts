import type { Collection } from "@/data/collections";
import { getAllInventory, getAllItems, getCategories } from "./loyverse";

export type Product = {
  id: string;
  name: string;
  price: number | null;
  inStock: number;
};

function normalize(name: string): string {
  return name.trim().toUpperCase();
}

export async function getCollectionProducts(
  collection: Collection
): Promise<Product[]> {
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

  const stockByVariant = new Map(
    inventory.map((level) => [level.variant_id, level.in_stock])
  );

  return items
    .filter(
      (item) => item.category_id && matchingCategoryIds.has(item.category_id)
    )
    .map((item) => {
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
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}
