import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const auth = useAuth?.() ?? { isAuthenticated: false };
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

  // When user logs in, sync with server cart
  useEffect(() => {
    if (!auth?.isAuthenticated) return; // stay local for guests
    let ignore = false;
    async function load() {
      try {
        const data = await api.get('/cart');
        if (ignore) return;
        const mapped = Array.isArray(data)
          ? data.map((ci) => ({
              id: ci.productId,
              name: ci.product?.name ?? `#${ci.productId}`,
              price: Number(ci.product?.cost ?? 0),
              qty: ci.amount,
              image: `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1`,
            }))
          : [];
        setItems(mapped);
      } catch {
        // ignore, keep local items
      }
    }
    load();
    return () => { ignore = true; };
  }, [auth?.isAuthenticated]);

  async function addItem(product, qty = 1) {
    // Local-only when guest
    if (!auth?.isAuthenticated) {
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
      return;
    }

    // Server sync when logged in
    try {
      const times = Math.max(1, qty);
      for (let i = 0; i < times; i++) {
        await api.post('/cart/add', { productId: Number(product.id) });
      }
      const data = await api.get('/cart');
      const mapped = Array.isArray(data)
        ? data.map((ci) => ({
            id: ci.productId,
            name: ci.product?.name ?? `#${ci.productId}`,
            price: Number(ci.product?.cost ?? 0),
            qty: ci.amount,
            image: `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1`,
          }))
        : [];
      setItems(mapped);
      setOpen(true);
    } catch (e) {
      // fallback to local if server fails
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === product.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + qty };
          return next;
        }
        return [...prev, { ...product, qty: qty }];
      });
    }
  }

  async function removeItem(id) {
    if (!auth?.isAuthenticated) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    try {
      await api.post('/cart/remove-all', { productId: Number(id) });
      const data = await api.get('/cart');
      const mapped = Array.isArray(data)
        ? data.map((ci) => ({ id: ci.productId, name: ci.product?.name ?? `#${ci.productId}` , price: Number(ci.product?.cost ?? 0), qty: ci.amount, image: `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1` }))
        : [];
      setItems(mapped);
    } catch {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function changeQty(id, delta) {
    if (!auth?.isAuthenticated) {
      setItems((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, qty: Math.max(0, (p.qty || 0) + delta) } : p));
        return next.filter((p) => p.qty > 0);
      });
      return;
    }
    try {
      if (delta > 0) {
        await api.post('/cart/add', { productId: Number(id) });
      } else if (delta < 0) {
        await api.post('/cart/remove', { productId: Number(id) });
      }
      const data = await api.get('/cart');
      const mapped = Array.isArray(data)
        ? data.map((ci) => ({ id: ci.productId, name: ci.product?.name ?? `#${ci.productId}` , price: Number(ci.product?.cost ?? 0), qty: ci.amount, image: `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1` }))
        : [];
      setItems(mapped);
    } catch {
      // ignore
    }
  }

  async function clear() {
    if (!auth?.isAuthenticated) {
      setItems([]);
      return;
    }
    try {
      await api.del('/cart');
      setItems([]);
    } catch {
      setItems([]);
    }
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
