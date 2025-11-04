import React, { useEffect, useMemo, useState } from "react";
import "./Merch.css";
import Navbar from "../components/navbar/Navbar";         
import Footer from "../components/footer/Footer";        
import Slider from "../components/slider/Slider";
import ProductM from "../components/product_merch/ProductM"; 
import api from "../utils/api";
import { MERCH_META, MERCH_IDS } from "../data/merchMeta";

export default function Merch() {
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
        const merchFromApi = products.filter(p => MERCH_IDS.has(p.id));
        if (!ignore) setAllProducts(merchFromApi);
      } catch (e) {
        if (!ignore) setError(e.message || 'Nepodarilo sa načítať produkty');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const merchIdsToShow = useMemo(() => ['mikina-b', 'mikina-sm', 'pohar', 'tricko'], []);
  const items = useMemo(() => {
    const list = merchIdsToShow.map((id) => {
      const apiProd = allProducts.find((p) => p.id === id) || null;
      const meta = MERCH_META[id] || {};
      return {
        id: id,
        name: apiProd?.name || meta.fallback?.name || id,
        shortDesc: (apiProd?.description || meta.fallback?.shortDesc || '').slice(0, 100),
        price: Number((apiProd?.cost ?? meta.fallback?.price) || 0),
        image: meta.image || apiProd?.image,
        colors: [],
        imageByColor: undefined,
      };
    });
    return list;
  }, [allProducts]);

  return (
    <>
      <Navbar />

      <main className="merch">
        <section className="home-hero full-screen">
          <Slider
            showControls={false}
            slides={[
              {
                id: "merch-1",
                image: 'https://picsum.photos/seed/hero1/1600/900',
                title: "Náš dizajn, tvoj každodenný štýl.",
                subtitle: "Oblečenie a doplnky s logom HoloHome pre tých, ktorí žijú technológiou.Minimalistické, moderné a vytvorené pre komfortný život – aj mimo domova.",
                actions: [],
              },
            ]}
          />
        </section>

        <section id="merch" className="merch-grid container">
          {loading && <div style={{padding:16}}>Načítavam merch…</div>}
          {error && <div style={{padding:16, color:'var(--danger, #b91c1c)'}}>{error}</div>}
          {!loading && !error && items.map((m) => (
            <ProductM
              key={m.id}
              id={m.id}
              name={m.name}
              shortDesc={m.shortDesc}
              price={m.price}
              image={m.image}
              colors={[]}
              imageByColor={undefined}
              onAdd={(payload) => console.log("BUY", payload)}
            />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
