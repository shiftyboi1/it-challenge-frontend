import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./cart.css";
import { formatPrice } from "../utils/format";
import api from "../utils/api";

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  const auth = useAuth?.();
  const [placing, setPlacing] = useState(false);

  const total = cart.items.reduce((s, it) => s + (Number(it.price) || 0) * it.qty, 0);
  async function handleCheckout() {
    if (!auth?.isAuthenticated) {
      navigate('/login');
      return;
    }
    setPlacing(true);
    try {
      const data = await api.post('/orders');
      // cart is cleared by server; update local
      cart.clear();
      navigate('/orders');
    } catch (e) {
      alert(e.message || 'Nepodarilo sa vytvoriť objednávku');
    } finally {
      setPlacing(false);
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <Navbar />
      <main className="pc-container">
        <h1 className="pc-title">Košík</h1>
        {cart.items.length === 0 ? (
          <div className="pc-empty">Košík je prázdny</div>
        ) : (
          <>
            <div className="pc-list">
              {cart.items.map((it) => (
                <div key={it.id} className="pc-item">
                  <button aria-label={`Remove ${it.name}`} className="pc-remove" onClick={() => cart.removeItem(it.id)}>×</button>
                  <div className="pc-thumb-wrap">
                    <img src={it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/200/200?blur=1`} alt={it.name} className="pc-thumb" loading="lazy" />
                  </div>
                  <div className="pc-meta">
                    <div className="pc-title-text">{it.name}</div>
                  </div>
                  <div className="pc-right">
                    <div className="cart-item-controls">
                      <button aria-label={`Decrease quantity for ${it.name}`} className="qty-btn" onClick={() => cart.changeQty(it.id, -1)}>-</button>
                      <span className="qty-value">{it.qty}</span>
                      <button aria-label={`Increase quantity for ${it.name}`} className="qty-btn" onClick={() => cart.changeQty(it.id, +1)}>+</button>
                    </div>
                    <div className="pc-price-right">{formatPrice(((Number(String(it.price).replace(/[^0-9.-]+/g, "")) || 0) * (it.qty || 0)))}</div>
                  </div>
                </div>
              ))}

              <div className="pc-total">
                <div className="pc-total-label">Spolu</div>
                <div className="pc-total-price">{formatPrice(total)}</div>
              </div>
            </div>

            <div className="pc-actions">
              <button className="more-btn" onClick={() => navigate('/shop')}>Späť do obchodu</button>
              <button className="buy-btn more-btn" disabled={placing || cart.items.length===0} onClick={handleCheckout}>{placing ? 'Spracúvam…' : 'Zaplatiť'}</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
