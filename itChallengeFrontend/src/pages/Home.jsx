import React from "react";
import "./home.css";
import Navbar from "../components/navbar/Navbar.jsx";      // if you export default
import Footer from "../components/footer/Footer.jsx";      // adjust paths to yours
import Slider from "../components/slider/Slider";
// If your files are in different dirs, update imports accordingly.

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="home">
        {/* ===== HERO / SLIDER (reusable) ===== */}
        <Slider
          slides={[
            {
              id: "home-1",
              video: "/assets/videos/hero.mp4",
              image: "/assets/images/hero.jpg",
              title: "Predictably unexpected",
              subtitle: "A short punchy line that hints at your product value.",
              actions: [
                  // keep original visual style for the CTA but navigate to /shop
                  { label: "Zistiť viac", href: "/shop", variant: "btn-ghost" },
              ],
            },
          ]}
        />

        {/* ===== ABOUT US (text + side image) ===== */}
  <section id="about" className="home-about container">
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
