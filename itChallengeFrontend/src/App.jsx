import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Merch from "./pages/Merch.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Cart from "./pages/Cart.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Register from "./pages/Register.jsx";

function RequireAuth({ children }) {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <div style={{ padding: 40 }}>Musíš sa prihlásiť. <a href="/login">Prejsť na prihlásenie</a></div>;
  }
  return children;
}

function RequireRole({ children, roles }) {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <div style={{ padding: 40 }}>Musíš sa prihlásiť. <a href="/login">Prejsť na prihlásenie</a></div>;
  }
  if (!roles.includes(auth.role)) {
    return <div style={{ padding: 40 }}>Nemáš oprávnenie zobraziť túto stránku.</div>;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<RequireRole roles={["SPRAVCA","ADMIN"]}><ManagerDashboard /></RequireRole>} />
            <Route path="/admin" element={<RequireRole roles={["ADMIN"]}><AdminDashboard /></RequireRole>} />
            <Route path="*" element={<div style={{ padding: 40 }}>404 - Page not found</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
