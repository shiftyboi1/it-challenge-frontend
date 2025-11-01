import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {/* ===== Top bar with side squares + center pill ===== */}
      <header className="nv-header">
        <div className="nv-grid">
          {/* Left square: Theme toggle */}
          <button
            className="nv-square"
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            <span className="nv-square-emoji">
              {theme === "light" ? "☀️" : "🌙"}
            </span>
          </button>

          {/* Center pill: home | HOLOHOME | burger */}
          <div className="nv-pill">
            <button
              className="nv-pill-btn"
              aria-label="Home"
              title="Domov"
              onClick={() => navigate("/")}
            >
              🏠
            </button>

            <div className="nv-brand" onClick={() => navigate("/")}>
              HOLOHOME
            </div>

            <button
              className="nv-pill-btn"
              aria-label="Open menu"
              title="Menu"
              onClick={() => setOpen(true)}
            >
              <span className="nv-burger">
                <span className="nv-burger-line nv-burger-top" />
                <span className="nv-burger-line nv-burger-bottom" />
              </span>
            </button>
          </div>

          {/* Right square: Cart */}
          <button
            className="nv-square"
            aria-label="Cart"
            onClick={() => navigate("/cart")}
            title="Košík"
          >
            <span className="nv-square-emoji">🛒</span>
          </button>
        </div>
      </header>

      {/* ===== Fullscreen overlay menu (links only) ===== */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="nv-overlay"
          onClick={() => setOpen(false)}
        >
          {/* Close button (keeps same visual weight as burger) */}
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="nv-iconbtn nv-close"
          >
            <span className="nv-x-line nv-x-a" />
            <span className="nv-x-line nv-x-b" />
          </button>

          {/* Top: logo + brand */}
          <div
            className="nv-overlay-top"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate("/");
            }}
          >
            <img src="/logo.ico" alt="HoloHome" className="nv-overlay-logo" />
            <span className="nv-overlay-brand">HoloHome</span>
          </div>

          {/* Centered links */}
          <nav onClick={(e) => e.stopPropagation()} className="nv-menu-col">
            <MenuLink to="/" label="DOMOV" onPick={() => setOpen(false)} />
            <MenuLink to="/shop" label="OBCHOD" onPick={() => setOpen(false)} />
            <MenuLink to="/merch" label="MERCH" onPick={() => setOpen(false)} />
            <MenuLink to="/account" label="ÚČET" onPick={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </>
  );
}

/* ---------- Small helpers ---------- */
function MenuLink({ to, label, onPick }) {
  return (
    <Link to={to} onClick={onPick} className="nv-menu-link">
      {label}
    </Link>
  );
}
