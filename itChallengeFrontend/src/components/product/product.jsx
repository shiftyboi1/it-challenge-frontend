import React, { useState } from "react";
import "./product.css";
import "./product_iab.css";
import "./product_nad.css";
import ProductIAB from "./ProductIaB";
import ProductNAD from "./ProductNaD";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";
import { usePanelOpenEffect } from "../../utils/panelEffect";

// Product-specific images
import smartie1 from "../../assets/images/smartie1.png";
import enterprise1 from "../../assets/images/enterprise1.png";
import smartiep from "../../assets/images/smartiep.png";
import enterprisep from "../../assets/images/enterprisep.png";

export default function Product({
  id,
  name,
  shortDesc,
  longDesc = "Long description goes here. Add features, specs, story, and everything the user needs to know.",
  price,
  image,
}) {
  const [open, setOpen] = useState(false);
  usePanelOpenEffect(open);
  const seed = id || name || Math.floor(Math.random() * 999999);
  // Main card background image: use product-specific asset when available
  const mainImage = id === 'smartie' ? smartie1
                   : id === 'enterprise' ? enterprise1
                   : (image || `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900?blur=1`);
  // Panel (IAB) image: use dedicated portrait asset when available
  const panelImage = id === 'smartie' ? smartiep
                    : id === 'enterprise' ? enterprisep
                    : mainImage;
  const cart = useCart();

  return (
    <>
  <div className={`product-card ${id ? `prod-${id}` : ''}`} style={{ backgroundImage: `url(${mainImage})` }}>
        <div className="product-overlay">
          <h2 className="product-name">{name}</h2>
          <p className="product-short">{shortDesc}</p>
          <div className="product-bottom">
            <div className="left-actions">
              <button
                className="buy-btn more-btn"
                onClick={() => cart.addItem({ id, name, price: Number(price) || 0, image: mainImage })}
              >
                {`Kúpiť za ${formatPrice(price)}`}
              </button>
            </div>

            <div className="right-actions">
              <button className="more-btn" onClick={() => setOpen(true)}>
                Viac
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <>
          <div className="pd-backdrop" onClick={() => setOpen(false)} />
          <aside className={`pd-panel ${open ? "open" : ""}`} role="dialog" aria-modal="true">
            <button className="pd-close" aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>

            <div className="pd-grid">
              <ProductIAB image={panelImage} price={price} onBuy={() => cart.addItem({ id, name, price: Number(price) || 0, image: panelImage })} />
              <ProductNAD name={name} longDesc={longDesc} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}

