"use client";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SELLER_ID = process.env.NEXT_PUBLIC_SELLER_ID || 'seed-seller';

export default function AnalyticsPage() {
  const { data: overview } = useSWR(`${API}/api/analytics/overview?sellerId=${SELLER_ID}`, fetcher);
  const { data: salesByDay } = useSWR(`${API}/api/analytics/sales-by-interval?sellerId=${SELLER_ID}`, fetcher);
  const { data: topProducts } = useSWR(`${API}/api/analytics/top-products?sellerId=${SELLER_ID}`, fetcher);
  const { data: visitorsGeo } = useSWR(`${API}/api/analytics/visitors-geo?sellerId=${SELLER_ID}`, fetcher);

  const currency = (cents: number) => `$${(cents/100).toFixed(2)}`;
  const pct = (v: number) => `${(v*100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Total Page Views (30d)</div>
          <div className="text-2xl font-semibold">{overview?.totalPageViews ?? 0}</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Unique Visitors (30d)</div>
          <div className="text-2xl font-semibold">{overview?.uniqueVisitors ?? 0}</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Conversion Rate</div>
          <div className="text-2xl font-semibold">{pct(overview?.conversionRate ?? 0)}</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">View-to-Cart Rate</div>
          <div className="text-2xl font-semibold">{pct(overview?.viewToCartRate ?? 0)}</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Bounce Rate</div>
          <div className="text-2xl font-semibold">{pct(overview?.bounceRate ?? 0)}</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Total Revenue (30d)</div>
          <div className="text-2xl font-semibold">{currency(overview?.revenueCents ?? 0)}</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Average Order Value (30d)</div>
          <div className="text-2xl font-semibold">{currency(overview?.avgOrderValueCents ?? 0)}</div>
        </div>
      </div>

      <div className="rustic-card p-4">
        <div className="font-semibold mb-2">Sales by Day</div>
        <ul className="text-sm grid md:grid-cols-2 gap-1">
          {salesByDay?.map((row: any) => (
            <li key={row.day} className="flex justify-between"><span>{new Date(row.day).toLocaleDateString()}</span><span>{currency(row.cents)}</span></li>
          ))}
        </ul>
      </div>

      <div className="rustic-card p-4">
        <div className="font-semibold mb-2">Top Products</div>
        <ul className="text-sm grid md:grid-cols-2 gap-1">
          {topProducts?.map((p: any) => (
            <li key={p.productId} className="flex justify-between">
              <span>{p.product?.name ?? p.productId}{p.product?.isValueAdded && <em className="text-xs text-farm-earth ml-2">(Value-Added)</em>}</span>
              <span>x{p.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rustic-card p-4">
        <div className="font-semibold mb-2">Top Visitor Locations</div>
        <ul className="text-sm grid md:grid-cols-2 gap-1">
          {visitorsGeo?.map((row: any) => (
            <li key={row.place} className="flex justify-between"><span>{row.place}</span><span>{row.count}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
