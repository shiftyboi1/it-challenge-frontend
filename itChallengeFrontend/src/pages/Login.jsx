import React, { useState } from "react";
import "./login.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      // expected: { token, user? }
      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

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
