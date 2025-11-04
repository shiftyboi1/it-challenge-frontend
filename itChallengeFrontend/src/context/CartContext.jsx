import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import { MERCH_META } from "../data/merchMeta";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const auth = useAuth?.() ?? { isAuthenticated: false };
  const didResetRef = React.useRef(false);
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

  // On first page load, force an empty cart (both local and server if logged in)
  useEffect(() => {
    let ignore = false;
    async function resetCartOnLoad() {
      didResetRef.current = true;
      try { localStorage.removeItem("hh_cart_v1"); } catch {}
      if (!ignore) setItems([]);
      if (auth?.isAuthenticated) {
        try { await api.del('/cart'); } catch {}
        if (!ignore) setItems([]);
      }
    }
    resetCartOnLoad();
    return () => { ignore = true; };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user logs in, sync with server cart
  useEffect(() => {
    if (!auth?.isAuthenticated) return; // stay local for guests
    // Skip the first sync if we just force-reset the cart on load
    if (didResetRef.current) { didResetRef.current = false; return; }
    let ignore = false;
    async function load() {
      try {
        const data = await api.get('/cart');
        if (ignore) return;
        const mapped = Array.isArray(data)
          ? data.map((ci) => {
            const existing = items.find(i => i.id === ci.productId);
            const color = existing?.color ?? null;
            const meta = MERCH_META[ci.productId];
            const image = existing?.image ?? (meta ? (color && meta.imageByColor ? meta.imageByColor[color] : meta.image) : `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1`);
            return {
              id: ci.productId,
              name: ci.product?.name ?? `#${ci.productId}`,
              description: ci.product?.description ?? '',
              price: Number(ci.product?.cost ?? 0),
              qty: ci.amount,
              image,
              color,
            };
          })
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
        // treat different colors as distinct variants
        const idx = prev.findIndex(
          (p) => p.id === product.id && (p.color ?? null) === (product.color ?? null)
        );
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
        await api.post('/cart/add', { productId: product.id });
      }
      const data = await api.get('/cart');
      const mapped = Array.isArray(data)
        ? data.map((ci) => {
          const existing = items.find(i => i.id === ci.productId);
          const color = existing?.color ?? null;
          const meta = MERCH_META[ci.productId];
          const image = existing?.image ?? (meta ? (color && meta.imageByColor ? meta.imageByColor[color] : meta.image) : `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1`);
          return {
            id: ci.productId,
            name: ci.product?.name ?? `#${ci.productId}`,
            description: ci.product?.description ?? '',
            price: Number(ci.product?.cost ?? 0),
            qty: ci.amount,
            image,
            color,
          };
        })
        : [];
      setItems(mapped);
      setOpen(true);
    } catch (e) {
      // fallback to local if server fails
      setItems((prev) => {
        const idx = prev.findIndex(
          (p) => p.id === product.id && (p.color ?? null) === (product.color ?? null)
        );
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + qty };
          return next;
        }
        return [...prev, { ...product, qty: qty }];
      });
    }
  }

  async function removeItem(id, color) {
    if (!auth?.isAuthenticated) {
      setItems((prev) =>
        prev.filter((p) =>
          color === undefined
            ? p.id !== id
            : !(p.id === id && (p.color ?? null) === (color ?? null))
        )
      );
      return;
    }
      try {
      await api.post('/cart/remove-all', { productId: id });
      const data = await api.get('/cart');
      const mapped = Array.isArray(data)
        ? data.map((ci) => {
          const existing = items.find(i => i.id === ci.productId);
          const color = existing?.color ?? null;
          const meta = MERCH_META[ci.productId];
          const image = existing?.image ?? (meta ? (color && meta.imageByColor ? meta.imageByColor[color] : meta.image) : `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1`);
          return {
            id: ci.productId,
            name: ci.product?.name ?? `#${ci.productId}`,
            description: ci.product?.description ?? '',
            price: Number(ci.product?.cost ?? 0),
            qty: ci.amount,
            image,
            color,
          };
        })
        : [];
      setItems(mapped);
    } catch {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function changeQty(id, delta, color) {
    if (!auth?.isAuthenticated) {
      setItems((prev) => {
        const next = prev.map((p) => {
          const isMatch = p.id === id && (color === undefined || (p.color ?? null) === (color ?? null));
          return isMatch ? { ...p, qty: Math.max(0, (p.qty || 0) + delta) } : p;
        });
        return next.filter((p) => p.qty > 0);
      });
      return;
    }
    try {
      if (delta > 0) {
        await api.post('/cart/add', { productId: id });
      } else if (delta < 0) {
        await api.post('/cart/remove', { productId: id });
      }
      const data = await api.get('/cart');
      const mapped = Array.isArray(data)
        ? data.map((ci) => {
          const existing = items.find(i => i.id === ci.productId);
          const color = existing?.color ?? null;
          const meta = MERCH_META[ci.productId];
          const image = existing?.image ?? (meta ? (color && meta.imageByColor ? meta.imageByColor[color] : meta.image) : `https://picsum.photos/seed/${encodeURIComponent(ci.productId)}/200/300?blur=1`);
          return {
            id: ci.productId,
            name: ci.product?.name ?? `#${ci.productId}`,
            description: ci.product?.description ?? '',
            price: Number(ci.product?.cost ?? 0),
            qty: ci.amount,
            image,
            color,
          };
        })
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
