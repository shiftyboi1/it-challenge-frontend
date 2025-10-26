import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminnavbar.css";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Top bar */}
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
              onClick={() => navigate("/admin")}
            />
          </div>

          {/* Center: HoloHome Admin */}
          <div className="nv-brand">HOLOHOME ADMIN</div>

          {/* Right: burger */}
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

      {/* Fullscreen overlay menu */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="nv-overlay"
          onClick={() => setOpen(false)}
        >
          {/* Close (top-left) */}
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="nv-iconbtn nv-close"
          >
            ×
          </button>

          {/* Centered menu list */}
          <nav onClick={(e) => e.stopPropagation()} className="nv-menu-col">
            <MenuLink to="/admin/users" label="USERS" onPick={() => setOpen(false)} />
            <MenuLink to="/admin/orders" label="ORDERS" onPick={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </>
  );
}

/* ---------- helpers ---------- */
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
