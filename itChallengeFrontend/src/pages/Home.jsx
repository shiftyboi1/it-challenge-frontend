import React from "react";
import "./home.css";
import Navbar from "../components/navbar/navbar.jsx";      // if you export default
import Footer from "../components/footer/footer.jsx";      // adjust paths to yours
// If your files are in different dirs, update imports accordingly.

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="home">
        {/* ===== HERO / SLIDER (video) ===== */}
        <section className="home-hero">
          <video
            className="home-hero-video"
            autoPlay
            muted
            loop
            playsInline
            // replace with your video in /assets/videos
            src="/assets/videos/hero.mp4"
          />
          <div className="home-hero-glass">
            <h1 className="home-hero-title">Predictably unexpected</h1>
            <p className="home-hero-sub">
              A short punchy line that hints at your product value.
            </p>
            <div className="home-hero-actions">
              <button className="btn-ghost">Zistiť viac</button>
              <button className="btn-solid">Shop</button>
            </div>
          </div>
        </section>

        {/* ===== ABOUT US (text + side image) ===== */}
        <section className="home-about container">
          <div className="home-about-text">
            <h2>About HoloHome</h2>
            <p>
              HoloHome spája chytré zariadenia, automatizáciu a čistý dizajn.
              Moderná platforma pre domov aj bytovky.
            </p>
            <ul className="bullets">
              <li>Jednoduché nasadenie</li>
              <li>Rýchly servis a komunita</li>
              <li>Bezpečnosť a súkromie</li>
            </ul>
          </div>
          <div className="home-about-img">
            <img src="/assets/images/about.jpg" alt="About" />
          </div>
        </section>

        {/* ===== BIG IMAGE STRIP ===== */}
        <section className="home-strip">
          <img src="/assets/images/strip.jpg" alt="Showcase" />
        </section>

        {/* ===== STATS / ICON CIRCLES ===== */}
        <section className="home-stats container">
          <div className="stat">
            <div className="stat-ico">⚡</div>
            <div className="stat-text">
              <strong>99.9%</strong>
              <span>Uptime</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-ico">🔒</div>
            <div className="stat-text">
              <strong>AES-256</strong>
              <span>Security</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-ico">🛠️</div>
            <div className="stat-text">
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
