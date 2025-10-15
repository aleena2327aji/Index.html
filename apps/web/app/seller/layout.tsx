import Link from 'next/link';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-5 gap-6">
      <aside className="md:col-span-1 rustic-card p-4 h-fit sticky top-24">
        <div className="font-semibold mb-2">Seller Dashboard</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/seller" className="hover:text-farm-green">Overview</Link>
          <Link href="/seller/products" className="hover:text-farm-green">Products</Link>
          <Link href="/seller/orders" className="hover:text-farm-green">Orders</Link>
          <Link href="/seller/analytics" className="hover:text-farm-green">Analytics</Link>
        </nav>
      </aside>
      <section className="md:col-span-4">
        {children}
      </section>
    </div>
  );
}
