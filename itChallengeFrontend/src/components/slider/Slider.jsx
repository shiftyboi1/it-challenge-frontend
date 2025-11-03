import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Slider.css";
import { scrollWithSliderOffset } from "../../utils/scrollWithSliderOffset";

export default function Slider({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  if (!slides || slides.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const s = slides[index];
  const seed = s.id || s.title || index;
  const generatedImage = !s.image && !s.video ? `https://picsum.photos/seed/${encodeURIComponent(
    String(seed)
  )}/1600/700?blur=1` : undefined;
  const backgroundUrl = s.image || generatedImage;

  return (
    <section className="slider">
      <div
        className="slider-media"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        }}
      >
        {s.video ? (
          <video
            className="slider-video"
            src={s.video}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : null}
      </div>

      <div className="slider-overlay container">
        <div className="slider-copy">
          {s.title && <h1 className="slider-title">{s.title}</h1>}
          {s.subtitle && <p className="slider-sub">{s.subtitle}</p>}

          {s.actions && s.actions.length > 0 && (
            <div className="slider-actions">
              {s.actions.map((a, i) => {
                if (a.href && a.href.startsWith("#")) {
                  const id = a.href.slice(1);
                  return (
                    <a
                      key={i}
                      className={`btn ${a.variant || "btn-ghost"}`}
                      href={a.href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollWithSliderOffset(id).catch(() => {});
                          }}
                    >
                      {a.label}
                    </a>
                  );
                }

                if (a.href && a.href.startsWith("/")) {
                  return (
                    <a
                      key={i}
                      className={`btn ${a.variant || "btn-ghost"}`}
                      href={a.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(a.href);
                      }}
                    >
                      {a.label}
                    </a>
                  );
                }

                return a.href ? (
                  <a key={i} className={`btn ${a.variant || "btn-ghost"}`} href={a.href}>
                    {a.label}
                  </a>
                ) : (
                  <button key={i} className={`btn ${a.variant || "btn-ghost"}`} onClick={a.onClick}>
                    {a.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="slider-controls">
        <button aria-label="Prev" className="slider-arrow" onClick={prev}>
          ‹
        </button>
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button aria-label="Next" className="slider-arrow" onClick={next}>
          ›
        </button>
      </div>
    </section>
  );
}
