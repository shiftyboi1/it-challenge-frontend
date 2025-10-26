import React, { useState } from "react";

/**
 * Navbar.jsx
 *
 * Usage:
 * <Navbar name="My Company" logoSrc="/path/to/logo.png" />
 *
 * Drop this file in src/components/Navbar.jsx
 */

export default function Navbar({ name = "Company Name", logoSrc = "/logo.png" }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="brand">
                <img src={logoSrc} alt={`${name} logo`} className="logo" />
                <span className="company-name">{name}</span>
            </div>

            <button
                className="burger"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
            >
                <span className={`bar ${open ? "open" : ""}`} />
                <span className={`bar ${open ? "open" : ""}`} />
                <span className={`bar ${open ? "open" : ""}`} />
            </button>

            <div className={`nav-links ${open ? "open" : ""}`}>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#shop">Shop</a></li>
                    <li><a href="#merch">Merch</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>

            <style>{`
                .navbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 0.5rem 1rem;
                    background: #ffffff;
                    border-bottom: 1px solid rgba(0,0,0,0.08);
                    position: relative;
                    z-index: 10;
                    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .logo {
                    width: 44px;
                    height: 44px;
                    object-fit: contain;
                    border-radius: 6px;
                }

                .company-name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #111827;
                }

                .nav-links ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .nav-links a {
                    text-decoration: none;
                    color: #111827;
                    padding: 0.5rem 0.6rem;
                    border-radius: 6px;
                    transition: background 0.15s, color 0.15s;
                }

                .nav-links a:hover {
                    background: rgba(0,0,0,0.04);
                }

                .burger {
                    display: none; /* hidden on desktop */
                    background: transparent;
                    border: none;
                    padding: 0.25rem;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                }

                .burger:focus {
                    outline: 2px solid #2563eb;
                    outline-offset: 2px;
                }

                .bar {
                    display: block;
                    width: 22px;
                    height: 2px;
                    background: #111827;
                    margin: 4px 0;
                    transition: transform 0.18s ease, opacity 0.18s ease;
                }

                /* Burger open animation */
                .bar.open:nth-child(1) {
                    transform: translateY(6px) rotate(45deg);
                }
                .bar.open:nth-child(2) {
                    opacity: 0;
                }
                .bar.open:nth-child(3) {
                    transform: translateY(-6px) rotate(-45deg);
                }

                /* Responsive: show burger and hide links by default */
                @media (max-width: 820px) {
                    .burger {
                        display: inline-flex;
                    }

                    .nav-links {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: #fff;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
                        overflow: hidden;
                        max-height: 0;
                        transition: max-height 0.25s ease;
                    }

                    .nav-links.open {
                        max-height: 260px; /* enough to show all links */
                    }

                    .nav-links ul {
                        flex-direction: column;
                        gap: 0;
                    }

                    .nav-links li {
                        border-top: 1px solid rgba(0,0,0,0.04);
                    }

                    .nav-links a {
                        display: block;
                        padding: 0.9rem 1rem;
                    }
                }
            `}</style>
        </nav>
    );
}