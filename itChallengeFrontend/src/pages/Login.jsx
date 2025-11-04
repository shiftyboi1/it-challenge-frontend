import React, { useState } from "react";
import "./login.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await auth.login(email, password);
      navigate("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="login">
        <section className="home-hero full-screen">
          <Slider
            slides={[
              {
                id: "login-1",
                image: 'https://picsum.photos/seed/hero1/1600/900',
                title: "Vitaj späť.",
                subtitle: "Prihlás sa a spravuj svoj inteligentný domov jednoducho, bezpečne a kdekoľvek si.",
                actions: [{ label: "Späť na domovskú stránku", href: "/", variant: "btn-dark" }],
              },
            ]}
            showControls={false}
          />
        </section>
        <section className="login-wrap">
          <div className="login-card glass">
            <h1 className="login-title">Prihlásenie</h1>
            <p className="login-sub">Vitaj späť v <strong>HoloHome</strong></p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label>
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span>Heslo</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </label>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" disabled={loading}>
                {loading ? "Prihlasovanie…" : "Prihlásiť sa"}
              </button>

              <p className="login-hint">
                Nemáš účet?{" "}
                <a onClick={() => navigate("/register")}>Registruj sa</a>
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
