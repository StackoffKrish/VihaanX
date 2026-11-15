
export function toPaise(rupees: number): number { return Math.round(rupees * 100); }
export function calcFee(grossPaise: number): number { return Math.round((grossPaise * 150) / 10000); }
export function calcNet(grossPaise: number): number { return grossPaise - calcFee(grossPaise); }
export function calcTotals(items: {pricePaise:number; qty:number}[]): number {
  return items.reduce((s, i) => s + i.pricePaise * i.qty, 0);
}
