"use client";
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SELLER_ID = process.env.NEXT_PUBLIC_SELLER_ID || 'seed-seller';

export default function ProductsPage() {
  const { data: products, mutate } = useSWR(`${API}/api/products?sellerId=${SELLER_ID}`, fetcher);
  const [form, setForm] = useState({
    name: '', description: '', category: 'VEGETABLES', priceCents: 0, unit: 'unit', inventory: 0, isValueAdded: false, images: ['']
  });

  async function save() {
    await fetch(`${API}/api/products/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sellerId: SELLER_ID, images: form.images.filter(Boolean) }) });
    setForm({ name: '', description: '', category: 'VEGETABLES', priceCents: 0, unit: 'unit', inventory: 0, isValueAdded: false, images: [''] });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Products</h1>
      <div className="rustic-card p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="border rounded p-2" placeholder="Unit (e.g., lb, loaf)" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} />
          <input className="border rounded p-2 md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Category</label>
            <select className="border rounded p-2" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              {['VEGETABLES','FRUITS','DAIRY','BAKED_GOODS','MEAT','EGGS','HONEY','PRESERVES','BEVERAGES','OTHER'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Price (cents)</label>
            <input type="number" className="border rounded p-2 w-40" value={form.priceCents} onChange={e=>setForm({...form, priceCents:Number(e.target.value)})} />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Inventory</label>
            <input type="number" className="border rounded p-2 w-40" value={form.inventory} onChange={e=>setForm({...form, inventory:Number(e.target.value)})} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isValueAdded} onChange={e=>setForm({...form, isValueAdded:e.target.checked})} />
            <span>Value-Added Product</span>
          </label>
          <input className="border rounded p-2 md:col-span-2" placeholder="Image URL" value={form.images[0]} onChange={e=>setForm({...form, images:[e.target.value]})} />
        </div>
        <button onClick={save} className="bg-farm-green text-white px-4 py-2 rounded">Save Product</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {products?.map((p: any) => (
          <div key={p.id} className="rustic-card overflow-hidden">
            {p.images?.[0]?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0].url} alt={p.name} className="h-40 w-full object-cover" />
            )}
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                {p.isValueAdded && <span className="text-xs bg-farm-wheat/20 text-farm-earth px-2 py-0.5 rounded">Value-Added</span>}
              </div>
              <div className="text-sm text-gray-600">{p.unit} • ${(p.priceCents/100).toFixed(2)}</div>
              <div className="text-xs text-gray-500">Inventory: {p.inventory}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
