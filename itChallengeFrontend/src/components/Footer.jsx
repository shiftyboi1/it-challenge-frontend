const Footer = () => {
    const year = new Date().getFullYear();

    const styles = {
        footer: {
            background: "#0f1724",
            color: "#e6eef8",
            padding: "48px 20px",
            fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        },
        container: {
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "space-between",
        },
        column: {
            minWidth: 180,
            flex: "1 1 180px",
        },
        brand: {
            fontSize: 18,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 8,
        },
        slogan: {
            fontSize: 14,
            color: "#cfe6ff",
            marginBottom: 12,
        },
        heading: {
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 12,
            color: "#fff",
        },
        link: {
            display: "block",
            color: "#cfe6ff",
            textDecoration: "none",
            marginBottom: 8,
            fontSize: 14,
        },
        contactLine: {
            fontSize: 14,
            marginBottom: 8,
            color: "#cfe6ff",
        },
        socials: {
            display: "flex",
            gap: 12,
            marginTop: 8,
        },
        socialBtn: {
            width: 36,
            height: 36,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: "#0b1220",
            color: "#cfe6ff",
            textDecoration: "none",
        },
        bottom: {
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: 28,
            paddingTop: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: "#a9c6e6",
        },
        smallNav: {
            display: "flex",
            gap: 12,
            alignItems: "center",
        },
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={{ ...styles.column, flex: "1 1 240px" }}>
                    <div style={styles.brand}>Holohome Shop</div>
                    <div style={styles.slogan}>Smarter living, simpler life — intelligent assistants for houses & flats.</div>
                    <div style={styles.contactLine}>Holohome Ltd.</div>
                    <div style={styles.contactLine}>45 Innovation Drive, Suite 4</div>
                    <a style={styles.link} href="tel:+441234567890">Phone: +44 (1234) 567-890</a>
                    <a style={styles.link} href="mailto:support@holohome.example">support@holohome.example</a>
                </div>

                <div style={styles.column}>
                    <div style={styles.heading}>Shop</div>
                    <a style={styles.link} href="/products">All Products</a>
                    <a style={styles.link} href="/products/assistants">Smart Assistants</a>
                    <a style={styles.link} href="/products/accessories">Accessories</a>
                    <a style={styles.link} href="/deals">Deals & Bundles</a>
                </div>

                <div style={styles.column}>
                    <div style={styles.heading}>Support</div>
                    <a style={styles.link} href="/help/faq">FAQ</a>
                    <a style={styles.link} href="/help/shipping">Shipping & Delivery</a>
                    <a style={styles.link} href="/help/warranty">Warranty & Repairs</a>
                    <a style={styles.link} href="/help/returns">Returns & Exchanges</a>
                    <a style={styles.link} href="/help/contact">Contact Support</a>
                </div>

                <div style={styles.column}>
                    <div style={styles.heading}>Company</div>
                    <a style={styles.link} href="/about">About Us</a>
                    <a style={styles.link} href="/careers">Careers</a>
                    <a style={styles.link} href="/stores">Store Locator</a>
                    <a style={styles.link} href="/blog">Blog</a>
                    <a style={styles.link} href="/privacy">Privacy Policy</a>
                    <a style={styles.link} href="/terms">Terms & Conditions</a>
                </div>

                <div style={styles.column}>
                    <div style={styles.heading}>Follow Us</div>
                    <div style={styles.socials}>
                        <a
                            style={styles.socialBtn}
                            href="https://www.facebook.com"
                            aria-label="Facebook"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.95v-7.04H8.08v-2.9h2.36V9.41c0-2.33 1.39-3.61 3.51-3.61.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.9h-2.1v7.04C18.34 21.2 22 17.06 22 12.07z" />
                            </svg>
                        </a>

                        <a
                            style={styles.socialBtn}
                            href="https://www.instagram.com"
                            aria-label="Instagram"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.4-3.6a1.12 1.12 0 1 0 1.12 1.12A1.12 1.12 0 0 0 18.4 4.6z" />
                            </svg>
                        </a>

                        <a
                            style={styles.socialBtn}
                            href="https://twitter.com"
                            aria-label="Twitter"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M22 5.92c-.63.28-1.3.47-2 .56a3.43 3.43 0 0 0 1.5-1.9 6.86 6.86 0 0 1-2.18.84A3.43 3.43 0 0 0 12.5 8.1c0 .27.03.53.1.78A9.75 9.75 0 0 1 3.2 5.16a3.43 3.43 0 0 0 1.06 4.58 3.4 3.4 0 0 1-1.55-.43v.04a3.43 3.43 0 0 0 2.75 3.36c-.5.14-1.03.17-1.57.06a3.44 3.44 0 0 0 3.21 2.38A6.88 6.88 0 0 1 2 19.54a9.7 9.7 0 0 0 5.26 1.54c6.31 0 9.77-5.23 9.77-9.76v-.44A6.98 6.98 0 0 0 22 5.92z" />
                            </svg>
                        </a>

                        <a
                            style={styles.socialBtn}
                            href="https://www.linkedin.com"
                            aria-label="LinkedIn"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M20.45 20.45h-3.6v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.15 1.45-2.15 2.96v5.71h-3.6V9h3.45v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.41 4.33 5.54v6.7zM5.34 7.43a2.09 2.09 0 1 1 .01-4.18 2.09 2.09 0 0 1-.01 4.18zM6.99 20.45H3.7V9h3.29v11.45z" />
                            </svg>
                        </a>

                        <a
                            style={styles.socialBtn}
                            href="https://www.youtube.com"
                            aria-label="YouTube"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.2-1-3-.2-7.5-.2-7.5-.2s-4.5 0-7.5.2c-.5.1-1.4.1-2.2 1C.7 4.5.5 6.2.5 6.2S.3 8 .3 9.8v2.4c0 1.8.2 3.6.2 3.6s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.8.2 7.1.2 7.1.2s4.5 0 7.5-.2c.5-.1 1.4-.1 2.2-1 .6-.7.8-2.4.8-2.4s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.8 15.5V8.5l6.1 3.5-6.1 3.5z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div style={{ ...styles.container, ...styles.bottom }}>
                <div>
                    © {year} Holohome Ltd. — Smarter living, simpler life.
                </div>

                <nav style={styles.smallNav} aria-label="Footer navigation">
                    <a style={styles.link} href="/privacy">Privacy</a>
                    <a style={styles.link} href="/terms">Terms</a>
                    <a style={styles.link} href="/sitemap">Sitemap</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;