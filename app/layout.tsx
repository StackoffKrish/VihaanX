
import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Fast Kart — Kirana Pay Later', description: 'Your neighbourhood kirana, now online. Order essentials. Pay now or pay later.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen antialiased">{children}</body></html>
  );
}
