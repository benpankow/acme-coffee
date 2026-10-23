import { Store } from "@/components/store";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main>
      <header className="hero">
        <h1>Acme Coffee</h1>
        <p>Small-batch coffee, roasted to order. Free shipping on orders of $50 or more.</p>
      </header>
      <Store products={products} />
    </main>
  );
}
