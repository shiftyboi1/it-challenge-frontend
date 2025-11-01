import React from "react";
import "./Merch.css";

import Navbar from "../components/navbar/navbar";           // adjust path if needed
import Footer from "../components/footer/footer";           // "
import ProductM from "../components/product_merch/product_m"; // the merch card (product_m.jsx)

// Demo data (swap images with real files in /assets/images/merch/)
const MERCH = [
  {
    id: "tee-classic",
    name: "Holo Tee Classic",
    price: 24.9,
    image: "/assets/images/merch/tee-classic.jpg",
    colors: ["#ffffff", "#111111", "#a0c4ff"],
  },
  {
    id: "mug",
    name: "Holo Mug",
    price: 12.9,
    image: "/assets/images/merch/mug.jpg",
    colors: ["#ffffff", "#eab308"],
  },
  {
    id: "pen",
    name: "Holo Pen",
    price: 4.9,
    image: "/assets/images/merch/pen.jpg",
    colors: ["#111111", "#bbbbbb"],
  },
  {
    id: "plushie",
    name: "Holo Plushie",
    price: 29.9,
    image: "/assets/images/merch/plushie.jpg",
    colors: ["#ffffff", "#111111"],
  },
  {
    id: "hoodie",
    name: "Holo Hoodie",
    price: 49.9,
    image: "/assets/images/merch/hoodie.jpg",
    colors: ["#111111", "#2b2b2b", "#7c3aed"],
  },
  {
    id: "stickers",
    name: "Sticker Pack",
    price: 6.9,
    image: "/assets/images/merch/stickers.jpg",
    colors: ["#ffffff"],
  },
];

export default function Merch() {
  return (
    <>
      <Navbar />

      <main className="merch">
        {/* ===== HERO / SLIDER ===== */}
        <section className="merch-hero">
          {/* Use either a video (preferred) or a static hero image */}
          {/* If you don't have a video yet, comment the <video> and keep the image */}
          <video
            className="merch-hero-video"
            autoPlay
            muted
            loop
            playsInline
            src="/assets/videos/merch.mp4"
          />
          {/* fallback image example:
          <img className="merch-hero-video" src="/assets/images/merch/hero.jpg" alt="" />
          */}
          <div className="merch-hero-glass">
            <h1 className="merch-title">HoloHome Merch</h1>
            <p className="merch-sub">Minimal gear for maximal vibes.</p>
          </div>
        </section>

        {/* ===== GRID ===== */}
        <section className="merch-grid container">
          {MERCH.map((m) => (
            <ProductM
              key={m.id}
              id={m.id}
              name={m.name}
              price={m.price}
              image={m.image}
              colors={m.colors}
              onBuy={(payload) => console.log("BUY", payload)}
            />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
