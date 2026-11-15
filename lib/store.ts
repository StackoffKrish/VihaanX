
'use client';
import { useEffect, useState, useCallback } from 'react';
import { AppState, Order, Settlement } from './types';
import { seedState } from './seed';
import { calcFee } from './financial';

const KEY = 'fastkart_state_v1';

export function loadState(): AppState {
  if (typeof window === 'undefined') return seedState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { const s = seedState(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.products || !parsed.orders) return seedState();
    return parsed;
  } catch { return seedState(); }
}
export function saveState(s: AppState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); window.dispatchEvent(new Event('fastkart-update')); } catch {}
}
export function resetState(): AppState {
  const s = seedState();
  if (typeof window !== 'undefined') { localStorage.setItem(KEY, JSON.stringify(s)); window.dispatchEvent(new Event('fastkart-update')); }
  return s;
}

export function useFastKart() {
  const [state, setState] = useState<AppState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const refresh = useCallback(() => {
    setState(loadState());
    setLoaded(true);
  }, []);
  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) refresh(); };
    const onCustom = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener('fastkart-update', onCustom);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('fastkart-update', onCustom); };
  }, [refresh]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState(prev => {
      const base = prev ?? loadState();
      const next = fn(JSON.parse(JSON.stringify(base)) as AppState);
      saveState(next);
      return next;
    });
  }, []);

  const setCustomer = useCallback((c: AppState['customer']) => update(s => { s.customer = c; return s; }), [update]);
  const clearCart = useCallback(() => update(s => { s.cart = []; return s; }), [update]);

  return { state, loaded, refresh, update, setCustomer, clearCart, reset: () => { const s = resetState(); setState(s); } };
}

// Pure helpers for settlements
export function createSettlementForOrder(order: Order): Settlement {
  const fee = calcFee(order.subtotalPaise);
  return {
    id: `ST-${order.id}`,
    orderId: order.id,
    shopId: order.shopId,
    customerName: order.customerName,
    paymentMethod: order.paymentMethod,
    grossPaise: order.subtotalPaise,
    feePaise: fee,
    netPaise: order.subtotalPaise - fee,
    status: 'Settled',
    settledAt: new Date().toISOString(),
  };
}
export const ORDER_FLOW = ['Order received','Accepted by kirana','Preparing order','Ready for delivery','Out for delivery','Delivered'] as const;
export function nextStatus(current: string): string | null {
  const idx = ORDER_FLOW.indexOf(current as any);
  if (idx === -1 || idx === ORDER_FLOW.length-1) return null;
  return ORDER_FLOW[idx+1];
}
