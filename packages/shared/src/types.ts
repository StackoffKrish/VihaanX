/** Monetary amounts are integer paise; never use floating-point rupees. */
export type Paise = number & { readonly __unit: 'integer-paise' };
export function paise(value: number): Paise {
  if (!Number.isSafeInteger(value)) throw new Error('Paise must be a safe integer');
  return value as Paise;
}
export type Colony = { id: string; name: string; city: string };
export type User = { id: string; colony_id: string; name: string; role: 'customer' | 'kirana' | 'rider' };
export type Kirana = { id: string; colony_id: string; name: string; owner_id: string };
export type Product = { id: string; colony_id: string; kirana_id: string; name: string; price_paise: Paise };
export type Order = { id: string; colony_id: string; customer_id: string; kirana_id: string; total_paise: Paise; status: 'draft' | 'placed' | 'delivered' };
export type Batch = { id: string; colony_id: string; rider_id: string; order_ids: string[]; status: 'pending' | 'in_progress' | 'delivered' };
export type LedgerEntry = { id: string; colony_id: string; user_id: string; amount_paise: Paise; kind: 'credit' | 'debit' };
export type Bill = { id: string; colony_id: string; customer_id: string; amount_paise: Paise; status: 'pending' | 'paid' | 'late' };
export type Vouch = { id: string; colony_id: string; voucher_id: string; vouchee_id: string; status: 'pending' | 'accepted' };
