import React, { useMemo, useState } from "react";
import "./product_m.css";
import "../product/product.css";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

// small helpers
function idOr(name) {
  if (!name) return Math.floor(Math.random() * 999999);
  return String(name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ProductHero({
  id,
  name = "Product name",
  price = 0,
  currency = "€",
  image,
  imageByColor,
  colors = [],
  defaultColor,
  onAdd,
  onColorChange,
}) {
  const initial = defaultColor || (colors.length ? colors[0] : "");
  const [color, setColor] = useState(initial);

  const priceText = useMemo(() => formatPrice(price), [price]);

  const isHex = (c) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c);
  const isLightHex = (hex) => {
    if (!isHex(hex)) return false;
    let h = hex.replace('#', '').toLowerCase();
    if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
    const r = parseInt(h.slice(0,2), 16);
    const g = parseInt(h.slice(2,4), 16);
    const b = parseInt(h.slice(4,6), 16);
    const luminance = 0.299*r + 0.587*g + 0.114*b;
    return luminance > 220; 
  };

  const handleColor = (c) => {
    setColor(c);
    onColorChange?.(c);
  };
  const seed = id || idOr(name);
  const selectedImage = (imageByColor && color && imageByColor[color]) || image;
  const bg = selectedImage || `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1200?blur=1`;
  const cart = useCart();

  return (
    <section className={`ph ${id ? `ph-${id}` : ''}`}>
      <div
        className="ph-hero"
        role="img"
        aria-label={name}
      >
        <img src={bg} alt={name} loading="lazy" className="ph-hero-img" />
      </div>

      <div className="ph-card ph-overlay">
        <div className="ph-card-top">
          <h3 className="ph-title">{name}</h3>
        </div>

        {!!colors.length && (
          <div className="ph-picker">
            {isHex(colors[0]) ? (
              <div className="ph-dots">
                {colors.map((c) => {
                  const light = isLightHex(c);
                  return (
                    <button
                      key={c}
                      data-color={c}
                      className={`ph-dot ${light ? 'is-light' : ''} ${color === c ? "active" : ""}`}
                      style={{ background: c }}
                      aria-label={`Color ${c}`}
                      title={c}
                      onClick={() => handleColor(c)}
                    />
                  );
                })}
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

        <div className="ph-bottom">
          <div className="ph-left-actions">
            <div className="ph-price">{priceText}</div>
          </div>
          <div className="ph-right-actions">
            <button
              className="buy-btn more-btn"
              onClick={() => {
                    const payload = { id: seed, name, color, price: Number(price || 0), image: bg };
                    cart.addItem(payload);
                    try { onAdd && onAdd(payload); } catch { /* swallow handler errors */ }
                  }}
            >
              {`Kúpiť`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
