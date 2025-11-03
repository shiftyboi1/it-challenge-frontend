import React from "react";
import "./home.css";
import Navbar from "../components/navbar/Navbar.jsx";      
import Footer from "../components/footer/Footer.jsx";      
import Slider from "../components/slider/Slider";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="home">
        {/* Section 1 — full-screen slider */}
        <section className="home-hero full-screen">
          <Slider
            slides={[
              { id: 'naShopDomovByt', image: 'https://picsum.photos/seed/hero1/1600/900', title: 'Domov', subtitle: 'Explore our shop', actions: [ { label: "Zistiť viac", href: "/shop", variant: "btn-dark" } ],},
              { id: 'naShopBytovka', image: 'https://picsum.photos/seed/hero2/1600/900', title: 'Bytovka', subtitle: 'Beautiful, minimal interfaces', actions: [ { label: "Zistiť viac", href: "/shop", variant: "btn-dark" } ],},
              { id: 'naMerch', image: 'https://picsum.photos/seed/hero3/1600/900', title: 'Merch', subtitle: 'Made for everyday life', actions: [ { label: "Zistiť viac", href: "/shop", variant: "btn-dark" } ], },
            ]}
          />
        </section>

        {/* Section 2 — About (full-screen) with generated image */}
        <section className="home-about full-screen">
          <div className="about-inner">
            <div className="about-copy">
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
            <div className="about-media">
              <div className="image-frame">
                <img src={`https://picsum.photos/seed/about-${Date.now()%1000}/1400/900`} alt="About" />
                <div className="image-overlay">
                  <div className="image-overlay-left">
                    <h3>About HoloHome</h3>
                    <p>Modern platform for smart homes, automation and clean design.</p>
                  </div>
                  <div className="image-overlay-right">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — slideshow of generated images (full-screen) */}
        <section className="home-slideshow full-screen">
          <Slider
            slides={[
              { id: 's1', image: 'https://picsum.photos/seed/slide1/1400/900', title: 'HoloHome', subtitle: 'slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan slogan' },
            ]}
          />
        </section>

        {/* Section 4 — product stats (full-screen) */}
        <section className="home-stats full-screen">
          <div className="stats-inner container">
            <div className="stat-card">
              <div className="stat-ico">⚡</div>
              <div className="stat-name">Uptime</div>
              <div className="stat-desc">99.9% uptime across our global infrastructure.</div>
            </div>
            <div className="stat-card">
              <div className="stat-ico">🔒</div>
              <div className="stat-name">Security</div>
              <div className="stat-desc">End-to-end AES-256 encryption for your data.</div>
            </div>
            <div className="stat-card">
              <div className="stat-ico">🛠️</div>
              <div className="stat-name">Support</div>
              <div className="stat-desc">24/7 expert support to keep you running.</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
