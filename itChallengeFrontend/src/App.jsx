import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Merch from "./pages/Merch";
import Account from "./pages/Account";
import Login from "./pages/Login";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar on every page */}
        <Navbar />

        {/* Main content */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        {/* Footer on every page */}
        <Footer />
      </div>
    </Router>
  );
}
