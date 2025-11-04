import React, { useState } from "react";
import "./register.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Heslá sa nezhodujú");
      return;
    }
    if (password.length < 8) {
      setError("Heslo musí byť aspoň 8 znakov");
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      await api.post('/users', { email, name, password });
      // Auto login after registration
      await auth.login(email, password);
      navigate("/account");
    } catch (err) {
      setError(err.message || 'Registrácia zlyhala');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="register">
        <section className="home-hero full-screen">
          <Slider
            slides={[
              {
                id: "register-1",
                image: '../src/assets/images/sliderregister.webp',
                title: "Vytvoriť účet",
                subtitle: "Získaj prístup ku košíku a objednávkam.",
                actions: [{ label: "Späť na domovskú stránku", href: "/", variant: "btn-dark" }],
              },
            ]}
            showControls={false}
          />
        </section>
        <section className="register-wrap">
          <div className="register-card glass">
            <h1 className="register-title">Registrácia</h1>
            <p className="register-sub">Vytvor si účet v <strong>HoloHome</strong></p>

            <form className="register-form" onSubmit={handleSubmit}>
              <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
                <label>
                  <span>Meno</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Vaše meno"
                  />
                </label>
                <label>
                  <span>Priezvisko</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Vaše priezvisko"
                  />
                </label>
              </div>

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

              <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
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
                <label>
                  <span>Overenie hesla</span>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </label>
              </div>

              {error && <div className="register-error">{error}</div>}

              <button type="submit" disabled={loading}>
                {loading ? "Vytváram účet…" : "Vytvoriť účet"}
              </button>

              <p className="register-hint">
                Máš už účet?{" "}
                <a onClick={() => navigate("/login")}>Prihlás sa</a>
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
