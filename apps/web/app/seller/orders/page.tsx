"use client";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SELLER_ID = process.env.NEXT_PUBLIC_SELLER_ID || 'seed-seller';

export default function OrdersPage() {
  const { data: orders, mutate } = useSWR(`${API}/api/orders?sellerId=${SELLER_ID}`, fetcher);

  async function updateStatus(id: string, status: string) {
    await fetch(`${API}/api/orders/${id}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="space-y-3">
        {orders?.map((o: any) => (
          <div key={o.id} className="rustic-card p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order #{o.id.slice(0,6)}</div>
              <select value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="border rounded p-2">
                {['NEW','PROCESSING','READY','COMPLETED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
            <ul className="text-sm list-disc pl-5 mt-2">
              {o.items.map((it: any) => (
                <li key={it.id}>{it.product.name} x {it.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
