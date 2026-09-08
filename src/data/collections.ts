export type Collection = {
  slug: string;
  name: string;
  description: string;
  // Nombres de categoría tal cual existen en Loyverse (comprobados el
  // 2026-09-08 vía API). La comparación con LoyverseCategory.name se hace
  // sin distinguir mayúsculas/minúsculas — ver src/lib/collections.ts.
  loyverseCategoryNames: string[];
};

// Agrupación curada a mano de las 35 categorías reales de Loyverse en 10
// colecciones más manejables para la navegación de la web.
//
// TODO: si se crea una categoría nueva en Loyverse que no encaje en ninguno
// de estos grupos, sus productos no aparecerán en ninguna colección de la
// web hasta que se añada aquí (a un grupo existente o a uno nuevo).
export const COLLECTIONS: Collection[] = [
  {
    slug: "vestidos",
    name: "Vestidos",
    description: "Para el día a día y para las ocasiones especiales.",
    loyverseCategoryNames: ["VESTIDO"],
  },
  {
    slug: "faldas",
    name: "Faldas",
    description: "De todos los largos y estilos.",
    loyverseCategoryNames: ["FALDA"],
  },
  {
    slug: "pantalones-y-vaqueros",
    name: "Pantalones y vaqueros",
    description: "Vaqueros, pantalones de vestir, monos y bermudas.",
    loyverseCategoryNames: ["PANTALON", "VAQUERO", "BERMUDA", "PINZA", "MONO"],
  },
  {
    slug: "tops-y-camisas",
    name: "Tops y camisas",
    description: "Camisetas, tops, blusas y camisas.",
    loyverseCategoryNames: ["TOPS", "CAMISETA", "BLUSA/ CAMISA"],
  },
  {
    slug: "punto-y-sudaderas",
    name: "Punto y sudaderas",
    description: "Jerséis, sudaderas y chalecos de punto.",
    loyverseCategoryNames: ["JERSEY", "SUDADERA", "CHALECOS"],
  },
  {
    slug: "chaquetas-y-abrigos",
    name: "Chaquetas y abrigos",
    description: "Americanas, chaquetas, abrigos, capas y ponchos.",
    loyverseCategoryNames: ["CHAQUETA", "ABRIGO", "AMERICANA", "CAPAS", "PONCHO"],
  },
  {
    slug: "zapatos",
    name: "Zapatos",
    description: "Calzado para cada ocasión.",
    loyverseCategoryNames: ["ZAPATOS"],
  },
  {
    slug: "bolsos-y-monederos",
    name: "Bolsos y monederos",
    description: "El complemento final para cada look.",
    loyverseCategoryNames: ["BOLSO", "MONEDEROS"],
  },
  {
    slug: "joyeria-y-bisuteria",
    name: "Joyería y bisutería",
    description: "Pendientes, collares, pulseras y bisutería.",
    loyverseCategoryNames: [
      "BISUTERIA",
      "PULSERAS",
      "CADENA",
      "PENDIENTE",
      "COLLAR",
    ],
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    description: "Bufandas, gorros, guantes, cinturones y más.",
    loyverseCategoryNames: [
      "CINTURONES",
      "BUFANDA",
      "PAÑUELOS",
      "GUANTES",
      "GORRO",
      "PACK GORRO + BUFANDA",
      "COLETEROS",
      "CALCETINES",
      "PERFUMES",
    ],
  },
];
