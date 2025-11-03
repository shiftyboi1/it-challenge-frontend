import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Shop.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";
import SelectButton from "../components/selection/Selectbutton";
import Product from "../components/product/Product";


function useHashScroll() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      import("../utils/scrollWithSliderOffset")
        .then(({ scrollWithSliderOffset }) => {
          scrollWithSliderOffset(id).catch(() => {});
        })
        .catch(() => {});
    }, 60);
    return () => clearTimeout(t);
  }, [location]);
}

const ALL_PRODUCTS = [
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
  const [segment, setSegment] = useState("domov");
  useHashScroll();
  const items = useMemo(
    () => ALL_PRODUCTS.filter((p) => p.segment === segment),
    [segment]
  );
  return (
    <>
      <Navbar />
      <main className="shop">
        <Slider
          slides={[
            {
              id: "shop-1",
              video: "/assets/videos/hero.mp4",
              image: "/assets/images/shop-hero.jpg",
              title: "Shop",
              subtitle: "Curated tech for smart living.",
              actions: [],
            },
          ]}
        />
        <div id="products" className="shop-select container">
          <SelectButton
            defaultValue="domov"
            onChange={(val) => setSegment(val)}
          />
        </div>
        
        <section className="shop-grid container">
          {items.map((p) => (
            <div key={p.id} className="product-row">
              <Product
                id={p.id}
                name={p.name}
                shortDesc={p.shortDesc}
                longDesc={p.longDesc}
                price={p.price}
                image={p.image}
              />
            </div>
          ))}
        </section>

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

