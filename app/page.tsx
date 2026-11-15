
'use client';
import { useMemo, useState } from 'react';
import { useFastKart, ORDER_FLOW } from '@/lib/store';
import { formatINR } from '@/lib/types';
import { CATEGORIES } from '@/lib/seed';
import { Search, MapPin, ShoppingCart, Plus, Minus, Trash2, User, Package, CreditCard, ShieldCheck, Truck, CheckCircle2, X, ChevronRight, Store, Wallet, Clock, Home, Sparkles, ArrowRight, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

export default function CustomerApp() {
  const { state, loaded, update, reset } = useFastKart();
  const [view, setView] = useState<'home'|'orders'|'account'>('home');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<'UPI'|'Pay Later'>('Pay Later');
  const [toast, setToast] = useState('');
  const [onboarding, setOnboarding] = useState({ name:'', phone:'', address:'', house:'' });
  const [depositAmt, setDepositAmt] = useState(500);
  const [paying, setPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string|null>(null);
  const [showPayBill, setShowPayBill] = useState(false);

  const showToast = (t:string) => { setToast(t); setTimeout(()=>setToast(''), 3200); };

  const products = state?.products ?? [];
  const cart = state?.cart ?? [];
  const cartDetailed = cart.map(c => ({ ...c, product: products.find(p=>p.id===c.productId)! })).filter(x=>x.product);
  const subtotal = cartDetailed.reduce((s,i)=> s + i.product.pricePaise*i.qty, 0);
  const cartCount = cartDetailed.reduce((s,i)=>s+i.qty,0);

  const filtered = useMemo(()=>{
    return products.filter(p=>{
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchC = cat==='All' || p.category===cat;
      return matchQ && matchC;
    });
  },[products, search, cat]);

  const popular = products.filter(p=>p.popular).slice(0,8);
  const daily = products.filter(p=>['Dairy','Atta & Rice','Beverages'].includes(p.category)).slice(0,8);
  const recentIds = useMemo(()=>{
    const ids:string[]=[];
    (state?.orders ?? []).forEach(o=> o.items.forEach(it=>{ if(!ids.includes(it.productId)) ids.push(it.productId); }));
    return ids;
  },[state?.orders]);
  const recent = products.filter(p=>recentIds.includes(p.id)).slice(0,8);

  if (!loaded || !state) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-center"><div className="w-10 h-10 rounded-full bg-forest mx-auto animate-pulse"/><p className="mt-3 text-sm text-muted">Loading Fast Kart…</p></div></div>;

  // ONBOARDING
  if (!state.customer) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-md mx-auto px-5 pt-10 pb-16">
          <div className="flex items-center gap-2"><div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center text-white font-bold text-lg">F</div><span className="font-bold text-xl tracking-tight">Fast Kart</span><span className="text-[11px] bg-lime px-2 py-0.5 rounded-full font-semibold">Kirana Pay Later</span></div>
          <h1 className="text-[32px] leading-[1.15] font-bold mt-8 tracking-tight">Your neighbourhood kirana,<br/>now online.</h1>
          <p className="text-muted mt-3 text-[15px]">Order everyday essentials. Pay now or pay later.</p>
          <div className="grid grid-cols-3 gap-2 mt-6">
            {[{t:'500+ items',s:'Daily essentials'},{t:'30 min',s:'Delivery batches'},{t:'₹0 delivery',s:'From your kirana'}].map(x=>(
              <div key={x.t} className="bg-white border border-border rounded-xl p-3"><p className="font-bold text-sm">{x.t}</p><p className="text-[11px] text-muted mt-0.5">{x.s}</p></div>
            ))}
          </div>
          <div className="bg-white border border-border rounded-2xl p-5 mt-5 space-y-3">
            <p className="font-semibold">Let&apos;s set up your account</p>
            <input value={onboarding.name} onChange={e=>setOnboarding({...onboarding, name:e.target.value})} placeholder="Full name — e.g. Rahul Sharma" className="w-full border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-forest bg-white"/>
            <input value={onboarding.phone} onChange={e=>setOnboarding({...onboarding, phone:e.target.value})} placeholder="Mobile number" className="w-full border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-forest"/>
            <input value={onboarding.address} onChange={e=>setOnboarding({...onboarding, address:e.target.value})} placeholder="Colony / delivery address — e.g. Mandoli, Delhi" className="w-full border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-forest"/>
            <input value={onboarding.house} onChange={e=>setOnboarding({...onboarding, house:e.target.value})} placeholder="Apartment or house number" className="w-full border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-forest"/>
            <button onClick={()=>{
              if(!onboarding.name.trim()||!onboarding.phone.trim()||!onboarding.address.trim()){ showToast('Please fill name, mobile and address'); return; }
              update(s=>{ s.customer={ id:'cust-'+Date.now(), name:onboarding.name.trim(), phone:onboarding.phone.trim(), address:onboarding.address.trim(), house:onboarding.house.trim(), depositPaise:0, depositPaid:false, payLaterLimitPaise:0, availableCreditPaise:0, outstandingPaise:0, trustScore:72, joinedAt:new Date().toISOString() }; return s; });
            }} className="w-full bg-forest text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">Continue <ArrowRight size={16}/></button>
            <p className="text-[11px] text-muted text-center">No KYC needed. Your deposit is refundable.</p>
          </div>
          <p className="text-center text-xs text-muted mt-6"><Link href="/shopkeeper" className="underline">Shopkeeper Login →</Link></p>
        </div>
        {toast && <Toast msg={toast}/>}
      </div>
    );
  }

  // DEPOSIT
  if (!state.customer.depositPaid) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-md mx-auto px-5 pt-8 pb-16">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center text-white font-bold">F</div><span className="font-bold text-lg">Fast Kart</span></div><span className="text-xs bg-white border px-2.5 py-1 rounded-full">Hi, {state.customer.name.split(' ')[0]}</span></div>
          <h1 className="text-[28px] font-bold leading-tight mt-7 tracking-tight">Activate your<br/>Pay Later account</h1>
          <p className="text-muted text-sm mt-2">One refundable deposit unlocks Pay Later, free delivery and your trust score.</p>
          <div className="bg-white border border-border rounded-2xl p-5 mt-5">
            <p className="text-xs font-semibold tracking-wide text-muted">CHOOSE DEPOSIT</p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[500,1000,2000].map(v=>(
                <button key={v} onClick={()=>setDepositAmt(v)} className={`py-3 rounded-xl border text-sm font-bold ${depositAmt===v?'bg-forest text-white border-forest':'bg-white border-border'}`}>₹{v.toLocaleString('en-IN')}{v===500 && <span className="block text-[10px] font-medium opacity-80">Most popular</span>}</button>
              ))}
            </div>
            <div className="bg-cream rounded-xl p-3.5 mt-4 text-sm leading-relaxed text-charcoal/80">Your deposit stays with Fast Kart as security for your Pay Later account. It is refundable when all outstanding bills are cleared.</div>
            <div className="space-y-2.5 mt-4">
              {[{icon:<ShieldCheck size={18} className="text-forest"/>, t:'Unlock Pay Later', s:'Shop now, pay on your monthly bill.'},{icon:<Truck size={18} className="text-forest"/>, t:'Free neighbourhood delivery', s:'₹0 delivery from Sharma General Store.'},{icon:<Sparkles size={18} className="text-forest"/>, t:'Build your trust score', s:'Timely repayments increase your limit over time.'}].map(x=>(
                <div key={x.t} className="flex gap-3"><div className="w-8 h-8 bg-limeLight rounded-full flex items-center justify-center shrink-0">{x.icon}</div><div><p className="font-semibold text-sm">{x.t}</p><p className="text-xs text-muted">{x.s}</p></div></div>
              ))}
            </div>
            <div className="flex justify-between text-sm mt-5 pt-4 border-t border-border"><span className="text-muted">Deposit</span><span className="font-bold">{formatINR(depositAmt*100)}</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-muted">Pay Later limit you get</span><span className="font-bold text-forest">₹{depositAmt.toLocaleString('en-IN')}</span></div>
            <button disabled={paying} onClick={()=>{
              setPaying(true); setTimeout(()=>{
                update(s=>{ if(s.customer){ s.customer.depositPaise=depositAmt*100; s.customer.depositPaid=true; s.customer.payLaterLimitPaise=depositAmt*100; s.customer.availableCreditPaise=depositAmt*100; s.customer.outstandingPaise=0; } return s; });
                setPaying(false); showToast(`Deposit received. Pay Later activated — ₹${depositAmt} limit`);
              }, 1100);
            }} className="w-full bg-forest text-white py-3.5 rounded-xl font-semibold text-sm mt-5 disabled:opacity-60">{paying ? 'Processing UPI payment…' : `Pay ₹${depositAmt.toLocaleString('en-IN')} & Activate`}</button>
            <p className="text-[11px] text-muted text-center mt-2.5">Secure UPI • Refundable • Never counted as spendable balance</p>
          </div>
        </div>
        {toast && <Toast msg={toast}/>}
      </div>
    );
  }

  const cust = state.customer;
  const addToCart = (id:string) => update(s=>{ const ex=s.cart.find(c=>c.productId===id); if(ex) ex.qty+=1; else s.cart.push({productId:id, qty:1}); return s; });
  const changeQty = (id:string, delta:number) => update(s=>{ const ex=s.cart.find(c=>c.productId===id); if(!ex) return s; ex.qty+=delta; if(ex.qty<=0) s.cart=s.cart.filter(c=>c.productId!==id); return s; });
  const removeItem = (id:string) => update(s=>{ s.cart=s.cart.filter(c=>c.productId!==id); return s; });

  const placeOrder = () => {
    if (cartDetailed.length===0) return;
    if (payMethod==='Pay Later' && subtotal > cust.availableCreditPaise) { showToast(`Not enough Pay Later credit. Available ${formatINR(cust.availableCreditPaise)}`); return; }
    const nextId = (state.lastOrderId||1005)+1;
    const orderId = 'FK'+nextId;
    update(s=>{
      const items = cartDetailed.map(i=>({ productId:i.product.id, name:i.product.name, pack:i.product.pack, pricePaise:i.product.pricePaise, qty:i.qty, image:i.product.image }));
      const order = { id:orderId, customerId:s.customer!.id, customerName:s.customer!.name, shopId:'shop-1', items, subtotalPaise: subtotal, paymentMethod: payMethod, status:'Order received' as const, createdAt:new Date().toISOString(), address:`${s.customer!.house}, ${s.customer!.address}`, phone:s.customer!.phone };
      s.orders.unshift(order as any);
      s.lastOrderId = nextId;
      if (payMethod==='Pay Later') { s.customer!.availableCreditPaise -= subtotal; s.customer!.outstandingPaise += subtotal; }
      s.cart=[];
      return s;
    });
    setCheckoutOpen(false); setCartOpen(false); setOrderSuccess(orderId); setView('orders'); showToast('Order placed successfully!');
  };

  const payBill = () => {
    if (cust.outstandingPaise<=0) { showToast('No outstanding dues'); return; }
    const amt = cust.outstandingPaise;
    update(s=>{ if(s.customer){ s.customer.outstandingPaise=0; s.customer.availableCreditPaise=s.customer.payLaterLimitPaise; s.customer.trustScore=Math.min(100, s.customer.trustScore+3); s.repayments.unshift({ id:'RP-'+Date.now(), customerId:s.customer.id, amountPaise:amt, date:new Date().toISOString(), status:'Completed', method:'UPI' }); } return s; });
    setShowPayBill(false); showToast(`Bill of ${formatINR(amt)} paid. Credit restored.`);
  };

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0"><div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center text-white font-bold text-lg">F</div><div className="leading-none"><p className="font-bold tracking-tight text-[18px]">Fast Kart</p><p className="text-[10px] text-muted hidden sm:block">Kirana ka udhar, ab digital</p></div></div>
            <div className="hidden md:flex items-center gap-1.5 text-sm ml-4"><MapPin size={16} className="text-forest"/><span className="font-medium truncate max-w-[220px]">{cust.house ? `${cust.house}, ` : ''}{cust.address}</span><span className="text-muted text-xs">• Delivery in 30 min batches</span></div>
            <div className="flex-1" />
            <div className="hidden md:flex items-center gap-2 bg-white border border-border rounded-full px-3 py-1.5 text-xs"><Wallet size={14} className="text-forest"/><span>Pay Later <b>{formatINR(cust.availableCreditPaise)}</b> available</span><span className="text-muted">• Dues {formatINR(cust.outstandingPaise)}</span></div>
            <button onClick={()=>setView('account')} className="w-9 h-9 bg-white border border-border rounded-full flex items-center justify-center"><User size={18}/></button>
            <button onClick={()=>setCartOpen(true)} className="relative bg-forest text-white px-3.5 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5"><ShoppingCart size={16}/> Cart {cartCount>0 && <span className="bg-lime text-charcoal text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}</button>
          </div>
          <div className="md:hidden flex items-center gap-1.5 text-xs mt-2 text-muted"><MapPin size={13} className="text-forest"/><span className="truncate">{cust.house}, {cust.address}</span></div>
          {/* Search */}
          <div className="relative mt-3">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"/>
            <input value={search} onChange={e=>{setSearch(e.target.value); setView('home');}} placeholder="Search atta, dal, Maggi, milk…" className="w-full bg-white border border-border rounded-full pl-10 pr-4 py-3 text-sm outline-none focus:border-forest"/>
          </div>
          {/* Nav */}
          <div className="flex gap-1 mt-3">
            {([['home','Home'],['orders','Orders'],['account','Account']] as const).map(([k,label])=>(
              <button key={k} onClick={()=>setView(k)} className={`px-4 py-2 rounded-full text-sm font-medium ${view===k?'bg-charcoal text-white':'bg-white border border-border'}`}>{label}{k==='orders' && state.orders.length>0 && <span className="ml-1.5 bg-lime text-charcoal text-[10px] px-1.5 py-0.5 rounded-full font-bold">{state.orders.length}</span>}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-5">
        {view==='home' && (
          <>
            {/* Pay Later banner */}
            <div className="bg-forest text-white rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1"><p className="text-lime text-xs font-bold tracking-widest">PAY LATER • {cust.name}</p><h2 className="text-xl md:text-2xl font-bold mt-1 tracking-tight">Available Pay Later limit — {formatINR(cust.availableCreditPaise)}</h2><p className="text-white/80 text-sm mt-1">Outstanding dues {formatINR(cust.outstandingPaise)} • Deposit {formatINR(cust.depositPaise)} locked & refundable • Trust score {cust.trustScore}</p></div>
              <div className="flex gap-2"><button onClick={()=>setView('account')} className="bg-white text-charcoal px-4 py-2.5 rounded-full text-sm font-semibold">View Bill</button><button onClick={()=>setView('orders')} className="bg-lime text-charcoal px-4 py-2.5 rounded-full text-sm font-semibold">Track Order</button></div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <div className="flex items-center justify-between"><h3 className="font-bold">Shop by category</h3><span className="text-xs text-muted">{filtered.length} items</span></div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
                {['All', ...CATEGORIES].map(c=>(
                  <button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${cat===c?'bg-forest text-white border-forest':'bg-white border-border'}`}>{c}</button>
                ))}
              </div>
            </div>

            {search || cat!=='All' ? (
              <section className="mt-5">
                <h3 className="font-bold mb-3">{search ? `Results for “${search}”` : cat} <span className="text-muted font-normal text-sm">• {filtered.length} products</span></h3>
                <ProductGrid products={filtered} cart={cart} onAdd={addToCart} onChange={changeQty}/>
                {filtered.length===0 && <div className="bg-white border border-border rounded-2xl p-10 text-center"><p className="font-semibold">No products found</p><p className="text-sm text-muted mt-1">Try atta, dal, milk or Maggi.</p><button onClick={()=>{setSearch(''); setCat('All');}} className="mt-4 bg-forest text-white px-4 py-2 rounded-full text-sm">Show all</button></div>}
              </section>
            ) : (
              <>
                <Section title="Popular in your colony" subtitle="Most ordered in Mandoli this week"><ProductGrid products={popular} cart={cart} onAdd={addToCart} onChange={changeQty}/></Section>
                <Section title="Daily essentials" subtitle="Milk, atta, oil & tea — everyday staples"><ProductGrid products={daily} cart={cart} onAdd={addToCart} onChange={changeQty}/></Section>
                {recent.length>0 && <Section title="Recently ordered" subtitle="Order again in one tap"><ProductGrid products={recent} cart={cart} onAdd={addToCart} onChange={changeQty}/></Section>}
                <Section title="All products" subtitle="From Sharma General Store"><ProductGrid products={products} cart={cart} onAdd={addToCart} onChange={changeQty}/></Section>
              </>
            )}

            <div className="bg-white border border-border rounded-2xl p-5 mt-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Store className="text-forest shrink-0"/><div className="flex-1"><p className="font-bold">Sharma General Store • Mandoli, Delhi</p><p className="text-sm text-muted">Your neighbourhood kirana. Free delivery. Pay Later accepted. Open now.</p></div><span className="text-xs bg-limeLight text-forest font-semibold px-2.5 py-1 rounded-full">● Open • 30 min batches</span>
            </div>
          </>
        )}

        {view==='orders' && (
          <div>
            <h2 className="text-xl font-bold tracking-tight">Your orders</h2><p className="text-sm text-muted mt-1">Status updates from your kirana appear here.</p>
            {orderSuccess && <div className="bg-limeLight border border-lime rounded-2xl p-4 mt-4 flex gap-3"><CheckCircle2 className="text-forest shrink-0"/><div><p className="font-bold">Order placed successfully!</p><p className="text-sm text-muted">Order {orderSuccess} • Sharma General Store • Expected batch today, 6–8 PM</p></div><button onClick={()=>setOrderSuccess(null)} className="ml-auto"><X size={16}/></button></div>}
            <div className="space-y-4 mt-5">
              {state.orders.map(o=>(
                <div key={o.id} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex flex-wrap justify-between gap-2"><div><p className="font-bold">Order {o.id}</p><p className="text-xs text-muted flex items-center gap-1"><Clock size={12}/> {new Date(o.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})} • {o.paymentMethod}</p></div><span className={`text-xs font-semibold px-2.5 py-1 rounded-full h-fit ${o.status==='Delivered'?'bg-limeLight text-forest':'bg-amber-50 text-amber-800 border border-amber-100'}`}>{o.status}</span></div>
                  <div className="mt-3 space-y-1.5">{o.items.map((it,idx)=>(<div key={idx} className="flex items-center gap-3 text-sm"><img src={it.image} alt="" className="w-9 h-9 rounded-lg object-cover"/><span className="flex-1 truncate">{it.name} <span className="text-muted">• {it.pack}</span></span><span className="text-muted">× {it.qty}</span><span className="font-semibold w-16 text-right">{formatINR(it.pricePaise*it.qty)}</span></div>))}</div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-border text-sm"><span className="text-muted">Total • {o.address}</span><b>{formatINR(o.subtotalPaise)}</b></div>
                  {/* Timeline */}
                  <div className="flex gap-0 mt-4 overflow-x-auto no-scrollbar">
                    {ORDER_FLOW.map((s,idx)=>{
                      const cur = ORDER_FLOW.indexOf(o.status as any);
                      const done = idx <= cur;
                      return <div key={s} className="flex items-center shrink-0"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${done?'bg-forest text-white':'bg-gray-100 text-muted'}`}>{done?'✓':idx+1}</div><span className={`text-[11px] ml-1.5 mr-2 whitespace-nowrap ${done?'font-semibold':'text-muted'}`}>{s}</span>{idx<ORDER_FLOW.length-1 && <div className={`w-5 h-[2px] mr-2 ${idx<cur?'bg-forest':'bg-gray-200'}`}/>}</div>;
                    })}
                  </div>
                  <p className="text-xs text-muted mt-3">Expected delivery batch: Today, 6–8 PM • Free delivery from your neighbourhood kirana.</p>
                </div>
              ))}
              {state.orders.length===0 && <Empty title="No orders yet" sub="Your orders from Sharma General Store will appear here."/>}
            </div>
          </div>
        )}

        {view==='account' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border border-border rounded-2xl p-5">
                <div className="flex gap-3"><div className="w-12 h-12 bg-forest text-white rounded-full flex items-center justify-center font-bold text-lg">{cust.name.charAt(0)}</div><div><p className="font-bold text-lg">{cust.name}</p><p className="text-sm text-muted">{cust.phone} • {cust.house}, {cust.address}</p></div><span className="ml-auto text-xs bg-limeLight text-forest font-semibold px-2 py-1 rounded-full h-fit">Trust score {cust.trustScore}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Security deposit" value={formatINR(cust.depositPaise)} sub="Locked • Refundable"/>
                <Stat label="Total Pay Later limit" value={formatINR(cust.payLaterLimitPaise)} sub="Based on deposit"/>
                <Stat label="Available credit" value={formatINR(cust.availableCreditPaise)} sub="Ready to use" accent/>
                <Stat label="Outstanding dues" value={formatINR(cust.outstandingPaise)} sub="Pay by 5th of month"/>
              </div>
              <div className="bg-white border border-border rounded-2xl p-5">
                <div className="flex justify-between items-start"><div><h3 className="font-bold">Monthly bill</h3><p className="text-sm text-muted mt-1">Bill generated: 1st of every month • Due date: 5th • Grace period ends: 8th</p></div><span className="text-xs bg-cream border border-border px-2 py-1 rounded-full">This month</span></div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mt-4 bg-cream rounded-xl p-4"><div><p className="text-xs text-muted">Amount due</p><p className="text-2xl font-bold">{formatINR(cust.outstandingPaise)}</p></div><button disabled={cust.outstandingPaise<=0} onClick={()=>setShowPayBill(true)} className="bg-forest text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-40">{cust.outstandingPaise>0 ? 'Pay Bill' : 'All clear ✓'}</button></div>
                {showPayBill && <div className="mt-3 border border-border rounded-xl p-4"><p className="font-semibold text-sm">Pay {formatINR(cust.outstandingPaise)} via UPI</p><p className="text-xs text-muted mt-1">Payment will reduce your dues and restore your Pay Later credit. It does not create a second settlement for the shopkeeper.</p><div className="flex gap-2 mt-3"><button onClick={payBill} className="bg-forest text-white px-4 py-2 rounded-full text-sm font-semibold">Confirm UPI Payment</button><button onClick={()=>setShowPayBill(false)} className="px-4 py-2 rounded-full text-sm border border-border">Cancel</button></div></div>}
                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-wide text-muted mb-2">REPAYMENT HISTORY</p>
                  {state.repayments.length===0 ? <p className="text-sm text-muted">No repayments yet.</p> : state.repayments.map(r=>(
                    <div key={r.id} className="flex justify-between py-2.5 border-b border-border last:border-0 text-sm"><span>{new Date(r.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} • {r.method}</span><span className="font-semibold">{formatINR(r.amountPaise)} <span className="text-forest text-xs font-medium ml-1">Completed</span></span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-forest text-white rounded-2xl p-5"><p className="text-lime text-xs font-bold tracking-widest">FAST KART</p><p className="font-bold mt-1">How Pay Later works</p><ul className="text-sm text-white/85 space-y-2 mt-3 list-disc pl-4"><li>Shop now, pay on your monthly bill.</li><li>Shopkeeper is paid on delivery — you repay Fast Kart later.</li><li>Timely repayment builds trust score.</li></ul></div>
              <div className="bg-white border border-border rounded-2xl p-5"><p className="font-bold text-sm">Need help?</p><p className="text-sm text-muted mt-1">Visit Sharma General Store or call 98765 43210 for bill questions.</p><button onClick={()=>{ if(confirm('Reset all data to initial seeded values?')) reset(); }} className="mt-4 text-xs text-muted underline">Reset data</button></div>
            </div>
          </div>
        )}
      </main>

      {/* Floating cart */}
      {cartCount>0 && !cartOpen && view==='home' && (
        <button onClick={()=>setCartOpen(true)} className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-forest text-white pl-4 pr-2 py-2 rounded-full shadow-xl flex items-center gap-3 text-sm font-semibold"> <span>{cartCount} items • {formatINR(subtotal)}</span><span className="bg-lime text-charcoal px-3 py-1.5 rounded-full flex items-center gap-1">View Cart <ChevronRight size={14}/></span></button>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/40" onClick={()=>setCartOpen(false)}/><div className="absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-white"><p className="font-bold">Your cart • Sharma General Store</p><button onClick={()=>setCartOpen(false)}><X/></button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartDetailed.length===0 ? <Empty title="Cart is empty" sub="Add atta, dal, milk and more."/> : cartDetailed.map(i=>(
              <div key={i.productId} className="bg-white border border-border rounded-2xl p-3 flex gap-3"><img src={i.product.image} className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{i.product.name}</p><p className="text-xs text-muted">{i.product.pack} • {formatINR(i.product.pricePaise)} each</p><p className="font-bold text-sm mt-1">{formatINR(i.product.pricePaise*i.qty)}</p></div><div className="flex flex-col items-end justify-between"><button onClick={()=>removeItem(i.productId)} className="text-muted"><Trash2 size={16}/></button><div className="flex items-center gap-2 bg-cream border border-border rounded-full px-1 py-0.5"><button onClick={()=>changeQty(i.productId,-1)} className="w-6 h-6 flex items-center justify-center"><Minus size={14}/></button><span className="text-sm font-bold w-4 text-center">{i.qty}</span><button onClick={()=>changeQty(i.productId,1)} className="w-6 h-6 flex items-center justify-center"><Plus size={14}/></button></div></div></div>
            ))}
            <div className="bg-white border border-border rounded-2xl p-4 text-sm space-y-2"><div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold">{formatINR(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted">Delivery fee</span><span className="font-semibold text-forest">FREE</span></div><div className="flex justify-between"><span className="text-muted">Platform fee</span><span className="font-semibold">₹0</span></div><div className="flex justify-between pt-2 border-t border-border"><span className="font-bold">Order total</span><span className="font-bold">{formatINR(subtotal)}</span></div><p className="text-xs text-muted">Free delivery from your neighbourhood kirana.</p></div>
          </div>
          <div className="p-4 bg-white border-t border-border"><button disabled={cartDetailed.length===0} onClick={()=>setCheckoutOpen(true)} className="w-full bg-forest text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40">Proceed to Checkout • {formatINR(subtotal)}</button></div>
        </div></div>
      )}

      {/* Checkout */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/40" onClick={()=>setCheckoutOpen(false)}/><div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between"><h3 className="font-bold text-lg">Checkout</h3><button onClick={()=>setCheckoutOpen(false)}><X/></button></div>
          <p className="text-sm text-muted mt-1">Sharma General Store • {cartCount} items • {formatINR(subtotal)}</p>
          <p className="text-xs font-semibold tracking-wide text-muted mt-4 mb-2">PAYMENT METHOD</p>
          <div className="space-y-2">
            <button onClick={()=>setPayMethod('Pay Later')} className={`w-full text-left border rounded-2xl p-4 flex gap-3 ${payMethod==='Pay Later'?'border-forest bg-limeLight/40':'border-border'}`}><CreditCard className="text-forest shrink-0"/><div className="flex-1"><p className="font-semibold text-sm">Pay Later</p><p className="text-xs text-muted">Available {formatINR(cust.availableCreditPaise)} • Dues will become {formatINR(cust.outstandingPaise + subtotal)}</p>{payMethod==='Pay Later' && subtotal>cust.availableCreditPaise && <p className="text-xs text-red-600 font-semibold mt-1">Exceeds available credit by {formatINR(subtotal - cust.availableCreditPaise)}. Reduce cart or pay via UPI.</p>}</div><span className={`w-5 h-5 rounded-full border flex items-center justify-center ${payMethod==='Pay Later'?'bg-forest text-white border-forest':'border-gray-300'}`}>{payMethod==='Pay Later'?'✓':''}</span></button>
            <button onClick={()=>setPayMethod('UPI')} className={`w-full text-left border rounded-2xl p-4 flex gap-3 ${payMethod==='UPI'?'border-forest bg-limeLight/40':'border-border'}`}><Wallet className="text-forest shrink-0"/><div className="flex-1"><p className="font-semibold text-sm">Pay using UPI</p><p className="text-xs text-muted">Pay now. No dues added.</p></div><span className={`w-5 h-5 rounded-full border flex items-center justify-center ${payMethod==='UPI'?'bg-forest text-white border-forest':'border-gray-300'}`}>{payMethod==='UPI'?'✓':''}</span></button>
          </div>
          <div className="bg-cream rounded-xl p-3.5 text-sm mt-4 space-y-1"><div className="flex justify-between"><span className="text-muted">Delivery</span><span>Free</span></div><div className="flex justify-between font-bold"><span>Total to pay</span><span>{formatINR(subtotal)}</span></div><p className="text-xs text-muted">Deliver to: {cust.house}, {cust.address}</p></div>
          <button onClick={placeOrder} className="w-full bg-forest text-white py-3.5 rounded-xl font-semibold text-sm mt-4">Place Order • {formatINR(subtotal)}</button>
        </div></div>
      )}

      <footer className="max-w-6xl mx-auto px-4 md:px-6 mt-10 text-center text-xs text-muted">
        <p>Fast Kart • Kirana ka udhar, ab digital Pay Later. • Sharma General Store, Mandoli, Delhi</p>
        <Link href="/shopkeeper" className="underline mt-1 inline-block">Shopkeeper Login</Link>
      </footer>
      {toast && <Toast msg={toast}/>}
    </div>
  );
}

