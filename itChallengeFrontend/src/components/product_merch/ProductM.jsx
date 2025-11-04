import React, { useMemo, useState } from "react";
import "./product_m.css";
// reuse product button styles so the buy CTA matches the main Product component
import "../product/product.css";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

// small helpers
function idOr(name) {
  if (!name) return Math.floor(Math.random() * 999999);
  return String(name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ProductHero({
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
    // Perceived luminance (ITU-R BT.601)
    const luminance = 0.299*r + 0.587*g + 0.114*b;
    return luminance > 220; // consider very light colors (like #fff, #eee) as light
  };

  const handleColor = (c) => {
    setColor(c);
    onColorChange?.(c);
  };
  // ensure a stable picsum background when image is not provided
  const seed = idOr(name);
  // use portrait 2:3 picsum placeholders (width x height)
  const selectedImage = (imageByColor && color && imageByColor[color]) || image;
  const bg = selectedImage || `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1200?blur=1`;
  const cart = useCart();

  return (
    <section className="ph">
      {/* big hero image */}
      <div
        className="ph-hero"
        role="img"
        aria-label={name}
      >
        {/* use an actual <img> like in the footer for clearer loading behavior */}
        <img src={bg} alt={name} loading="lazy" className="ph-hero-img" />
      </div>

      {/* overlay: mimic product.css black translucent box with name, color select and price */}
      <div className="ph-card ph-overlay">
        <div className="ph-card-top">
          <h3 className="ph-title">{name}</h3>
        </div>

        {/* color picker stays here */}
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
                  const payload = { id: seed, name, color, price, image: bg };
                  // Always add to cart for consistent feedback (also opens the preview)
                  cart.addItem(payload);
                  // If a parent provided an onAdd handler, call it too (non-blocking)
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
