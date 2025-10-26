import React from "react";
import "./footer.css";

export default function Footer() {
  const actions = [
    { label: "Support", href: "/support", icon: "?" },
    { label: "Contact", href: "/contact", icon: "✉️" },
    { label: "Community", href: "/community", icon: "👥" },
    { label: "Privacy", href: "/privacy", icon: "▾" },
  ];

  const socials = [
    { label: "Instagram", href: "#", emoji: "📸" },
    { label: "YouTube", href: "#", emoji: "▶️" },
    { label: "X", href: "#", emoji: "✖️" },
    { label: "TikTok", href: "#", emoji: "🎵" },
  ];

  return (
    <footer className="ft">
      <div className="ft-inner">
        {/* Left: stacked action cards */}
        <div className="ft-cards">
          {actions.map((a) => (
            <a key={a.label} className="ft-card" href={a.href}>
              <span className="ft-card-label">{a.label}</span>
              <span className="ft-card-icon">{a.icon}</span>
            </a>
          ))}
        </div>

        {/* Right: brand + slogan + socials */}
        <div className="ft-brand">
          <div className="ft-brand-row">
            <img className="ft-logo" src="/logo.ico" alt="HoloHome" />
            <h3 className="ft-title">HoloHome</h3>
          </div>

          <p className="ft-slogan">“Smart living. Simple choice.”</p>

          <div className="ft-socials">
            {socials.map((s) => (
              <a key={s.label} className="ft-social" href={s.href} aria-label={s.label} title={s.label}>
                <span className="ft-social-emoji">{s.emoji}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom tiny line (optional) */}
      <div className="ft-bottom">
        <small>© {new Date().getFullYear()} HoloHome · All rights reserved.</small>
      </div>
    </footer>
  );
}
