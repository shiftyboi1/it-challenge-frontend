import React from "react";

export default function ProductIAB({ image, price, onBuy }) {
  return (
    <section className="iab">
      <div className="iab-img" style={{ backgroundImage: `url(${image})` }} />
      <div className="iab-frost">
        <span className="iab-price">{price}</span>
        <button className="iab-btn" onClick={onBuy}>Buy</button>
      </div>
    </section>
  );
}
