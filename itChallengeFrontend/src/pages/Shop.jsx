import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Shop.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";
import SelectButton from "../components/selection/Selectbutton";
import Product from "../components/product/Product";
import api from "../utils/api";
import { scrollWithSliderOffset } from "../utils/scrollWithSliderOffset";


function useHashScroll() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      scrollWithSliderOffset(id).catch(() => {});
    }, 60);
    return () => clearTimeout(t);
  }, [location]);
}

// Products are fetched from backend. We'll show a simple filter toggle placeholder.

export default function Shop() {
  const [segment, setSegment] = useState("domov");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get('/products');
        const products = Array.isArray(data?.products) ? data.products : [];
        // Adapt server shape -> frontend
        const adapted = products.map((p) => ({
          id: p.id,
          name: p.name,
          shortDesc: p.description?.slice(0, 80) || '',
          longDesc: p.description || '',
          price: Number(p.cost || 0),
          image: `/assets/images/product-${p.id}.jpg`, // may not exist; cards use picsum fallback
          segment: 'domov',
        }));
        if (!ignore) setAllProducts(adapted);
      } catch (e) {
        if (!ignore) setError(e.message || 'Nepodarilo sa načítať produkty');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);
  useHashScroll();
  const items = useMemo(
    () => allProducts.filter((p) => p.segment === segment),
    [segment, allProducts]
  );
  return (
    <>
      <Navbar />
      <main className="shop">
        <section className="home-hero full-screen">
          <Slider
            slides={[
              {
                id: "shop-1",
                image: 'https://picsum.photos/seed/hero1/1600/900',
                title: "Shop",
                subtitle: "Curated tech for smart living.",
                actions: [],
              },
            ]}
          />
        </section>
        <div id="products" className="shop-select container">
          <SelectButton
            defaultValue="domov"
            onChange={(val) => setSegment(val)}
          />
        </div>

        <section className="shop-grid container">
          {loading && <div style={{padding:16}}>Načítavam produkty…</div>}
          {error && <div style={{padding:16, color:'var(--danger, #b91c1c)'}}>{error}</div>}
          {!loading && !error && items.map((p) => (
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

