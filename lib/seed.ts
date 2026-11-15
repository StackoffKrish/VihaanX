
import { AppState, Product } from './types';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;

export const CATEGORIES = ['Atta & Rice','Dal & Pulses','Snacks','Beverages','Dairy','Personal Care','Household'];

export function seedProducts(): Product[] {
  const p = (id:string, name:string, category:string, pack:string, price:number, mrp:number, stock:number, image:string, tag?:string, popular?:boolean): Product => ({
    id, name, category, pack, pricePaise: price*100, mrpPaise: mrp*100, stock, image, tag, popular
  });
  return [
    p('p1','Aashirvaad Shudh Chakki Atta','Atta & Rice','5 kg',289,340,24, img('photo-1627485937980-221c88ac04f9'), 'Bestseller', true),
    p('p2','India Gate Basmati Rice','Atta & Rice','5 kg',425,499,18, img('photo-1586201375761-83865001e31c'), undefined, true),
    p('p3','Tata Salt','Atta & Rice','1 kg',28,32,60, img('photo-1518110925495-5fe2fda0442c')),
    p('p4','Fortune Sunflower Oil','Atta & Rice','1 L',142,165,22, img('photo-1474979266404-7eaacbcd87c5'), undefined, true),
    p('p5','Toor Dal (Unpolished)','Dal & Pulses','1 kg',168,195,30, img('photo-1585997627146-2f4e2e2a5b1a'), undefined, true),
    p('p6','Masoor Dal','Dal & Pulses','1 kg',118,140,28, img('photo-1610725664285-7c57e6eeac3f')),
    p('p7','Chana Dal','Dal & Pulses','1 kg',98,120,26, img('photo-1610725664285-7c57e6eeac3f')),
    p('p8','Rajma','Dal & Pulses','500 g',92,110,20, img('photo-1594750859509-4a4d8b9b1b1a')),
    p('p9','Maggi 2-Minute Noodles','Snacks','12 pack',144,168,45, img('photo-1585032226651-759b368d7246'), 'Bestseller', true),
    p('p10','Parle-G Biscuits','Snacks','800 g',82,95,50, img('photo-1558961363-fa8fdf82db35')),
    p('p11','Lay\'s Classic Salted Chips','Snacks','150 g',50,60,35, img('photo-1566478989037-eec170784d0b')),
    p('p12','Britannia Good Day','Snacks','400 g',58,70,32, img('photo-1558961363-fa8fdf82db35')),
    p('p13','Haldiram\'s Bhujia','Snacks','400 g',98,115,25, img('photo-1621939514649-280e2ee25f60')),
    p('p14','Amul Taaza Milk','Dairy','500 ml',29,30,40, img('photo-1550583724-b2692b85b150'), undefined, true),
    p('p15','Amul Butter','Dairy','500 g',285,295,18, img('photo-1589985270826-4b7bb135bc9d')),
    p('p16','Amul Cheese Slices','Dairy','200 g',125,135,15, img('photo-1486297678162-eb2a19b0a32d')),
    p('p17','Mother Dairy Curd','Dairy','400 g',48,55,28, img('photo-1488477181946-6428a0291777')),
    p('p18','Nestle Everyday Milk Powder','Dairy','400 g',185,210,12, img('photo-1550583724-b2692b85b150')),
    p('p19','Coca-Cola','Beverages','750 ml',45,50,38, img('photo-1554866585-cd94860890b7')),
    p('p20','Tata Tea Gold','Beverages','250 g',148,175,20, img('photo-1544787219-7f47ccb76574'), undefined, true),
    p('p21','Nescafe Classic Coffee','Beverages','100 g',285,310,14, img('photo-1509042239860-f550ce710b93')),
    p('p22','Real Mango Juice','Beverages','1 L',110,130,18, img('photo-1600271886742-f049cd451bba')),
    p('p23','Bisleri Water','Beverages','1 L',20,20,60, img('photo-1523362628745-0c100150b504')),
    p('p24','Colgate MaxFresh Toothpaste','Personal Care','300 g',168,195,22, img('photo-1526947425960-945c6e72858f')),
    p('p25','Dove Soap Bar','Personal Care','100 g x 3',185,210,18, img('photo-1600857544200-b2f666a9a2ec')),
    p('p26','Head & Shoulders Shampoo','Personal Care','650 ml',395,450,10, img('photo-1556228720-195a672e8a03')),
    p('p27','Dettol Handwash','Personal Care','750 ml',185,210,16, img('photo-1583947215259-38e31be8751f')),
    p('p28','Surf Excel Detergent','Household','1 kg',238,265,18, img('photo-1610557892470-55d9e80c0bce'), undefined, true),
    p('p29','Vim Dishwash Bar','Household','500 g',62,75,30, img('photo-1585421514738-01798e348b17')),
    p('p30','Harpic Toilet Cleaner','Household','1 L',198,225,12, img('photo-1584820927498-cfe5211fd8bf')),
    p('p31','Ariel Detergent Powder','Household','2 kg',395,440,10, img('photo-1610557892470-55d9e80c0bce')),
    p('p32','Tata Sampann Turmeric','Dal & Pulses','500 g',148,170,22, img('photo-1615485500834-bc10199bc727')),
    p('p33','Everest Garam Masala','Dal & Pulses','100 g',82,95,30, img('photo-1596040033229-a9821ebd058d')),
    p('p34','Kissan Mixed Fruit Jam','Snacks','500 g',145,165,14, img('photo-1474979266404-7eaacbcd87c5')),
    p('p35','Amul Dark Chocolate','Snacks','150 g',95,110,20, img('photo-1549007994-cb92caebd54b')),
    p('p36','Bournvita Health Drink','Beverages','500 g',215,240,12, img('photo-1544787219-7f47ccb76574')),
    p('p37','Aashirvaad Atta','Atta & Rice','10 kg',545,620,10, img('photo-1627485937980-221c88ac04f9')),
    p('p38','Daawat Rozzana Rice','Atta & Rice','5 kg',385,440,14, img('photo-1586201375761-83865001e31c')),
    p('p39','Moong Dal','Dal & Pulses','1 kg',132,155,24, img('photo-1585997627146-2f4e2e2a5b1a')),
    p('p40','Kurkure Masala Munch','Snacks','150 g',45,50,40, img('photo-1621939514649-280e2ee25f60')),
    p('p41','Good Life Milk','Dairy','1 L',56,58,30, img('photo-1550583724-b2692b85b150')),
    p('p42','Patanjali Honey','Beverages','500 g',185,210,16, img('photo-1587049352846-4a222e784d38')),
  ];
}

