import React from "react";
import "./Merch.css";

import Navbar from "../components/navbar/Navbar";           // adjust path if needed
import Footer from "../components/footer/Footer";           // "
import Slider from "../components/slider/Slider";
import ProductM from "../components/product_merch/ProductM"; // the merch card (product_m.jsx)

// Show exactly 4 merch products (2 per row)
const MERCH = [
  {
    id: "tee-classic",
    name: "Holo Tee Classic",
    shortDesc: "Soft cotton tee with minimal branding.",
    price: 24.9,
    image: `https://picsum.photos/seed/tee-classic/800/1200?blur=1`,
    colors: ["#ffffff", "#111111", "#a0c4ff"],
  },
  { id: "hoodie", name: "Holo Hoodie", shortDesc: "Cozy hoodie with a relaxed fit.", price: 49.9, image: `https://picsum.photos/seed/hoodie/800/1200?blur=1`, colors: ["#111111", "#2b2b2b", "#7c3aed"] },
  { id: "mug", name: "Holo Mug", shortDesc: "Ceramic mug, dishwasher safe.", price: 12.9, image: `https://picsum.photos/seed/mug/800/1200?blur=1`, colors: ["#ffffff", "#eab308"] },
  { id: "shop-bag", name: "Holo Tote Bag", shortDesc: "Reusable tote for everyday carry.", price: 14.9, image: `https://picsum.photos/seed/shop-bag/800/1200?blur=1`, colors: ["#ffffff", "#111111"] },
];

export default function Merch() {
  return (
    <>
      <Navbar />

      <main className="merch">
        {/* ===== HERO / SLIDER ===== */}
        <Slider
          slides={[
            {
              id: "merch-1",
              video: "/assets/videos/merch.mp4",
              image: "/assets/images/merch/hero.jpg",
              title: "HoloHome Merch",
              subtitle: "Minimal gear for maximal vibes.",
              // removed 'Shop merch' CTA per request
              actions: [],
            },
          ]}
        />

  {/* ===== GRID ===== */}
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
