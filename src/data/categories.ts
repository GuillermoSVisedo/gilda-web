export type Category = {
  slug: string;
  name: string;
  description: string;
};

// TODO: cuando se conecte Loyverse, sustituir este listado estático por las
// categorías (y sus productos) obtenidas de la API de inventario.
export const CATEGORIES: Category[] = [
  {
    slug: "vestidos",
    name: "Vestidos",
    description: "Para el día a día y para las ocasiones especiales.",
  },
  {
    slug: "punto-y-blazers",
    name: "Punto y blazers",
    description: "Capas con estructura y prendas de punto de entretiempo.",
  },
  {
    slug: "bolsos-y-accesorios",
    name: "Bolsos y accesorios",
    description: "El complemento final para cada look.",
  },
  {
    slug: "novedades",
    name: "Novedades",
    description: "Lo último que ha llegado a la tienda.",
  },
];