function Section({title, subtitle, children}:{title:string; subtitle:string; children:React.ReactNode}) {
  return <section className="mt-8"><h3 className="font-bold">{title}</h3><p className="text-xs text-muted mt-0.5 mb-3">{subtitle}</p>{children}</section>;
}
function ProductGrid({products, cart, onAdd, onChange}:{products:any[]; cart:any[]; onAdd:(id:string)=>void; onChange:(id:string,d:number)=>void}) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{products.map(p=>{
    const inCart = cart.find(c=>c.productId===p.id);
    const out = p.stock<=0;
    return (
      <div key={p.id} className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
        <div className="relative aspect-[4/3] bg-cream"><img src={p.image} alt={p.name} className="w-full h-full object-cover"/>{p.tag && <span className="absolute top-2 left-2 bg-lime text-[10px] font-bold px-2 py-0.5 rounded-full">{p.tag}</span>}{out && <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold">Out of stock</span>}</div>
        <div className="p-3 flex flex-col flex-1"><p className="text-[11px] text-muted">{p.category} • {p.pack}</p><p className="font-semibold text-[13px] leading-snug mt-0.5 line-clamp-2 flex-1">{p.name}</p><div className="flex items-baseline gap-1.5 mt-2"><span className="font-bold">{formatINR(p.pricePaise)}</span>{p.mrpPaise && <span className="text-[11px] text-muted line-through">{formatINR(p.mrpPaise)}</span>}</div><p className="text-[11px] text-muted">{p.stock>0 ? `${p.stock} in stock` : 'Unavailable'}</p>
          {inCart ? <div className="flex items-center justify-between bg-forest text-white rounded-full mt-3 px-1 py-1"><button onClick={()=>onChange(p.id,-1)} className="w-7 h-7 flex items-center justify-center"><Minus size={14}/></button><span className="font-bold text-sm">{inCart.qty}</span><button onClick={()=>onChange(p.id,1)} className="w-7 h-7 flex items-center justify-center"><Plus size={14}/></button></div> : <button disabled={out} onClick={()=>onAdd(p.id)} className="mt-3 w-full border border-forest text-forest font-semibold text-sm py-2 rounded-full disabled:opacity-40 hover:bg-forest hover:text-white transition">Add</button>}
        </div>
      </div>
    );
  })}</div>;
}
function Stat({label, value, sub, accent}:{label:string; value:string; sub:string; accent?:boolean}) {
  return <div className={`bg-white border rounded-2xl p-4 ${accent?'border-forest':'border-border'}`}><p className="text-xs text-muted">{label}</p><p className="text-xl font-bold mt-1">{value}</p><p className="text-[11px] text-muted mt-0.5">{sub}</p></div>;
}
function Empty({title, sub}:{title:string; sub:string}) { return <div className="bg-white border border-border rounded-2xl p-10 text-center"><Package className="mx-auto text-muted"/><p className="font-semibold mt-2">{title}</p><p className="text-sm text-muted">{sub}</p></div>; }
function Toast({msg}:{msg:string}) { return <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-charcoal text-white px-4 py-2.5 rounded-full text-sm shadow-xl flex items-center gap-2 max-w-[90vw]"><BadgeCheck size={16} className="text-lime shrink-0"/><span className="truncate">{msg}</span></div>; }
