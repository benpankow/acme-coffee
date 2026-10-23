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
    expect(amountUntilFreeShipping([{ productId: "house-blend", quantity: 1 }])).toBe(3200);
  });

  it("counts the discounted total, not the subtotal", () => {
    const lines = [
      { productId: "pour-over-kit", quantity: 1 },
      { productId: "house-blend", quantity: 1 },
    ];
    expect(amountUntilFreeShipping(lines, findDiscount("BREW20"))).toBe(5000 - 4800);
  });
});

describe("free shipping policy: $50 or more, after discounts", () => {
  it("ships free at exactly $50 and the banner agrees", () => {
    const lines = [
      { productId: "house-blend", quantity: 1 },
      { productId: "decaf-colombia", quantity: 2 },
    ];
    expect(orderSummary(lines).shipping).toBe(0);
    expect(amountUntilFreeShipping(lines)).toBe(0);
  });

  it("charges shipping when a discount drops the order below $50 and the banner agrees", () => {
    const lines = [
      { productId: "pour-over-kit", quantity: 1 },
      { productId: "house-blend", quantity: 1 },
    ];
    const brew20 = findDiscount("BREW20");
    expect(orderSummary(lines, brew20).shipping).toBe(FLAT_SHIPPING);
    expect(amountUntilFreeShipping(lines, brew20)).toBeGreaterThan(0);
  });
});

describe("formatPrice", () => {
  it("formats cents as dollars", () => {
    expect(formatPrice(5999)).toBe("$59.99");
  });
});
