# Fast Kart — Kirana Pay Later

Kirana ka udhar, ab digital Pay Later.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 for Customer App, http://localhost:3000/shopkeeper for Shopkeeper Dashboard.

## Deploy to Vercel
1. Push this folder to GitHub (or `vercel` CLI from this folder).
2. In Vercel: New Project → Import repo → Framework: Next.js (auto-detected).
3. Deploy — no environment variables needed.
4. No database, no paid APIs. Data persists in browser localStorage (`fastkart_state_v1`).

## How it works
- Customer signs up → pays ₹500 refundable deposit → gets ₹500 Pay Later limit.
- Order with Pay Later: dues ↑, available credit ↓. Order with UPI: no dues.
- Shopkeeper accepts → preparing → ready → out for delivery → delivered.
- On delivery, settlement is created automatically: Net = Gross − 1.5% fee. Shopkeeper is paid on delivery for both UPI and Pay Later.
- Customer repays monthly bill → dues → ₹0, credit restored. Deposit stays locked.
- All data persists in localStorage. Reset from shopkeeper footer.

## Money rules (paise-safe)
- Deposit is locked, never revenue, never spendable.
- Fee = 1.5% of gross. Net = Gross − Fee.
- One settlement per delivered order (idempotent — checked before creating).
- Repayment never creates a second settlement.
- Amounts stored as integer paise.

## Try the full journey
1. Customer App → sign up (or use seeded Rahul Sharma) → Pay ₹500 deposit.
2. Add items totalling ₹350 → Checkout → Pay Later → Available ₹150, Dues ₹350.
3. Shopkeeper → Orders → Accept → Start Preparing → Mark Ready → Out for Delivery → Mark Delivered.
4. Settlements → see Net ₹344.75 for a ₹350 order.
5. Customer → Account → Pay Bill ₹350 → Dues ₹0, Credit ₹500, Deposit still ₹500 locked.

## Structure
- app/page.tsx — Customer App
- app/shopkeeper/page.tsx — Shopkeeper Dashboard
- app/api/{products,orders,settlements,customers,repayments}/route.ts — API routes
- lib/store.ts — shared localStorage store + order flow
- lib/seed.ts — 42 products, Rahul Sharma, Sharma General Store, historical orders/settlements
- lib/financial.ts — paise-safe fee/net math
- lib/types.ts — Customer, Order, Settlement, Repayment, Product

## Acceptance checklist
Customer register, deposit, browse/search, cart, UPI + Pay Later checkout, limit enforced, shopkeeper receives orders, accept/prepare/ready/delivered, customer status updates, exactly one settlement on delivery, gross/fee/net visible, monthly dues view, repay restores credit, deposit untouched, persistence after refresh, mobile + desktop.
