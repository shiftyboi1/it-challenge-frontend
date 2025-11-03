import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import pages
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Merch from "./pages/Merch.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";

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
          {/* Page routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
            <Route path="/admin" element={<RequireRole roles={["ADMIN"]}><AdminDashboard /></RequireRole>} />
            <Route path="/manager" element={<RequireRole roles={["SPRAVCA"]}><ManagerDashboard /></RequireRole>} />
            <Route path="*" element={<div style={{ padding: 40 }}>404 - Page not found</div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
