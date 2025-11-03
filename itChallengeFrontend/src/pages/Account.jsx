import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";

export default function Account() {
  return (
    <>
      <Navbar />
      <Slider
        slides={[
          {
            id: "account-1",
            image: "/assets/images/account-hero.jpg",
            title: "Your account",
            subtitle: "Manage your orders, settings and profile.",
            actions: [{ label: "Go to orders", href: "/orders", variant: "btn-solid" }],
          },
        ]}
      />

      <main className="account container">
        <h1>Account page</h1>
        <p>Welcome to your account page.</p>
      </main>

      <Footer />
    </>
  );
}
