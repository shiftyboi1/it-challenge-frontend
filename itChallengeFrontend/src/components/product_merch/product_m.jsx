import React, { useMemo, useState } from "react";
import "./product_m.css";

export default function ProductHero({
  name = "Product name",
  price = 0,
  currency = "€",
  image,
  thumb,
  features = [],
  colors = [],
  defaultColor,
  onAdd,
  onColorChange,
}) {
  const initial = defaultColor || (colors.length ? colors[0] : "");
  const [color, setColor] = useState(initial);

  const priceText = useMemo(() => {
    if (typeof price === "number") return `${currency}${price}`;
    return price?.toString()?.startsWith(currency) ? price : `${currency}${price}`;
  }, [price, currency]);

  const isHex = (c) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c);

  const handleColor = (c) => {
    setColor(c);
    onColorChange?.(c);
  };

  return (
    <section className="ph">
      {/* big hero image */}
      <div
        className="ph-hero"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={name}
      />

      {/* frosted product card */}
      <div className="ph-card">
        <div className="ph-card-top">
          <h3 className="ph-title">{name}</h3>
          {thumb && <img src={thumb} alt="" className="ph-thumb" />}
        </div>

        {!!features.length && (
          <ul className="ph-features">
            {features.map((f, i) => (
              <li key={i} className="ph-feature">
                <span className="ph-ico" aria-hidden>✣</span>
                <span className="ph-txt">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {!!colors.length && (
          <div className="ph-picker">
            {/* if plain names (WHITE), show <select>;
                if HEX values, show clickable dots */}
            {isHex(colors[0]) ? (
              <div className="ph-dots">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`ph-dot ${color === c ? "active" : ""}`}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                    title={c}
                    onClick={() => handleColor(c)}
                  />
                ))}
              </div>
            ) : (
              <select
                aria-label="Select color"
                className="ph-select"
                value={color}
                onChange={(e) => handleColor(e.target.value)}
              >
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <button
          className="ph-cta"
          onClick={() => onAdd?.({ name, color, price })}
        >
          {priceText} · ADD TO BAG
        </button>
      </div>
    </section>
  );
}
