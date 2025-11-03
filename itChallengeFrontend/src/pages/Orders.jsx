import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import api from '../utils/api';
import { formatPrice } from '../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get('/orders/my');
        if (!ignore) setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (e) {
        if (!ignore) setError(e.message || 'Nepodarilo sa načítať objednávky');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '40px 16px' }}>
        <h1>Moje objednávky</h1>
        {loading && <div>Načítavam…</div>}
        {error && <div style={{ color: 'var(--danger, #b91c1c)' }}>{error}</div>}
        {!loading && !error && orders.length === 0 && <div>Zatiaľ žiadne objednávky</div>}
        {!loading && !error && orders.map((o) => (
          <div key={o.id} style={{ border: '1px solid var(--muted-2, #2a2a2a)', borderRadius: 12, padding: 16, margin: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>Objednávka #{o.id}</strong>
              <span>Status: {o.status}</span>
            </div>
            <div>
              {o.items?.map((it) => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>{it.product?.name} × {it.quantity}</span>
                  <span>{formatPrice((it.price || 0) * (it.quantity || 0))}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <strong>Spolu: {formatPrice(o.total)}</strong>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
