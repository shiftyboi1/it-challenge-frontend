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
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {/* ===== Top bar ===== */}
      <header className="nv-header">
        <div className="nv-grid">
          {/* Left: logo */}
          <div className="nv-left">
            <img
              src="/logo.ico"
              alt="HoloHome logo"
              width={28}
              height={28}
              className="nv-logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Center: HoloHome text */}
          <div className="nv-brand">HOLOHOME</div>

          {/* Right: burger menu */}
          <div className="nv-right">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="nv-iconbtn"
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ===== Fullscreen overlay menu ===== */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="nv-overlay"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="nv-iconbtn nv-close"
          >
            ×
          </button>

          {/* Centered menu list */}
          <nav
            onClick={(e) => e.stopPropagation()}
            className="nv-menu-col"
          >
            <MenuLink to="/" label="DOMOV" onPick={() => setOpen(false)} />
            <MenuLink to="/shop" label="OBCHOD" onPick={() => setOpen(false)} />
            <MenuLink to="/merch" label="MERCH" onPick={() => setOpen(false)} />
            <MenuLink to="/account" label="ÚČET" onPick={() => setOpen(false)} />
          </nav>

          {/* Side squares (left/right) */}
          <div aria-hidden className="nv-side-squares">
            {/* Left square: theme toggle */}
            <button
              className="nv-square"
              onClick={(e) => {
                e.stopPropagation();
                setTheme((t) => (t === "light" ? "dark" : "light"));
              }}
            >
              <span className="nv-square-emoji">
                {theme === "light" ? "🌙" : "☀️"}
              </span>
            </button>

            {/* Right square: shopping cart */}
            <button
              className="nv-square"
              onClick={(e) => {
                e.stopPropagation();
                alert("Open cart (hook this to your /cart route)");
              }}
            >
              <span className="nv-square-emoji">🛒</span>
            </button>
          </div>
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

function BurgerIcon() {
  return (
    <span className="nv-burger">
      <span className="nv-burger-line nv-burger-top" />
      <span className="nv-burger-line nv-burger-bottom" />
    </span>
  );
}
