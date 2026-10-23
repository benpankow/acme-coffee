"use client";

import { useMemo, useState } from "react";

import {
  amountUntilFreeShipping,
  type CartLine,
  type DiscountCode,
  findDiscount,
  formatPrice,
  orderSummary,
} from "@/lib/pricing";
import type { Product } from "@/lib/products";

export function Store({ products }: { products: readonly Product[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [discount, setDiscount] = useState<DiscountCode | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();
  const [placed, setPlaced] = useState(false);

  const summary = useMemo(() => orderSummary(cart, discount), [cart, discount]);
  const remaining = amountUntilFreeShipping(cart);

  function setQuantity(productId: string, quantity: number) {
    setPlaced(false);
    setCart((lines) => {
      const others = lines.filter((line) => line.productId !== productId);
      return quantity > 0 ? [...others, { productId, quantity }] : others;
    });
  }

  function quantityOf(productId: string) {
    return cart.find((line) => line.productId === productId)?.quantity ?? 0;
  }

  function applyCode() {
    const found = findDiscount(codeInput);
    setDiscount(found);
    setCodeError(found ? undefined : "That code isn't valid.");
  }

  return (
    <div className="store">
      <section className="products">
        {products.map((product) => {
          const quantity = quantityOf(product.id);
          return (
            <article key={product.id} className="product">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="product-footer">
                <span className="price">{formatPrice(product.price)}</span>
                {quantity === 0 ? (
                  <button type="button" onClick={() => setQuantity(product.id, 1)}>
                    Add to cart
                  </button>
                ) : (
                  <div className="stepper">
                    <button
                      type="button"
                      aria-label={`Remove one ${product.name}`}
                      onClick={() => setQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${product.name}`}
                      onClick={() => setQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <aside className="cart">
        <h2>Your cart</h2>
        {cart.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <>
            <p className={remaining === 0 ? "banner banner-success" : "banner"}>
              {remaining === 0
                ? "You've unlocked free shipping!"
                : `Add ${formatPrice(remaining)} more for free shipping.`}
            </p>

            <form
              className="discount"
              onSubmit={(event) => {
                event.preventDefault();
                applyCode();
              }}
            >
              <input
                aria-label="Discount code"
                placeholder="Discount code"
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value)}
              />
              <button type="submit">Apply</button>
            </form>
            {codeError && <p className="error">{codeError}</p>}
            {discount && <p className="muted">{discount.code} applied.</p>}

            <dl className="summary">
              <dt>Subtotal</dt>
              <dd>{formatPrice(summary.subtotal)}</dd>
              {summary.discount > 0 && (
                <>
                  <dt>Discount</dt>
                  <dd>−{formatPrice(summary.discount)}</dd>
                </>
              )}
              <dt>Shipping</dt>
              <dd>{summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}</dd>
              <dt>Tax</dt>
              <dd>{formatPrice(summary.tax)}</dd>
              <dt className="total">Total</dt>
              <dd className="total">{formatPrice(summary.total)}</dd>
            </dl>

            <button type="button" className="checkout" onClick={() => setPlaced(true)}>
              Place order
            </button>
            {placed && (
              <p className="banner banner-success">
                Order placed. You were charged {formatPrice(summary.total)}.
              </p>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
