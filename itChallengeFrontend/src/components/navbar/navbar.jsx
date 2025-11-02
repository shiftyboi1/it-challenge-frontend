import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

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
          navigate("/cart");
        }}
      >
        <span className="nh-emoji">🛒</span>
      </button>
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
