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
});

describe("formatPrice", () => {
  it("formats cents as dollars", () => {
    expect(formatPrice(5999)).toBe("$59.99");
  });
});
