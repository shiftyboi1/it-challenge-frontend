import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useCart } from "../../context/CartContext";

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

  // Persist theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Add/remove global class for open/closed (used by CSS to round the bar etc.)
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    openRef.current = open;
  }, [open]);

  // Hide on scroll down, show on scroll up. If there's a `.home-hero` (slider),
  // stop hiding once we've scrolled past its bottom edge.
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let lastY = window.scrollY;
    let raf = null;
    let hero = null;
    const lockedRef = { value: false }; // when true, navbar stays visible (we passed hero)

    function getHeroRect() {
      hero = document.querySelector(".home-hero");
      return hero ? hero.getBoundingClientRect() : null;
    }
    // Recalc helpers
    const resizeHandler = () => getHeroRect();
    window.addEventListener("resize", resizeHandler, { passive: true });
    window.addEventListener("load", getHeroRect);

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const threshold = 8;

        // If a product detail panel is open, keep the navbar visible
        if (document.documentElement.classList.contains("panel-open")) {
          headerEl.classList.remove("nh-hidden");
          leftBoxRef.current && leftBoxRef.current.classList.remove("nh-hidden");
          rightBoxRef.current && rightBoxRef.current.classList.remove("nh-hidden");
          lastY = y;
          raf = null;
          return;
        }

        // If submenu is open and user scrolls (up or down) a bit, close the submenu
        if (openRef.current && Math.abs(delta) > threshold) {
          setOpen(false);
        }
  // compute hero rect (updated each frame to handle layout shifts)
  const rect = getHeroRect();
        // If hero exists and its BOTTOM is <= 0 (scrolled past viewport top), lock visible
        if (rect) {
          if (rect.bottom <= 0) {
            lockedRef.value = true;
          } else {
            lockedRef.value = false;
          }
        } else {
          lockedRef.value = false; // no hero on page
        }

        // If locked (we scrolled past hero), always show the navbar
        if (lockedRef.value) {
          headerEl.classList.remove("nh-hidden");
          leftBoxRef.current && leftBoxRef.current.classList.remove("nh-hidden");
          rightBoxRef.current && rightBoxRef.current.classList.remove("nh-hidden");
          lastY = y;
          raf = null;
          return;
        }

        // small threshold to avoid flicker

        if (Math.abs(delta) > threshold) {
          if (delta > 0 && y > 100) {
            // scrolling down
            headerEl.classList.add("nh-hidden");
            leftBoxRef.current && leftBoxRef.current.classList.add("nh-hidden");
            rightBoxRef.current && rightBoxRef.current.classList.add("nh-hidden");
          } else if (delta < 0) {
            // scrolling up
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

  // close cart preview when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      const list = document.querySelector('.cart-list');
      if (!list) return;
      const target = e.target;
      if (rightBoxRef.current && rightBoxRef.current.contains(target)) return;
      if (list && list.contains(target)) return;
      // clicked outside
      cart.close();
    }
    document.addEventListener('pointerdown', onDocClick);
    return () => document.removeEventListener('pointerdown', onDocClick);
  }, [cart]);

  // toggle a visual class on the header so we can hide the small cart button
  useEffect(() => {
    const hdr = headerRef.current;
    if (!hdr) return;
    hdr.classList.toggle('cart-open', cart.open);
  }, [cart.open]);

  // pulse badge whenever count changes
  useEffect(() => {
    if (!badgeRef.current) return;
    // add pulse class briefly
    badgeRef.current.classList.add('pulse');
    const t = setTimeout(() => badgeRef.current && badgeRef.current.classList.remove('pulse'), 200);
    return () => clearTimeout(t);
  }, [cart.count]);

  // focus first interactive element when opening the cart preview
  useEffect(() => {
    if (!cart.open) return;
    // small delay for DOM
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
      {/* LEFT FLOATING ICON — theme toggle */}
      <button
        ref={leftBoxRef}
        className="nh-box nh-left"
        aria-label="Prepínať tému"
        title="Prepínať tému"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      >
        <span className="nh-emoji">{theme === "light" ? "☀️" : "🌙"}</span>
      </button>

      {/* CENTER BAR */}
  <header className="nh" ref={headerRef} aria-label="Hlavná navigácia">
        <div className="nh-bar" ref={barRef}>
          {/* LOGO SLOT (non-clickable, for now emoji) */}
          <span className="nh-logo" role="img" aria-label="Logo">🏠</span>

          {/* BRAND TITLE */}
          <Link to="/" className="nh-title nh-title-holo" onClick={closeMenu}>
            HOLOHOME
          </Link>

          {/* 2-line BURGER -> X */}
          <button
            className="nh-bar-btn"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            title={open ? "Zavrieť menu" : "Otvoriť menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`nh-burger-2 ${open ? "is-open" : ""}`} aria-hidden="true" />
          </button>
        </div>

        {/* ATTACHED SLIDE-DOWN SUBMENU */}
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

      {/* RIGHT FLOATING ICON — cart */}
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
        {/* keep the emoji always visible inside the circle */}
        <span className="nh-emoji">🛒</span>

        {/* when there are items, show a small icon+count indicator */}
        {cart.count > 0 && (
          <span className="cart-indicator" aria-hidden="true">
            <span ref={badgeRef} className="cart-indicator-num">{cart.count}</span>
          </span>
        )}

        {/* screen-reader announcement removed per request (visual silence when empty) */}
      </button>

      {/* Cart drawer (always present, slides in when open) */}
      <div className={`cart-backdrop ${cart.open ? 'open' : ''}`} onClick={() => cart.close()} />
      <div className={`cart-list ${cart.open ? 'open' : ''}`} role="dialog" aria-label="Cart preview drawer" aria-modal={cart.open ? 'true' : 'false'}>
        <div className="cart-list-items">
          {cart.items.length === 0 ? (
            /* intentionally show nothing when the cart is empty */
            null
          ) : (
            cart.items.map((it) => (
              <div key={it.id} className="cart-item">
                <div className="cart-item-left">
                  <img src={it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/200/300?blur=1`} alt={it.name} className="cart-thumb" loading="lazy" />
                  <div className="cart-meta">
                    <div className="cart-item-title">{it.name}</div>
                    <div className="cart-item-price">{it.price}</div>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-controls">
                    <button aria-label={`Increase quantity for ${it.name}`} className="qty-btn qty-plus" onClick={() => cart.addItem({ id: it.id, name: it.name, price: it.price, image: it.image }, 1)}>+</button>
                    <span className="qty-value">{it.qty}</span>
                    <button aria-label={`Decrease quantity for ${it.name}`} className="qty-btn qty-minus" onClick={() => cart.changeQty(it.id, -1)}>-</button>
                  </div>
                  <button aria-label={`Remove ${it.name}`} className="cart-remove" onClick={() => cart.removeItem(it.id)}>×</button>
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
    // ensure scroll to top after navigation completes/render
    setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  }

  return (
    <a href={to} onClick={handleClick} className="nh-link nh-link-holo">
      {label}
    </a>
  );
}
