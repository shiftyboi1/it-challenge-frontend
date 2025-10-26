import React, { useState } from "react";
import "./product.css";
import "./productiab.css";
import "./productnad.css";
import ProductIAB from "./productiab";
import ProductNAD from "./productnad";

export default function Product({
  id,
  name,
  shortDesc,
  longDesc = "Long description goes here. Add features, specs, story, and everything the user needs to know.",
  price,
  image,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="product-card" style={{ backgroundImage: `url(${image})` }}>
        <div className="product-overlay">
          <h2 className="product-name">{name}</h2>
          <p className="product-short">{shortDesc}</p>
          <div className="product-bottom">
            <span className="product-price">{price}</span>
            <button className="product-btn" onClick={() => setOpen(true)}>
              More
            </button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {open && (
        <>
          <div className="pd-backdrop" onClick={() => setOpen(false)} />
          <aside className={`pd-panel ${open ? "open" : ""}`} role="dialog" aria-modal="true">
            <button className="pd-close" aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>

            <div className="pd-grid">
              {/* LEFT: image + price/buy box */}
              <ProductIAB image={image} price={price} onBuy={() => alert(`Buying ${name}`)} />

              {/* RIGHT: name + long description */}
              <ProductNAD name={name} longDesc={longDesc} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
