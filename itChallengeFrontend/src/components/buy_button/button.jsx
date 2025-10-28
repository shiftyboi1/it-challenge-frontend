import React from "react";
import "./button.css";

/**
 * BuyButton
 * Props:
 *  - label: string (e.g. "ADD TO BAG")
 *  - price?: string|number (optional)
 *  - currency?: string (default "€")
 *  - onClick?: function
 */
export default function BuyButton({ label = "ADD TO BAG", price, currency = "€", onClick }) {
  const displayPrice =
    price !== undefined && price !== null
      ? `${currency}${price}`
      : null;

  return (
    <button className="buy-btn" onClick={onClick}>
      {displayPrice && <span className="buy-price">{displayPrice}</span>}
      {displayPrice && " · "}
      <span className="buy-label">{label}</span>
    </button>
  );
}
