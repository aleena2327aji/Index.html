import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Tracker from '../components/Tracker';

export const metadata: Metadata = {
  title: 'Farm-to-Table Direct',
  description: 'Direct from farmers to your table',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <Tracker />
        <header className="border-b border-farm-earth/20 bg-white/90 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-farm-green">Farm-to-Table Direct</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/seller" className="hover:text-farm-green">Seller Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
