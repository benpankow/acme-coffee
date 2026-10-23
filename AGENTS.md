# Agent notes

- Next.js App Router app. Pricing logic is in `lib/pricing.ts`, the store UI in `components/store.tsx`.
- Prices are integers in cents. Format them only at display time with `formatPrice`.
- Run `npm test` for the pricing tests and `npm run typecheck` before opening a pull request.
- Shipping policy: free shipping on orders of $50 or more, after discounts.
