import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("hh_cart_v1");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    try {
      localStorage.setItem("hh_cart_v1", JSON.stringify(items));
    } catch {
    }
  }, [items]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + qty };
        return next;
      }
      return [...prev, { ...product, qty: qty }];
    });
    setOpen(true);
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function changeQty(id, delta) {
    setItems((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, qty: Math.max(0, (p.qty || 0) + delta) } : p));
      return next.filter((p) => p.qty > 0);
    });
  }

  function clear() {
    setItems([]);
  }

  function toggleOpen() {
    setOpen((v) => !v);
  }

  function close() { setOpen(false); }
  function openList() { setOpen(true); }

  const count = items.reduce((s, it) => s + (it.qty || 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clear, count, open, toggleOpen, close, openList }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export default CartContext;
