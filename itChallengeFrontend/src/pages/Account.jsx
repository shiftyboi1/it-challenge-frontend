import React, { useEffect, useRef, useState } from "react";
import "./account.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { formatPrice } from "../utils/format";
import { Eye, EyeOff } from "lucide-react";

export default function Account() {
  const { user, currentPassword, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const accountRef = useRef(null);
  const ordersRef = useRef(null);

  // keep editable name in sync with current user when auth state changes
  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    };
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get('/orders/my');
        if (!ignore) setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (e) {
        if (!ignore) setError(e.message || 'Nepodarilo sa načítať objednávky');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [isAuthenticated]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Match orders card height to the account card height and allow internal scrolling
  useEffect(() => {
    const accEl = accountRef.current;
    const ordEl = ordersRef.current;
    if (!accEl || !ordEl) return;

    const apply = () => {
      const h = accEl.getBoundingClientRect().height;
      ordEl.style.height = `${h}px`;
    };

    // Observe size changes of the account card
    const ro = new ResizeObserver(() => apply());
    try { ro.observe(accEl); } catch {}
    // Also respond to viewport resizes
    window.addEventListener('resize', apply);
    // Initial sync after layout
    const id = requestAnimationFrame(apply);
    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', apply);
      cancelAnimationFrame(id);
    };
  }, [accountRef, ordersRef, name, showPassword, orders, isAuthenticated]);

  if (!isAuthenticated) {
    return (
        <>
            <Navbar />
            <main className="account">
                <section className="account-wrap">
                    <div className="account-card glass">
                        <h1 className="account-title">Môj účet</h1>
                        <p>Na zobrazenie tejto stránky sa musíš prihlásiť.</p>
                        <button onClick={() => navigate('/login')} className="login-button">Prihlásiť sa</button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="account">
        <section className="home-hero full-screen">
          <Slider
            slides={[
              {
                id: "account-hero",
                image: '../src/assets/images/slideraccount.webp',
                title: "Môj účet",
                subtitle: "Spravuj svoje údaje a pozri si históriu objednávok.",
                actions: [{ label: "Späť na domovskú stránku", href: "/", variant: "btn-dark" }],
              },
            ]}
            showControls={false}
          />
        </section>
        <section className="account-wrap">
          <div className="account-card glass" ref={accountRef}>
            <h1 className="account-title">Môj účet</h1>
            <p className="account-sub">Vitaj, <strong>{user.name || user.email}</strong>!</p>
            
            <div className="account-details">
                <label>
                    <span>Meno</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Zadaj meno"
          />
                </label>
                <label>
                    <span>E-mail</span>
                    <input type="email" value={user.email} readOnly />
                </label>
        <label>
          <span>Aktuálne heslo</span>
          <div className="password-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword || ''}
              readOnly
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}>
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </label>
            </div>

            <button onClick={handleLogout} className="logout-button">Odhlásiť sa</button>
          </div>

          <div className="orders-card glass" ref={ordersRef}>
            <h2 className="orders-title">História objednávok</h2>
            {loading && <div>Načítavam…</div>}
            {error && <div className="orders-error">{error}</div>}
            {!loading && !error && orders.length === 0 && <div className="orders-empty">Zatiaľ žiadne objednávky</div>}
            {!loading && !error && orders.length > 0 && (
              <div className="orders-scroll">
                <div className="orders-list">
                  {orders.map((o) => (
                    <div key={o.id} className="order-item">
                      <div className="order-item-header">
                        <strong>Objednávka #{o.id}</strong>
                        <span className={`order-status status-${String(o.status || '').toLowerCase()}`}>{o.status}</span>
                      </div>

                      <div className="order-item-body">
                        {o.items?.map((it) => (
                          <div key={it.id} className="order-product">
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 600 }}>{it.product?.name} × {it.quantity}</div>
                              </div>
                            </div>
                            <div>{formatPrice((it.price || 0) * (it.quantity || 0))}</div>
                          </div>
                        ))}
                      </div>

                      <div className="order-item-footer">
                        <strong>Spolu: {formatPrice(o.total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
