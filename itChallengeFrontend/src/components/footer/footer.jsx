import React, { useEffect, useState } from "react";
import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  // footer-local theme toggle (same storage/key as navbar)
  const [theme, _setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <footer className="hf fw">
      <div className="hf-topglow" aria-hidden="true" />

      <div className="hf-grid">
        {/* LEFT – 4 content tiles */}
        <div className="hf-left">
          <Link to="/help" className="hf-tile">
            <div className="hf-tile-title">Centrum pomoci</div>
            <div className="hf-tile-sub">FAQ, návody, dokumentácia</div>
          </Link>

          <Link to="/contact" className="hf-tile">
            <div className="hf-tile-title">Kontakt</div>
            <div className="hf-tile-sub">support@holohome.io · Live chat (beta)</div>
          </Link>

          <Link to="/community" className="hf-tile">
            <div className="hf-tile-title">Komunita</div>
            <div className="hf-tile-sub">Discord · Fórum · Blog novinky</div>
          </Link>

          <Link to="/privacy" className="hf-tile">
            <div className="hf-tile-title">Ochrana súkromia</div>
            <div className="hf-tile-sub">GDPR · Podmienky · Cookies nastavenia</div>
          </Link>
        </div>

        {/* RIGHT – big promo/image area */}
        <aside className="hf-hero" aria-label="Promo panel">
          {/* replace with your real image */}
          <img
            src="https://picsum.photos/1600/700?blur=1"
            alt="HoloHome ukážka"
            loading="lazy"
          />
        </aside>

        {/* SOCIAL row */}
        <div className="hf-socialrow">
          <a className="hf-sbox" href="#" aria-label="YouTube">YT</a>
          <a className="hf-sbox" href="#" aria-label="Facebook">FB</a>
          <a className="hf-sbox" href="#" aria-label="Instagram">IG</a>
          <a className="hf-sbox" href="#" aria-label="X / Twitter">X</a>
          <a className="hf-sbox" href="#" aria-label="LinkedIn">in</a>
        </div>
      </div>

      {/* full-width bottom bar */}
      <div className="hf-legalbar">
        <div>© {new Date().getFullYear()} HoloHome · All rights reserved.</div>
        <nav className="hf-legal-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
