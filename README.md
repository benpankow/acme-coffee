# Acme Coffee

A small Next.js storefront for a coffee roaster: a product grid, a cart with discount codes, and an order summary with shipping and tax.

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # pricing unit tests
```

Pricing lives in `lib/pricing.ts`. Shipping policy: free shipping on orders of $50 or more, after discounts; otherwise a flat $5.99. Discount codes: `WELCOME10` (10% off) and `BREW20` (20% off).
