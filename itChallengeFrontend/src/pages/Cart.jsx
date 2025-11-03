import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./cart.css";
import { formatPrice } from "../utils/format";

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();

  const total = cart.items.reduce((s, it) => s + (Number(String(it.price).replace(/[^0-9.-]+/g, "")) || 0) * it.qty, 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <Navbar />
      <main className="pc-container">
        <h1 className="pc-title">Your cart</h1>
        {cart.items.length === 0 ? (
          <div className="pc-empty">Your cart is empty.</div>
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
                <div className="pc-total-label">Total</div>
                <div className="pc-total-price">{formatPrice(total)}</div>
              </div>
            </div>

            <div className="pc-actions">
              <button className="more-btn" onClick={() => navigate('/shop')}>Back to shop</button>
              <button className="buy-btn more-btn" onClick={() => alert('Checkout is not implemented in this demo')}>Checkout</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
