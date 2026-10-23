import { findProduct } from "./products";

export interface CartLine {
  readonly productId: string;
  readonly quantity: number;
}

export interface DiscountCode {
  readonly code: string;
  /** Percent off the merchandise subtotal, 0–100. */
  readonly percentOff: number;
}

export const DISCOUNT_CODES: readonly DiscountCode[] = [
  { code: "WELCOME10", percentOff: 10 },
  { code: "BREW20", percentOff: 20 },
];

/** Free shipping on orders of $50 or more, after discounts. */
export const FREE_SHIPPING_THRESHOLD = 5000;
export const FLAT_SHIPPING = 599;
export const TAX_RATE = 0.0875;

export function findDiscount(code: string): DiscountCode | undefined {
  const normalized = code.trim().toUpperCase();
  return DISCOUNT_CODES.find((discount) => discount.code === normalized);
}

export function subtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => {
    const product = findProduct(line.productId);
    return product ? sum + product.price * line.quantity : sum;
  }, 0);
}

export function discountAmount(lines: readonly CartLine[], discount?: DiscountCode): number {
  if (!discount) return 0;
  return Math.round((subtotal(lines) * discount.percentOff) / 100);
}

/** How much more the customer needs to spend for free shipping, after discounts. */
export function amountUntilFreeShipping(
  lines: readonly CartLine[],
  discount?: DiscountCode,
): number {
  const discounted = subtotal(lines) - discountAmount(lines, discount);
  return Math.max(0, FREE_SHIPPING_THRESHOLD - discounted);
}

export interface OrderSummary {
  readonly subtotal: number;
  readonly discount: number;
  readonly shipping: number;
  readonly tax: number;
  readonly total: number;
}

export function orderSummary(lines: readonly CartLine[], discount?: DiscountCode): OrderSummary {
  const merchandise = subtotal(lines);
  const off = discountAmount(lines, discount);
  const discounted = merchandise - off;
  const shipping =
    merchandise === 0 || amountUntilFreeShipping(lines, discount) === 0 ? 0 : FLAT_SHIPPING;
  const tax = Math.round(discounted * TAX_RATE);
  return {
    subtotal: merchandise,
    discount: off,
    shipping,
    tax,
    total: discounted + shipping + tax,
  };
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
}
