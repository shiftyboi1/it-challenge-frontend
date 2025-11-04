import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
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
  const auth = useAuth?.();

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
        <span className="nh-emoji" aria-hidden="true">
          {theme === "light" ? (
            // Sun icon (lucide) — theme-aware via currentColor
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun-icon lucide-sun">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          ) : (
            // Moon icon (Font Awesome) — theme-aware via currentColor
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" role="img">
              <path d="M320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C388.8 576 451.3 548.8 497.3 504.6C504.6 497.6 506.7 486.7 502.6 477.5C498.5 468.3 488.9 462.6 478.8 463.4C473.9 463.8 469 464 464 464C362.4 464 280 381.6 280 280C280 207.9 321.5 145.4 382.1 115.2C391.2 110.7 396.4 100.9 395.2 90.8C394 80.7 386.6 72.5 376.7 70.3C358.4 66.2 339.4 64 320 64z"/>
            </svg>
          )}
        </span>
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
            {auth?.isAuthenticated ? (
              <>
                <MenuLink to="/account" label="ÚČET" onPick={closeMenu} />
                <MenuLink to="/orders" label="OBJEDNÁVKY" onPick={closeMenu} />
                {auth?.isAdmin && <MenuLink to="/admin" label="ADMIN" onPick={closeMenu} />}
                {auth?.isManager && <MenuLink to="/manager" label="SPRÁVCA" onPick={closeMenu} />}
              </>
            ) : (
              <MenuLink to="/login" label="PRIHLÁSIŤ" onPick={closeMenu} />
            )}
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
        <span className="nh-emoji" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" role="img">
            <path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z"/>
          </svg>
        </span>
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
              <div key={`${it.id}::${it.color || 'default'}`} className="cart-item">
                <button aria-label={`Remove ${it.name}`} className="cart-remove" onClick={() => cart.removeItem(it.id, it.color)}>×</button>
                <div className="cart-item-left">
                  <div className="cart-thumb-wrap">
                    <img src={it.image || `https://picsum.photos/seed/${encodeURIComponent(it.id)}/200/300?blur=1`} alt={it.name} className="cart-thumb" loading="lazy" />
                  </div>
                  <div className="cart-meta">
                    <div className="cart-item-title">{it.name}</div>
                    {it.color ? (
                      <div className="cart-item-variant">
                        <span
                          className="variant-dot"
                          style={{
                            background: it.color,
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: '1px solid #ccc',
                            verticalAlign: 'middle',
                            marginRight: 6,
                          }}
                        />
                        <span className="variant-label" style={{ fontSize: '12px', opacity: 0.8 }}>{it.color}</span>
                      </div>
                    ) : null}
                    <div className="cart-item-price">{formatPrice(it.price)}</div>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-controls">
                      <button aria-label={`Increase quantity for ${it.name}`} className="qty-btn qty-plus" onClick={() => cart.addItem({ id: it.id, name: it.name, price: it.price, image: it.image, color: it.color }, 1)}>+</button>
                      <span className="qty-value">{it.qty}</span>
                      <button aria-label={`Decrease quantity for ${it.name}`} className="qty-btn qty-minus" onClick={() => cart.changeQty(it.id, -1, it.color)}>-</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-list-footer">
          <button className="btn btn-ghost" onClick={() => { cart.close(); navigate('/cart'); }}>
            Do košíka
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
