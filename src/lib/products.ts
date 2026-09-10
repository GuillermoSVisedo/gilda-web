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

export function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function paginateProducts<T>(
  items: T[],
  requestedPage: number,
  pageSize: number = PAGE_SIZE
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const pageProducts = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return { totalPages, currentPage, pageProducts };
}

// --- Agrupado por talla ---
//
// En Loyverse cada talla de un mismo artículo es un producto (item) aparte,
// no una variante — no usan su sistema de "opciones" (color/talla). El
// tallaje va escrito a mano al final del nombre en la mayoría de los casos
// ("Vestido azul M", "Alpargata burdeos 36"), así que lo detectamos con una
// lista cerrada de tallas conocidas y agrupamos por lo que queda del nombre.
//
// Esto NO agrupa por color (solo por talla): "Vestido azul M" y "Vestido
// verde M" siguen siendo dos artículos distintos, porque el color forma
// parte del nombre base. Agrupar también por color exigiría adivinar qué
// palabra del nombre es el color, con muchísimo más riesgo de mezclar
// artículos que no tienen nada que ver.
//
// Tampoco detecta el caso (minoritario) en que la talla no va al final del
// nombre, ej. "Blusón XL granate" — ese producto se queda sin agrupar con
// sus hermanos de otra talla.
const KNOWN_SIZES = [
  "TU",
  "XXXL",
  "XXL",
  "XL",
  "SM",
  "ML",
  "XS",
  "S",
  "M",
  "L",
];
const SIZE_TOKEN = new RegExp(
  `^(${KNOWN_SIZES.join("|")}|T\\d{2}|\\d{2})$`,
  "i"
);

// Orden de lectura natural para las tallas de ropa; las numéricas (zapato)
// se ordenan aparte, de menor a mayor.
const CLOTHING_SIZE_ORDER = ["XS", "S", "SM", "M", "ML", "L", "XL", "XXL", "XXXL", "TU"];

function splitNameAndSize(name: string): { base: string; size: string | null } {
  const words = name.trim().split(/\s+/);
  const last = words[words.length - 1];

  if (words.length > 1 && SIZE_TOKEN.test(last)) {
    return { base: words.slice(0, -1).join(" "), size: last.toUpperCase() };
  }

  return { base: name.trim(), size: null };
}

function compareSizes(a: string, b: string): number {
  const orderA = CLOTHING_SIZE_ORDER.indexOf(a);
  const orderB = CLOTHING_SIZE_ORDER.indexOf(b);
  if (orderA !== -1 || orderB !== -1) {
    return (
      (orderA === -1 ? CLOTHING_SIZE_ORDER.length : orderA) -
      (orderB === -1 ? CLOTHING_SIZE_ORDER.length : orderB)
    );
  }

  const numA = parseInt(a.replace(/^T/, ""), 10);
  const numB = parseInt(b.replace(/^T/, ""), 10);
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

  return a.localeCompare(b);
}

// "TU" (talla única) se lee mal como pastilla de talla — se muestra en
// texto completo en vez de la abreviatura.
export function formatSizeLabel(label: string): string {
  return label === "TU" ? "Talla única" : label;
}

export type SizeOption = {
  label: string;
  inStock: number;
};

export type GroupedProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  inStock: number;
  // null cuando no se detectó ninguna talla en el nombre (artículo suelto,
  // ej. un bolso o un collar).
  sizes: SizeOption[] | null;
};

export function groupProductsBySize(products: Product[]): GroupedProduct[] {
  const groups = new Map<
    string,
    { items: Product[]; sizes: Map<string, SizeOption> }
  >();

  for (const product of products) {
    const { base, size } = splitNameAndSize(product.name);

    if (!groups.has(base)) {
      groups.set(base, { items: [], sizes: new Map() });
    }
    const group = groups.get(base)!;
    group.items.push(product);

    if (size) {
      const existing = group.sizes.get(size);
      if (existing) {
        existing.inStock += product.inStock;
      } else {
        group.sizes.set(size, { label: size, inStock: product.inStock });
      }
    }
  }

  const result: GroupedProduct[] = [];
  for (const [base, group] of groups) {
    const prices = group.items
      .map((item) => item.price)
      .filter((price): price is number => price != null);

    result.push({
      id: group.items[0].id,
      name: base,
      imageUrl: group.items.find((item) => item.imageUrl)?.imageUrl ?? null,
      price: prices.length > 0 ? Math.min(...prices) : null,
      inStock: group.items.reduce((sum, item) => sum + item.inStock, 0),
      sizes:
        group.sizes.size > 0
          ? [...group.sizes.values()].sort((a, b) =>
              compareSizes(a.label, b.label)
            )
          : null,
    });
  }

  return sortByName(result);
}
