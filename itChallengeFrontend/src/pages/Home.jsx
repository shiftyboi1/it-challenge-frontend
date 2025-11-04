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
              <div className="stat-ico" aria-label="Performance icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="stat-name">Uptime</div>
              <div className="stat-desc">99.9% uptime across our global infrastructure.</div>
            </div>
            <div className="stat-card">
              <div className="stat-ico" aria-label="Security icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="stat-name">Security</div>
              <div className="stat-desc">End-to-end AES-256 encryption for your data.</div>
            </div>
            <div className="stat-card">
              <div className="stat-ico" aria-label="Support icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
                </svg>
              </div>
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
