import React from "react";
import "./Merch.css";
import Navbar from "../components/navbar/Navbar";         
import Footer from "../components/footer/Footer";        
import Slider from "../components/slider/Slider";
import ProductM from "../components/product_merch/ProductM"; 

// Merch images
import TrikoB from "../assets/images/TrikoB.png";
import TrikoC from "../assets/images/trikoC.png";
import MikinaSM from "../assets/images/MikinaSM.png";
import MikinaB from "../assets/images/MikinaB.png";
import PoharB from "../assets/images/poharB.png";
import PoharG from "../assets/images/poharG.png";
import PoharW from "../assets/images/poharW (4).png";

const MERCH = [
  // One product – Tričko: B (biele) / C (čierne)
  {
    id: "tricko",
    name: "Tričko HoloHome",
    shortDesc: "Kvalitné tričko s minimalistickým logom.",
    price: 24.9,
    image: TrikoC,
    imageByColor: {
      "#ffffff": TrikoB, // biele
      "#222222": TrikoC, // čierne
    },
    colors: ["#ffffff", "#222222"],
  },
  // Second product – Mikina SM (variant)
  {
    id: "mikina-sm",
    name: "Mikina Smartie",
    shortDesc: "Príjemná mikina s pohodlným strihom.",
    price: 49.9,
    image: MikinaSM,
    colors: ["#2b2b2b",],
  },
  // Third product – Mikina B (black)
  {
    id: "mikina-b",
    name: "Mikina HoloHome",
    shortDesc: "Klasická biela mikina s logom.",
    price: 49.9,
    image: MikinaB,
    colors: ["#eee",],
  },
  // Fourth product – Pohár B/G/W
  {
    id: "pohar",
    name: "Pohár HoloHome",
    shortDesc: "Sklenený pohár v troch farbách.",
    price: 12.9,
    image: PoharB,
    imageByColor: {
      "#222222": PoharB, // black
      "#74bc74": PoharG, // green (brand)
      "#ffffff": PoharW, // white
    },
    colors: ["#222222", "#74bc74", "#ffffff"],
  },
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
              imageByColor={m.imageByColor}
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
