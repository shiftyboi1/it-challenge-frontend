import React from "react";

import { formatPrice } from "../../utils/format";

export default function ProductIAB({ image, price, onBuy }) {
  return (
    <section className="iab">
      <div className="iab-img" style={{ backgroundImage: `url(${image})` }} />
      <div className="iab-frost">
        <span className="iab-price">{formatPrice(price)}</span>
        <button className="buy-btn more-btn" onClick={onBuy}>Buy</button>
      </div>
    </section>
  );
}
