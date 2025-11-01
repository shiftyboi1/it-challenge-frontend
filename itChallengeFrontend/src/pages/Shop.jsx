import React, { useMemo, useState } from "react";
import "./Shop.css";

// components (adjust paths if your tree differs)
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import SelectButton from "../components/select_button/Selectbuton";
import Product from "../components/product/Product";

// --- mock data (swap for API later) ---
const ALL_PRODUCTS = [
  {
    id: "phone-6a",
    name: "Phone (6a) Pro",
    shortDesc: "Predictably unexpected",
    longDesc:
      "A flagship-grade camera, clean Android, and playful glyphs. Built for everyday creativity with a battery that actually lasts.",
    price: "€599",
    image: "/assets/images/phone6a_hero.jpg",
    segment: "domov", // domov | bytovka
  },
  {
    id: "watch-x",
    name: "Watch X",
    shortDesc: "Future on your wrist",
    longDesc:
      "Edge-to-edge display, week-long battery, health sensors, and a minimal UI that doesn’t get in your way.",
    price: "€199",
    image: "/assets/images/watchx.jpg",
    segment: "bytovka",
  },
  {
    id: "sensor-kit",
    name: "Holo Sensor Kit",
    shortDesc: "Temperature, humidity & light",
    longDesc:
      "ESP32 + DHT22 + lux sensor prepojené do HoloHome. Otvorený kód, jednoduché nasadenie, komunitné rozšírenia.",
    price: "€89",
    image: "/assets/images/sensors.jpg",
    segment: "domov",
  },
];

export default function Shop() {
  const [segment, setSegment] = useState("domov"); // "domov" | "bytovka"

  const items = useMemo(
    () => ALL_PRODUCTS.filter((p) => p.segment === segment),
    [segment]
  );

  return (
    <>
      <Navbar />

      <main className="shop">
        {/* ===== HERO / SLIDER (same vibe as Home) ===== */}
        <section className="shop-hero">
          {/* Replace with your own video or image */}
          <video
            className="shop-hero-video"
            autoPlay
            muted
            loop
            playsInline
            src="/assets/videos/hero.mp4"
          />
          <div className="shop-hero-glass">
            <h1 className="shop-title">Shop</h1>
            <p className="shop-sub">Curated tech for smart living.</p>
          </div>
        </section>

        {/* ===== SELECTOR BAR (Domov/Bytovka) ===== */}
        <div className="shop-select container">
          <SelectButton
            defaultValue="domov"
            onChange={(val) => setSegment(val)}
          />
        </div>

        {/* ===== PRODUCTS GRID ===== */}
        <section className="shop-grid container">
          {items.map((p) => (
            <Product
              key={p.id}
              id={p.id}
              name={p.name}
              shortDesc={p.shortDesc}
              longDesc={p.longDesc}
              price={p.price}
              image={p.image}
            />
          ))}
        </section>

        {/* ===== “WE’RE HELPING …” SECTION ===== */}
        <section className="shop-help container">
          <div className="shop-help-media">
            <img
              src="/assets/images/helping.png"
              alt="Helping homes illustration"
              loading="lazy"
            />
          </div>
          <div className="shop-help-copy">
            <h2>We’re helping 300+ homes</h2>
            <p>
              HoloHome sa stará o automatizáciu a šetrí energiu v reálnych
              domácnostiach. Pridaj sa a získaj prehľad aj kontrolu bez
              kompromisov.
            </p>
            <ul>
              <li>⚡ Optimalizácia spotreby</li>
              <li>🔒 Súčasťou je bezpečné cloud-prepojenie</li>
              <li>🛠️ Komunita a 24/7 podpora</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
