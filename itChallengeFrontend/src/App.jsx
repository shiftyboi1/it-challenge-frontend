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
