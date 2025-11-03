import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./cart.css";

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();

  const total = cart.items.reduce((s, it) => s + (Number(String(it.price).replace(/[^0-9.-]+/g, "")) || 0) * it.qty, 0);

  return (
    <>
      <Navbar />
      <main className="pc-container">
        <h1 className="pc-title">Your cart</h1>
        {cart.items.length === 0 ? (
          <div className="pc-empty">Your cart is empty.</div>
        ) : (
          <div className="pc-list">
            {cart.items.map((it) => (
              <div key={it.id} className="pc-item">
                <div className="pc-meta">
                  <div className="pc-title-text">{it.name}</div>
                  <div className="pc-price">{it.price}</div>
                </div>
                <div className="pc-right">
                  <div className="cart-item-controls">
                    <button aria-label={`Increase quantity for ${it.name}`} className="qty-btn" onClick={() => cart.addItem({ id: it.id, name: it.name, price: it.price, image: it.image }, 1)}>+</button>
                    <span className="qty-value">{it.qty}</span>
                    <button aria-label={`Decrease quantity for ${it.name}`} className="qty-btn" onClick={() => cart.changeQty(it.id, -1)}>-</button>
                  </div>
                  <button className="pc-remove" onClick={() => cart.removeItem(it.id)}>Remove</button>
                </div>
              </div>
            ))}

            <div className="pc-total">
              <div>Total</div>
              <div>{`€${total.toFixed(2)}`}</div>
            </div>

            <div className="pc-actions">
              <button className="more-btn" onClick={() => navigate('/shop')}>Continue shopping</button>
              <button className="buy-btn more-btn" onClick={() => alert('Checkout is not implemented in this demo')}>Checkout</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
