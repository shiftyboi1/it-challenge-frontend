import React from "react";
import "./button.css";
import { formatPrice } from "../../utils/format";

export default function BuyButton({ label = "ADD TO BAG", price, currency = "€", onClick }) {
  const displayPrice = price !== undefined && price !== null ? formatPrice(price) : null;

  return (
    <button className="buy-btn" onClick={onClick}>
      {displayPrice && <span className="buy-price">{displayPrice}</span>}
      {displayPrice && " · "}
      <span className="buy-label">{label}</span>
    </button>
  );
}
