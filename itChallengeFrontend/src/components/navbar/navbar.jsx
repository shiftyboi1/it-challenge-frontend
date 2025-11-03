import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );
  const navigate = useNavigate();
  const barRef = useRef(null);
  const headerRef = useRef(null);
  const leftBoxRef = useRef(null);
  const rightBoxRef = useRef(null);
  const openRef = useRef(false);
  const badgeRef = useRef(null);
  const announceRef = useRef(null);
  const cart = useCart();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let lastY = window.scrollY;
    let raf = null;
    let hero = null;
    const lockedRef = { value: false }; 

    function getHeroRect() {
      hero = document.querySelector(".home-hero");
      return hero ? hero.getBoundingClientRect() : null;
    }
    const resizeHandler = () => getHeroRect();
    window.addEventListener("resize", resizeHandler, { passive: true });
    window.addEventListener("load", getHeroRect);

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const threshold = 8;
        if (document.documentElement.classList.contains("panel-open")) {
          headerEl.classList.remove("nh-hidden");
          leftBoxRef.current && leftBoxRef.current.classList.remove("nh-hidden");
          rightBoxRef.current && rightBoxRef.current.classList.remove("nh-hidden");
          lastY = y;
          raf = null;
          return;
        }

        if (openRef.current && Math.abs(delta) > threshold) {
          setOpen(false);
        }
  const rect = getHeroRect();
        if (rect) {
          if (rect.bottom <= 0) {
            lockedRef.value = true;
          } else {
            lockedRef.value = false;
          }
        } else {
          lockedRef.value = false; 
        }

        if (lockedRef.value) {
          headerEl.classList.remove("nh-hidden");
          leftBoxRef.current && leftBoxRef.current.classList.remove("nh-hidden");
          rightBoxRef.current && rightBoxRef.current.classList.remove("nh-hidden");
          lastY = y;
          raf = null;
          return;
        }


        if (Math.abs(delta) > threshold) {
          if (delta > 0 && y > 100) {
            headerEl.classList.add("nh-hidden");
            leftBoxRef.current && leftBoxRef.current.classList.add("nh-hidden");
            rightBoxRef.current && rightBoxRef.current.classList.add("nh-hidden");
          } else if (delta < 0) {
            headerEl.classList.remove("nh-hidden");
            leftBoxRef.current && leftBoxRef.current.classList.remove("nh-hidden");
            rightBoxRef.current && rightBoxRef.current.classList.remove("nh-hidden");
          }
          lastY = y;
        }

        raf = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("load", getHeroRect);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      const list = document.querySelector('.cart-list');
      if (!list) return;
      const target = e.target;
      if (rightBoxRef.current && rightBoxRef.current.contains(target)) return;
      if (list && list.contains(target)) return;
      cart.close();
    }
    document.addEventListener('pointerdown', onDocClick);
    return () => document.removeEventListener('pointerdown', onDocClick);
  }, [cart]);

  useEffect(() => {
    const hdr = headerRef.current;
    if (!hdr) return;
    hdr.classList.toggle('cart-open', cart.open);
  }, [cart.open]);

  useEffect(() => {
    if (!badgeRef.current) return;
    badgeRef.current.classList.add('pulse');
    const t = setTimeout(() => badgeRef.current && badgeRef.current.classList.remove('pulse'), 200);
    return () => clearTimeout(t);
  }, [cart.count]);

  useEffect(() => {
    if (!cart.open) return;
    setTimeout(() => {
      const list = document.querySelector('.cart-list');
      if (!list) return;
      const firstBtn = list.querySelector('.qty-btn') || list.querySelector('.more-btn');
      if (firstBtn) firstBtn.focus();
    }, 80);
  }, [cart.open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <button
        ref={leftBoxRef}
        className="nh-box nh-left"
        aria-label="Prepínať tému"
        title="Prepínať tému"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      >
        <span className="nh-emoji">{theme === "light" ? "☀️" : "🌙"}</span>
      </button>

  <header className="nh" ref={headerRef} aria-label="Hlavná navigácia">
        <div className="nh-bar" ref={barRef}>
          <span className="nh-logo" role="img" aria-label="Logo">🏠</span>
          <Link to="/" className="nh-title nh-title-holo" onClick={closeMenu}>
            HOLOHOME
          </Link>
          <button
            className="nh-bar-btn"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            title={open ? "Zavrieť menu" : "Otvoriť menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`nh-burger-2 ${open ? "is-open" : ""}`} aria-hidden="true" />
          </button>
        </div>
        <div
          className={`nh-submenu ${open ? "open" : ""}`}
          role="region"
          aria-label="Podstránky"
          style={
            barRef.current
              ? { width: `${Math.max(barRef.current.offsetWidth, 320)}px` }
              : undefined
          }
        >
          <nav className="nh-submenu-inner" aria-label="Hlavné menu">
            <MenuLink to="/"      label="DOMOV"  onPick={closeMenu} />
            <MenuLink to="/shop"  label="OBCHOD" onPick={closeMenu} />
            <MenuLink to="/merch" label="MERCH"  onPick={closeMenu} />
            <MenuLink to="/login" label="ÚČET"   onPick={closeMenu} />
          </nav>
        </div>
      </header>

      <button
        ref={rightBoxRef}
        className="nh-box nh-right"
        aria-label="Košík"
        title="Košík"
        onClick={() => {
          setOpen(false);
          cart.toggleOpen();
        }}
      >
        <span className="nh-emoji">🛒</span>
        {cart.count > 0 && (
          <span className="cart-indicator" aria-hidden="true">
            <span ref={badgeRef} className="cart-indicator-num">{cart.count}</span>
          </span>
        )}
      </button>

      <div className={`cart-backdrop ${cart.open ? 'open' : ''}`} onClick={() => cart.close()} />
      <div className={`cart-list ${cart.open ? 'open' : ''}`} role="dialog" aria-label="Cart preview drawer" aria-modal={cart.open ? 'true' : 'false'}>
        <div className="cart-list-items">
          {cart.items.length === 0 ? (
            null
          ) : (
            cart.items.map((it) => (
              <div key={it.id} className="cart-item">
                <button aria-label={`Remove ${it.name}`} className="cart-remove" onClick={() => cart.removeItem(it.id)}>×</button>
                <div className="cart-item-left">
                  <div className="cart-thumb-wrap">
                    <img src={it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/200/300?blur=1`} alt={it.name} className="cart-thumb" loading="lazy" />
                  </div>
                  <div className="cart-meta">
                    <div className="cart-item-title">{it.name}</div>
                    <div className="cart-item-price">{formatPrice(it.price)}</div>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-controls">
                      <button aria-label={`Increase quantity for ${it.name}`} className="qty-btn qty-plus" onClick={() => cart.addItem({ id: it.id, name: it.name, price: it.price, image: it.image }, 1)}>+</button>
                      <span className="qty-value">{it.qty}</span>
                      <button aria-label={`Decrease quantity for ${it.name}`} className="qty-btn qty-minus" onClick={() => cart.changeQty(it.id, -1)}>-</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-list-footer">
          <button className="btn btn-ghost" onClick={() => { cart.close(); navigate('/cart'); }}>
            Go to cart
          </button>
        </div>
      </div>
    </>
  );
}

function MenuLink({ to, label, onPick }) {
  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    if (onPick) onPick();
    navigate(to);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  }
  return (
    <a href={to} onClick={handleClick} className="nh-link nh-link-holo">
      {label}
    </a>
  );
}
