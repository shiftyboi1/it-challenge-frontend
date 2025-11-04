import React from "react";
import "./Merch.css";
import Navbar from "../components/navbar/Navbar";         
import Footer from "../components/footer/Footer";        
import Slider from "../components/slider/Slider";
import ProductM from "../components/product_merch/ProductM"; 

const MERCH = [
  {
    id: "tee-classic",
    name: "Tričko HoloHome",
    shortDesc: "Soft cotton tee with minimal branding.",
    price: 24.9,
    image: `https://picsum.photos/seed/tee-classic/800/1200?blur=1`,
    colors: ["#ffffff", "#111111", "#a0c4ff"],
  },
  { id: "hoodie", name: "Mikina HoloHome", shortDesc: "Cozy hoodie with a relaxed fit.", price: 49.9, image: `https://picsum.photos/seed/hoodie/800/1200?blur=1`, colors: ["#111111", "#2b2b2b", "#7c3aed"] },
  { id: "mug", name: "Mikina Smartie", shortDesc: "Ceramic mug, dishwasher safe.", price: 12.9, image: `https://picsum.photos/seed/mug/800/1200?blur=1`, colors: ["#ffffff", "#eab308"] },
  { id: "shop-bag", name: "Pohár HoloHome", shortDesc: "Reusable tote for everyday carry.", price: 14.9, image: `https://picsum.photos/seed/shop-bag/800/1200?blur=1`, colors: ["#ffffff", "#111111"] },
];

export default function Merch() {
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
          {MERCH.map((m) => (
            <ProductM
              key={m.id}
              id={m.id}
              name={m.name}
              shortDesc={m.shortDesc}
              price={m.price}
              image={m.image}
              colors={m.colors}
              onAdd={(payload) => console.log("BUY", payload)}
            />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
