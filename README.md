# Fast Kart — Kirana Pay Later

Kirana ka udhar, ab digital Pay Later.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 for Customer App, http://localhost:3000/shopkeeper for Shopkeeper Dashboard.

## Deploy to Vercel
1. Push this folder to GitHub.
2. Import in Vercel (Framework: Next.js).
3. Deploy — no env vars needed.

## How it works
- Customer signs up → pays ₹500 refundable deposit → gets ₹500 Pay Later limit.
- Order with Pay Later: dues ↑, available credit ↓. Order with UPI: no dues.
- Shopkeeper accepts → preparing → ready → out for delivery → delivered.
- On delivery, settlement is created automatically: Net = Gross − 1.5% fee. Shopkeeper is paid on delivery for both UPI and Pay Later.
- Customer repays monthly bill → dues → ₹0, credit restored. Deposit stays locked.
- All data persists in localStorage under `fastkart_state_v1`. Reset from shopkeeper footer.

## Money rules (paise-safe)
- Deposit is locked, never revenue, never spendable.
- Fee = 1.5% of gross. Net = Gross − Fee.
- One settlement per delivered order (idempotent).
- Repayment never creates a second settlement.
