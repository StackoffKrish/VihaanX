
'use client';
import { useMemo, useState } from 'react';
import { useFastKart, createSettlementForOrder, ORDER_FLOW, nextStatus } from '@/lib/store';
import { formatINR, formatINR2 } from '@/lib/types';
import { Store, Package, IndianRupee, Clock, Search, CheckCircle2, Truck, ChefHat, Bell, Plus, Minus, Eye, Home, Wallet, ShoppingBag, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Shopkeeper() {
  const { state, loaded, update, reset } = useFastKart();
  const [tab, setTab] = useState<'overview'|'orders'|'settlements'|'products'>('overview');
  const [orderFilter, setOrderFilter] = useState<'New Orders'|'Preparing'|'Ready'|'Completed'>('New Orders');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [editingPrice, setEditingPrice] = useState<Record<string,string>>({});
  const showToast = (t:string)=>{ setToast(t); setTimeout(()=>setToast(''),3200); };

  const todayStr = new Date().toDateString();
  const todaysOrders = useMemo(()=> (state?.orders ?? []).filter(o=> new Date(o.createdAt).toDateString()===todayStr), [state?.orders]);
  const todaysSales = todaysOrders.reduce((s,o)=>s+o.subtotalPaise,0);
  const pending = (state?.orders ?? []).filter(o=>o.status!=='Delivered').length;
  const totalGross = (state?.settlements ?? []).reduce((s,x)=>s+x.grossPaise,0);
  const totalFee = (state?.settlements ?? []).reduce((s,x)=>s+x.feePaise,0);
  const totalNet = (state?.settlements ?? []).reduce((s,x)=>s+x.netPaise,0);

  // Chart: last 5 settlements by day
  const chartData = useMemo(()=>{
    const byDay: Record<string, number> = {};
    (state?.settlements ?? []).forEach(s=>{ const d=new Date(s.settledAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}); byDay[d]=(byDay[d]||0)+s.netPaise/100; });
    return Object.entries(byDay).slice(0,6).map(([day, net])=>({day, net: Math.round(net)}));
  },[state?.settlements]);

  if (!loaded || !state) return <div className="min-h-screen bg-cream flex items-center justify-center"><p className="text-sm text-muted">Loading dashboard…</p></div>;

  const advanceOrder = (orderId:string) => {
    update(s=>{
      const o = s.orders.find(x=>x.id===orderId);
      if(!o) return s;
      const nxt = nextStatus(o.status);
      if(!nxt) { return s; }
      o.status = nxt as any;
      if (nxt==='Delivered') {
        o.deliveredAt = new Date().toISOString();
        const exists = s.settlements.find(x=>x.orderId===o.id);
        if(!exists){
          const st = createSettlementForOrder(o);
          s.settlements.unshift(st);
        }
      }
      return s;
    });
    showToast('Order status updated');
  };

  const filteredOrders = useMemo(()=>{
    let list = state.orders;
    if (orderFilter==='New Orders') list = list.filter(o=>['Order received','Accepted by kirana'].includes(o.status));
    if (orderFilter==='Preparing') list = list.filter(o=>o.status==='Preparing order');
    if (orderFilter==='Ready') list = list.filter(o=>['Ready for delivery','Out for delivery'].includes(o.status));
    if (orderFilter==='Completed') list = list.filter(o=>o.status==='Delivered');
    if (search) list = list.filter(o=> o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()));
    return list;
  },[state.orders, orderFilter, search]);

  const actionFor = (status:string) => {
    if (status==='Order received') return { label:'Accept Order', next:'Accepted by kirana' };
    if (status==='Accepted by kirana') return { label:'Start Preparing', next:'Preparing order' };
    if (status==='Preparing order') return { label:'Mark Ready', next:'Ready for delivery' };
    if (status==='Ready for delivery') return { label:'Out for Delivery', next:'Out for delivery' };
    if (status==='Out for delivery') return { label:'Mark Delivered', next:'Delivered' };
    return null;
  };

  const productsFiltered = state.products.filter(p=> !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2"><div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center text-white font-bold">F</div><div className="leading-none"><p className="font-bold text-[18px] tracking-tight">Fast Kart</p><p className="text-[10px] text-muted">Shopkeeper • Kirana Pay Later</p></div></div>
          <div className="hidden md:block ml-4"><p className="font-bold text-sm">Sharma General Store</p><p className="text-xs text-muted">Mandoli, Delhi • Owner: Ramesh Sharma</p></div>
          <div className="flex-1"/>
          <span className="text-xs bg-limeLight text-forest font-semibold px-2.5 py-1 rounded-full">● Open</span>
          <Link href="/" className="text-sm font-medium border border-border rounded-full px-3.5 py-2 bg-white">Customer App →</Link>
        </div>
        <nav className="max-w-7xl mx-auto px-4 md:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {([['overview','Overview'],['orders','Orders'],['settlements','Settlements'],['products','Products']] as const).map(([k,label])=>(
            <button key={k} onClick={()=>setTab(k)} className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${tab===k?'bg-forest text-white':'bg-white border border-border'}`}>{label}{k==='orders' && pending>0 && <span className="ml-1.5 bg-amber-400 text-charcoal text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pending}</span>}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {tab==='overview' && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight">Namaste, Ramesh ji</h1><p className="text-sm text-muted mt-1">Today • {new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long'})} • Mandoli, Delhi</p></div><button onClick={()=>setTab('orders')} className="bg-forest text-white px-4 py-2.5 rounded-full text-sm font-semibold">View New Orders →</button></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <div className="bg-white border border-border rounded-2xl p-5"><p className="text-xs text-muted">Today&apos;s Orders</p><p className="text-3xl font-bold mt-1">{todaysOrders.length}</p><p className="text-xs text-muted mt-1">Including earlier today</p></div>
              <div className="bg-white border border-border rounded-2xl p-5"><p className="text-xs text-muted">Today&apos;s Sales</p><p className="text-3xl font-bold mt-1">{formatINR(todaysSales)}</p><p className="text-xs text-muted mt-1">Gross order value</p></div>
              <div className="bg-white border border-border rounded-2xl p-5"><p className="text-xs text-muted">Total Settlements</p><p className="text-3xl font-bold mt-1">{formatINR(totalNet)}</p><p className="text-xs text-muted mt-1">{state.settlements.length} settled orders</p></div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5"><p className="text-xs text-amber-800">Pending Orders</p><p className="text-3xl font-bold mt-1">{pending}</p><p className="text-xs text-amber-800 mt-1">Need your action</p></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              <div className="lg:col-span-2 bg-forest text-white rounded-2xl p-6">
                <p className="text-lime text-xs font-bold tracking-widest">YOUR EARNINGS</p>
                <h2 className="text-xl font-bold mt-2">You get paid on delivery — for UPI and Pay Later both.</h2>
                <p className="text-white/80 text-sm mt-1">Fast Kart deducts a small fee for instant settlement and delivery services. Customer repayments happen separately — you don&apos;t wait for them.</p>
                <div className="bg-white/10 rounded-xl p-4 mt-4 grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-xs text-white/70">Order value</p><p className="font-bold text-lg">₹1,000</p></div>
                  <div><p className="text-xs text-white/70">Fast Kart fee (1.5%)</p><p className="font-bold text-lg">− ₹15</p></div>
                  <div className="bg-lime text-charcoal rounded-lg py-1"><p className="text-xs">You receive</p><p className="font-bold text-lg">₹985</p></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                  <div className="bg-white text-charcoal rounded-xl p-3"><p className="text-xs text-muted">Total gross</p><p className="font-bold">{formatINR(totalGross)}</p></div>
                  <div className="bg-white text-charcoal rounded-xl p-3"><p className="text-xs text-muted">Total fees</p><p className="font-bold">{formatINR(totalFee)}</p></div>
                  <div className="bg-lime text-charcoal rounded-xl p-3"><p className="text-xs">Net received</p><p className="font-bold">{formatINR(totalNet)}</p></div>
                </div>
              </div>
              <div className="bg-white border border-border rounded-2xl p-5">
                <p className="font-bold">Recent settlements</p><p className="text-xs text-muted">Net received per day</p>
                <div className="h-[180px] mt-3">{chartData.length>0 ? <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="day" fontSize={11}/><YAxis fontSize={11}/><Tooltip formatter={(v:any)=>[`₹${v}`, 'Net']}/><Bar dataKey="net" radius={[6,6,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={i===chartData.length-1 ? '#176B45' : '#C6E86B'}/>)}</Bar></BarChart></ResponsiveContainer> : <p className="text-sm text-muted">No settlements yet.</p>}</div>
                <button onClick={()=>setTab('settlements')} className="w-full mt-3 border border-forest text-forest font-semibold py-2.5 rounded-full text-sm">View Settlement Details →</button>
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5 mt-4">
              <div className="flex justify-between"><h3 className="font-bold">Orders needing action</h3><button onClick={()=>setTab('orders')} className="text-sm text-forest font-semibold">See all →</button></div>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {state.orders.filter(o=>o.status!=='Delivered').slice(0,4).map(o=>(
                  <div key={o.id} className="border border-border rounded-xl p-4 flex justify-between gap-3"><div><p className="font-bold text-sm">Order {o.id} • {o.customerName}</p><p className="text-xs text-muted mt-0.5">{o.items.map(i=>`${i.name} × ${i.qty}`).join(', ')}</p><p className="text-sm font-bold mt-1">{formatINR(o.subtotalPaise)} • {o.paymentMethod}</p></div><span className="text-xs bg-amber-50 border border-amber-100 text-amber-800 px-2 py-1 rounded-full h-fit">{o.status}</span></div>
                ))}
                {state.orders.filter(o=>o.status!=='Delivered').length===0 && <p className="text-sm text-muted">All caught up. No pending orders.</p>}
              </div>
            </div>
          </>
        )}

        {tab==='orders' && (
          <>
            <div className="flex flex-wrap gap-3 items-center justify-between"><div><h2 className="text-xl font-bold">Orders</h2><p className="text-sm text-muted">Accept, prepare and mark delivered. Customer sees updates instantly.</p></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search order or customer" className="pl-9 pr-3 py-2.5 border border-border rounded-full text-sm bg-white outline-none focus:border-forest"/></div></div>
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {(['New Orders','Preparing','Ready','Completed'] as const).map(f=>(
                <button key={f} onClick={()=>setOrderFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${orderFilter===f?'bg-charcoal text-white border-charcoal':'bg-white border-border'}`}>{f} <span className="ml-1 text-xs opacity-70">({f==='New Orders'? state.orders.filter(o=>['Order received','Accepted by kirana'].includes(o.status)).length : f==='Preparing'? state.orders.filter(o=>o.status==='Preparing order').length : f==='Ready'? state.orders.filter(o=>['Ready for delivery','Out for delivery'].includes(o.status)).length : state.orders.filter(o=>o.status==='Delivered').length})</span></button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {filteredOrders.map(o=>{
                const act = actionFor(o.status);
                return (
                  <div key={o.id} className="bg-white border border-border rounded-2xl p-5">
                    <div className="flex justify-between gap-2"><div><p className="font-bold">Order {o.id}</p><p className="text-xs text-muted">{o.customerName} • {new Date(o.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})} • {o.phone}</p></div><span className={`text-xs font-semibold px-2.5 py-1 rounded-full h-fit ${o.status==='Delivered'?'bg-limeLight text-forest':'bg-amber-50 text-amber-800 border border-amber-100'}`}>{o.status}</span></div>
                    <div className="mt-3 space-y-1.5 text-sm">{o.items.map((it,i)=>(<div key={i} className="flex justify-between"><span className="truncate">{it.name} <span className="text-muted">• {it.pack}</span></span><span>× {it.qty} • {formatINR(it.pricePaise*it.qty)}</span></div>))}</div>
                    <div className="flex justify-between pt-3 mt-3 border-t border-border text-sm"><span className="text-muted">{o.paymentMethod} • {o.address}</span><b>{formatINR(o.subtotalPaise)}</b></div>
                    {o.status!=='Delivered' && act && <div className="flex gap-2 mt-4"><button onClick={()=>advanceOrder(o.id)} className="flex-1 bg-forest text-white py-3 rounded-xl font-semibold text-sm">{act.label} →</button><button onClick={()=>{ if(confirm('Mark this order as delivered? This will create the settlement.')) advanceOrder(o.id); }} className="px-3 py-3 border border-border rounded-xl text-xs font-medium">Quick deliver</button></div>}
                    {o.status==='Delivered' && <p className="mt-3 text-xs text-forest font-semibold flex items-center gap-1"><CheckCircle2 size={14}/> Delivered • Settlement created • Net {formatINR2((state.settlements.find(s=>s.orderId===o.id)?.netPaise ?? 0))}</p>}
                    <div className="flex gap-1 mt-3">{ORDER_FLOW.map((s,idx)=>{ const cur=ORDER_FLOW.indexOf(o.status as any); const done=idx<=cur; return <div key={s} className={`h-1.5 flex-1 rounded-full ${done?'bg-forest':'bg-gray-200'}`}/> })}</div>
                  </div>
                );
              })}
              {filteredOrders.length===0 && <div className="md:col-span-2 bg-white border border-border rounded-2xl p-10 text-center"><Package className="mx-auto text-muted"/><p className="font-semibold mt-2">No orders in this view</p><p className="text-sm text-muted">New customer orders will appear here.</p></div>}
            </div>
          </>
        )}

        {tab==='settlements' && (
          <>
            <h2 className="text-xl font-bold">Settlements</h2><p className="text-sm text-muted mt-1">You are paid on delivery — for UPI and Pay Later both. Customer repayments happen separately.</p>
            <div className="bg-forest text-white rounded-2xl p-6 mt-4 grid md:grid-cols-4 gap-4">
              <div><p className="text-white/70 text-xs">Total gross order value</p><p className="text-2xl font-bold mt-1">{formatINR(totalGross)}</p></div>
              <div><p className="text-white/70 text-xs">Total Fast Kart fees (1.5%)</p><p className="text-2xl font-bold mt-1">− {formatINR(totalFee)}</p></div>
              <div className="bg-lime text-charcoal rounded-xl p-3"><p className="text-xs">Total net settlements</p><p className="text-2xl font-bold mt-1">{formatINR(totalNet)}</p></div>
              <div><p className="text-white/70 text-xs">Settled orders</p><p className="text-2xl font-bold mt-1">{state.settlements.length}</p><p className="text-xs text-white/70">Deposit is never counted as revenue</p></div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5 mt-4">
              <h3 className="font-bold">Settlement Details</h3><p className="text-sm text-muted mt-1">Example: Customer order ₹500 → Fee ₹7.50 → Net ₹492.50. Every delivered order creates exactly one settlement.</p>
              <div className="overflow-x-auto mt-4"><table className="w-full text-sm min-w-[640px]"><thead><tr className="text-left text-xs text-muted border-b border-border"><th className="py-2">Order ID</th><th>Customer</th><th>Order Amount</th><th>Fee</th><th>Net Received</th><th>Status</th></tr></thead><tbody>{state.settlements.map(s=>(<tr key={s.id} className="border-b border-border last:border-0"><td className="py-3 font-semibold">{s.orderId}</td><td>{s.customerName}<span className="block text-xs text-muted">{s.paymentMethod}</span></td><td>{formatINR2(s.grossPaise)}</td><td>{formatINR2(s.feePaise)}</td><td className="font-bold">{formatINR2(s.netPaise)}</td><td><span className="bg-limeLight text-forest text-xs font-semibold px-2 py-1 rounded-full">Settled • {new Date(s.settledAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span></td></tr>))}</tbody></table></div>
              {state.settlements.length===0 && <p className="text-sm text-muted mt-3">No settlements yet. Deliver an order to create one.</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {state.settlements.slice(0,4).map(s=>(
                <div key={s.id} className="bg-white border border-border rounded-2xl p-5"><p className="font-bold">Settlement for {s.orderId}</p><p className="text-xs text-muted">{s.customerName} • {s.paymentMethod} • {new Date(s.settledAt).toLocaleString('en-IN')}</p><div className="space-y-1.5 text-sm mt-3"><div className="flex justify-between"><span className="text-muted">Gross order value</span><span>{formatINR2(s.grossPaise)}</span></div><div className="flex justify-between"><span className="text-muted">Settlement fee (1.5%)</span><span>− {formatINR2(s.feePaise)}</span></div><div className="flex justify-between font-bold pt-2 border-t border-border"><span>Net kirana settlement</span><span className="text-forest">{formatINR2(s.netPaise)}</span></div></div></div>
              ))}
            </div>
          </>
        )}

        {tab==='products' && (
          <>
            <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold">Products</h2><p className="text-sm text-muted">Change price, stock or availability. Customer app updates instantly.</p></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products" className="pl-9 pr-3 py-2.5 border border-border rounded-full text-sm bg-white outline-none focus:border-forest"/></div></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {productsFiltered.map(p=>(
                <div key={p.id} className="bg-white border border-border rounded-2xl p-4 flex gap-3"><img src={p.image} className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{p.name}</p><p className="text-xs text-muted">{p.category} • {p.pack}</p><div className="flex items-center gap-2 mt-2"><span className="text-sm">₹</span><input value={editingPrice[p.id] ?? (p.pricePaise/100).toString()} onChange={e=>setEditingPrice({...editingPrice, [p.id]: e.target.value})} onBlur={()=>{ const v=parseFloat(editingPrice[p.id]||''); if(!isNaN(v) && v>0){ update(s=>{ const prod=s.products.find(x=>x.id===p.id); if(prod) prod.pricePaise=Math.round(v*100); return s; }); showToast('Price updated'); } }} className="w-20 border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-forest"/><span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${p.stock>0?'bg-limeLight text-forest':'bg-red-50 text-red-700'}`}>{p.stock>0?'Available':'Unavailable'}</span></div><div className="flex items-center gap-2 mt-2"><span className="text-xs text-muted">Stock:</span><button onClick={()=>update(s=>{ const prod=s.products.find(x=>x.id===p.id); if(prod) prod.stock=Math.max(0, prod.stock-1); return s; })} className="w-7 h-7 border border-border rounded-full flex items-center justify-center"><Minus size={13}/></button><span className="text-sm font-bold w-6 text-center">{p.stock}</span><button onClick={()=>update(s=>{ const prod=s.products.find(x=>x.id===p.id); if(prod) prod.stock+=1; return s; })} className="w-7 h-7 border border-border rounded-full flex items-center justify-center"><Plus size={13}/></button><button onClick={()=>update(s=>{ const prod=s.products.find(x=>x.id===p.id); if(prod) prod.stock = prod.stock>0?0:10; return s; })} className="ml-auto text-xs font-semibold text-forest underline">{p.stock>0?'Mark unavailable':'Make available'}</button></div></div></div>
              ))}
            </div>
          </>
        )}
      </main>
      <footer className="max-w-7xl mx-auto px-4 md:px-6 pb-8 text-center text-xs text-muted">
        <p>Fast Kart • Sharma General Store • Mandoli, Delhi • Settlement fee 1.5% • Deposit never counted as revenue</p>
        <button onClick={()=>{ if(confirm('Reset all data to initial values?')){ reset(); showToast('Data reset'); } }} className="underline mt-2">Reset Data</button>
      </footer>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white px-4 py-2.5 rounded-full text-sm shadow-xl flex items-center gap-2"><CheckCircle2 size={16} className="text-lime"/>{toast}</div>}
    </div>
  );
}
