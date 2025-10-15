"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SELLER_ID = process.env.NEXT_PUBLIC_SELLER_ID || 'seed-seller';

export default function Tracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `fttd_session_${SELLER_ID}`;
    const existing = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    async function ensureSession() {
      if (existing) {
        sessionIdRef.current = existing;
        return existing;
      }
      const res = await fetch(`${API}/api/track/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: SELLER_ID, userAgent: navigator.userAgent })
      });
      const json = await res.json();
      window.localStorage.setItem(key, json.id);
      sessionIdRef.current = json.id;
      return json.id as string;
    }
    ensureSession().then((sid) => {
      fetch(`${API}/api/track/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, sellerId: SELLER_ID, path: pathname })
      }).catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
