import { describe, expect, it } from "vitest";

import {
  amountUntilFreeShipping,
  findDiscount,
  FLAT_SHIPPING,
  formatPrice,
  orderSummary,
  subtotal,
} from "./pricing";

describe("subtotal", () => {
  it("multiplies each line by its quantity", () => {
    expect(
      subtotal([
        { productId: "house-blend", quantity: 2 },
        { productId: "pour-over-kit", quantity: 1 },
      ]),
    ).toBe(7800);
  });

  it("ignores unknown products", () => {
    expect(subtotal([{ productId: "nope", quantity: 3 }])).toBe(0);
  });
});

describe("findDiscount", () => {
  it("matches codes case-insensitively", () => {
    expect(findDiscount(" welcome10 ")?.percentOff).toBe(10);
  });

  it("rejects unknown codes", () => {
    expect(findDiscount("FREECOFFEE")).toBeUndefined();
  });
});

describe("orderSummary", () => {
  it("charges shipping on small orders", () => {
    const summary = orderSummary([{ productId: "house-blend", quantity: 1 }]);
    expect(summary.shipping).toBe(FLAT_SHIPPING);
    expect(summary.total).toBe(1800 + FLAT_SHIPPING + 158);
  });

  it("ships large orders free", () => {
    const summary = orderSummary([{ productId: "pour-over-kit", quantity: 2 }]);
    expect(summary.shipping).toBe(0);
  });

  it("applies a percentage discount before tax", () => {
    const summary = orderSummary(
      [{ productId: "pour-over-kit", quantity: 2 }],
      findDiscount("WELCOME10"),
    );
    expect(summary.discount).toBe(840);
    expect(summary.tax).toBe(Math.round((8400 - 840) * 0.0875));
  });

  it("is empty for an empty cart", () => {
    expect(orderSummary([]).total).toBe(0);
  });
});

describe("amountUntilFreeShipping", () => {
  it("counts down to the threshold", () => {
    expect(amountUntilFreeShipping(1800)).toBe(3200);
  });

  it("is zero at exactly the threshold", () => {
    expect(amountUntilFreeShipping(5000)).toBe(0);
  });
});

describe("free shipping banner and checkout agree", () => {
  it("ships an order of exactly $50 free", () => {
    const cart = [
      { productId: "house-blend", quantity: 1 },
      { productId: "decaf-colombia", quantity: 2 },
    ];
    const summary = orderSummary(cart);
    expect(amountUntilFreeShipping(summary.subtotal - summary.discount)).toBe(0);
    expect(summary.shipping).toBe(0);
  });

  it("charges shipping when a discount drops the order below $50", () => {
    const cart = [
      { productId: "pour-over-kit", quantity: 1 },
      { productId: "house-blend", quantity: 1 },
    ];
    const summary = orderSummary(cart, findDiscount("BREW20"));
    expect(amountUntilFreeShipping(summary.subtotal - summary.discount)).toBe(200);
    expect(summary.shipping).toBe(FLAT_SHIPPING);
  });
});

describe("formatPrice", () => {
  it("formats cents as dollars", () => {
    expect(formatPrice(5999)).toBe("$59.99");
  });
});