export function seedState(): AppState {
  const products = seedProducts();
  const now = new Date();
  const fmt = (d: Date) => d.toISOString();
  const daysAgo = (n:number) => { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString(); };
  const customer = {
    id: 'cust-1', name: 'Rahul Sharma', phone: '98765 43210', address: 'Mandoli, Delhi', house: 'House 12, Gali No. 4',
    depositPaise: 50000, depositPaid: true, payLaterLimitPaise: 50000, availableCreditPaise: 50000, outstandingPaise: 0, trustScore: 82, joinedAt: daysAgo(42),
  };
  // Historical delivered orders + settlements
  const mkOrder = (id:string, items:{pid:string; qty:number}[], payment:'UPI'|'Pay Later', status:any, created:string, delivered?:string) => {
    const orderItems = items.map(it => { const pr = products.find(x=>x.id===it.pid)!; return { productId: pr.id, name: pr.name, pack: pr.pack, pricePaise: pr.pricePaise, qty: it.qty, image: pr.image }; });
    const subtotal = orderItems.reduce((s,i)=>s+i.pricePaise*i.qty,0);
    return { id, customerId:'cust-1', customerName:'Rahul Sharma', shopId:'shop-1', items: orderItems, subtotalPaise: subtotal, paymentMethod: payment, status, createdAt: created, deliveredAt: delivered, address:'House 12, Gali No. 4, Mandoli, Delhi', phone:'98765 43210' };
  };
  const o1 = mkOrder('FK1001', [{pid:'p1',qty:1},{pid:'p3',qty:1}], 'UPI', 'Delivered', daysAgo(6), daysAgo(6));
  const o2 = mkOrder('FK1002', [{pid:'p9',qty:2},{pid:'p10',qty:1}], 'Pay Later', 'Delivered', daysAgo(4), daysAgo(4));
  const o3 = mkOrder('FK1003', [{pid:'p14',qty:4},{pid:'p4',qty:1}], 'UPI', 'Delivered', daysAgo(2), daysAgo(2));
  const o4 = mkOrder('FK1004', [{pid:'p5',qty:1},{pid:'p20',qty:1}], 'Pay Later', 'Preparing order', daysAgo(0));
  const o5 = mkOrder('FK1005', [{pid:'p9',qty:1},{pid:'p11',qty:2}], 'UPI', 'Order received', daysAgo(0));
  const orders = [o5,o4,o3,o2,o1];
  const mkSettle = (order:any, settledAt:string) => {
    const fee = Math.round(order.subtotalPaise*150/10000);
    return { id:`ST-${order.id}`, orderId: order.id, shopId:'shop-1', customerName: order.customerName, paymentMethod: order.paymentMethod, grossPaise: order.subtotalPaise, feePaise: fee, netPaise: order.subtotalPaise-fee, status:'Settled' as const, settledAt };
  };
  const settlements = [mkSettle(o3, daysAgo(2)), mkSettle(o2, daysAgo(4)), mkSettle(o1, daysAgo(6))];
  return {
    customer,
    products,
    cart: [{productId:'p1', qty:1}],
    orders,
    settlements,
    repayments: [{ id:'RP-1', customerId:'cust-1', amountPaise: 32000, date: daysAgo(32), status:'Completed', method:'UPI' }],
    shop: { id:'shop-1', name:'Sharma General Store', colony:'Mandoli, Delhi', status:'Open', owner:'Ramesh Sharma' },
    lastOrderId: 1005,
  };
}
