import React, { useState } from "react";
import "./product.css";
import "./product_iab.css";
import "./product_nad.css";
import ProductIAB from "./ProductIaB";
import ProductNAD from "./ProductNaD";

export default function Product({
  id,
  name,
  shortDesc,
  longDesc = "Long description goes here. Add features, specs, story, and everything the user needs to know.",
  price,
  image,
}) {
  const [open, setOpen] = useState(false);
  // keep navbar visible while the product panel is open
  usePanelOpenEffect(open);
  // Always use a picsum random/seedy image for the hero background so every
  // product appears as a full-bleed hero. Use a seed from the product id or
  // name so the image is stable per-product; remove fallback to provided
  // `image` prop so the page looks consistent with the hero layout.
  const seed = id || name || Math.floor(Math.random() * 999999);
  const bg = `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900?blur=1`;

  return (
    <>
      <div className="product-card" style={{ backgroundImage: `url(${bg})` }}>
        <div className="product-overlay">
          <h2 className="product-name">{name}</h2>
          <p className="product-short">{shortDesc}</p>
          <div className="product-bottom">
            <div className="left-actions">
              <button className="buy-btn more-btn" onClick={() => alert(`Buying ${name}`)}>
                {`Buy for ${price}`}
              </button>
            </div>

            <div className="right-actions">
              <button className="more-btn" onClick={() => setOpen(true)}>
                More
              </button>
            </div>
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
              {/* LEFT: image + price/buy box - pass the same random bg so drawer matches hero */}
              <ProductIAB image={bg} price={price} onBuy={() => alert(`Buying ${name}`)} />

              {/* RIGHT: name + long description */}
              <ProductNAD name={name} longDesc={longDesc} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}

// keep a small side-effect so pages that open the product drawer can tell the
// navbar to remain visible while the panel is open. We add/remove a global
// class on <html> which the Navbar scroll handler checks.
export function usePanelOpenEffect(open) {
  React.useEffect(() => {
    if (open) document.documentElement.classList.add("panel-open");
    else document.documentElement.classList.remove("panel-open");
    return () => document.documentElement.classList.remove("panel-open");
  }, [open]);
}
