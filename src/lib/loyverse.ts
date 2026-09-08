const LOYVERSE_API_BASE = "https://api.loyverse.com/v1.0";

// Los datos de catálogo/stock se cachean 5 minutos: es un catálogo
// informativo (fase 1, sin checkout), no hace falta que sea al segundo.
const REVALIDATE_SECONDS = 300;

// Si Loyverse no responde en este tiempo, se da por caída (evita que una
// página se quede colgada esperando indefinidamente).
const REQUEST_TIMEOUT_MS = 8000;

// Error específico para fallos al hablar con Loyverse (caída, timeout, token
// inválido...), para poder distinguirlos de un bug en el propio código —
// ver error.tsx en src/app/coleccion/[slug]/.
export class LoyverseApiError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "LoyverseApiError";
  }
}

function getToken(): string {
  const token = process.env.LOYVERSE_API_TOKEN;
  if (!token) {
    throw new LoyverseApiError(
      "Falta LOYVERSE_API_TOKEN en el entorno. Copia .env.example como " +
        ".env.local y añade el token generado en el panel de Loyverse."
    );
  }
  return token;
}

async function loyverseFetch<T>(path: string): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${LOYVERSE_API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (cause) {
    const timedOut = cause instanceof Error && cause.name === "TimeoutError";
    throw new LoyverseApiError(
      timedOut
        ? `Loyverse no respondió en ${REQUEST_TIMEOUT_MS}ms en ${path}`
        : `No se pudo conectar con Loyverse en ${path}`,
      { cause }
    );
  }

  if (!res.ok) {
    throw new LoyverseApiError(`Loyverse API error ${res.status} en ${path}`);
  }

  return res.json() as Promise<T>;
}

// La API de Loyverse no soporta filtrar /items por categoría (los parámetros
// category_id / category_ids se ignoran, comprobado manualmente) ni tiene
// límite alto de página: hay que paginar con "cursor" y traer todo, filtrando
// luego en memoria. Con revalidate cacheado, no se repite en cada request.
async function paginate<T>(
  fetchPage: (cursor?: string) => Promise<{ items: T[]; cursor?: string }>
): Promise<T[]> {
  const all: T[] = [];
  let cursor: string | undefined;

  do {
    const { items, cursor: next } = await fetchPage(cursor);
    all.push(...items);
    cursor = next;
  } while (cursor);

  return all;
}

export type LoyverseCategory = {
  id: string;
  name: string;
  deleted_at: string | null;
};

export type LoyverseVariant = {
  variant_id: string;
  default_price: number | null;
};

export type LoyverseItem = {
  id: string;
  item_name: string;
  category_id: string | null;
  image_url: string | null;
  variants: LoyverseVariant[];
  deleted_at: string | null;
};

export type LoyverseInventoryLevel = {
  variant_id: string;
  store_id: string;
  in_stock: number;
};

export type LoyverseStore = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  phone_number: string | null;
};

export async function getCategories(): Promise<LoyverseCategory[]> {
  const all = await paginate<LoyverseCategory>(async (cursor) => {
    const query = cursor
      ? `?limit=250&cursor=${encodeURIComponent(cursor)}`
      : "?limit=250";
    const page = await loyverseFetch<{
      categories: LoyverseCategory[];
      cursor?: string;
    }>(`/categories${query}`);
    return { items: page.categories, cursor: page.cursor };
  });

  return all.filter((category) => !category.deleted_at);
}

export async function getAllItems(): Promise<LoyverseItem[]> {
  const all = await paginate<LoyverseItem>(async (cursor) => {
    const query = cursor
      ? `?limit=250&cursor=${encodeURIComponent(cursor)}`
      : "?limit=250";
    const page = await loyverseFetch<{ items: LoyverseItem[]; cursor?: string }>(
      `/items${query}`
    );
    return { items: page.items, cursor: page.cursor };
  });

  return all.filter((item) => !item.deleted_at);
}

export async function getAllInventory(): Promise<LoyverseInventoryLevel[]> {
  return paginate<LoyverseInventoryLevel>(async (cursor) => {
    const query = cursor
      ? `?limit=250&cursor=${encodeURIComponent(cursor)}`
      : "?limit=250";
    const page = await loyverseFetch<{
      inventory_levels: LoyverseInventoryLevel[];
      cursor?: string;
    }>(`/inventory${query}`);
    return { items: page.inventory_levels, cursor: page.cursor };
  });
}

export async function getStore(): Promise<LoyverseStore | null> {
  const { stores } = await loyverseFetch<{ stores: LoyverseStore[] }>(
    "/stores"
  );
  return stores[0] ?? null;
}
