import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Import pages
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Merch from "./pages/Merch.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* Temporary simple navigation for testing */}
      <nav
        style={{
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          borderBottom: "1px solid #eee",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/merch">Merch</Link>
        <Link to="/account">Account</Link>
        <Link to="/login">Login</Link>
      </nav>

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div style={{ padding: 40 }}>404 - Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
