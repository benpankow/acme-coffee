export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** Price in cents. */
  readonly price: number;
}

export const products: readonly Product[] = [
  {
    id: "house-blend",
    name: "House Blend",
    description: "Chocolate, toasted almond, and a clean finish. 12 oz, whole bean.",
    price: 1800,
  },
  {
    id: "ethiopia-guji",
    name: "Ethiopia Guji",
    description: "Bright and floral with notes of peach and bergamot. 12 oz, whole bean.",
    price: 2500,
  },
  {
    id: "decaf-colombia",
    name: "Decaf Colombia",
    description: "Swiss Water decaf with caramel sweetness. 12 oz, whole bean.",
    price: 1600,
  },
  {
    id: "pour-over-kit",
    name: "Pour-Over Kit",
    description: "Ceramic dripper, 100 filters, and a gooseneck kettle guide.",
    price: 4200,
  },
];

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
